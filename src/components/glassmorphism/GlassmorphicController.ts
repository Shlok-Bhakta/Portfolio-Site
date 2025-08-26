import { writable, derived } from 'svelte/store';

interface CardElement {
  element: HTMLElement;
  rect: DOMRect;
  color: string;
}

interface CardEffect {
  mouseX: number;
  mouseY: number;
  intensity: number;
}

// Store for mouse position relative to viewport
export const mousePosition = writable({ x: 0, y: 0 });

// Store for scroll position
export const scrollPosition = writable({ x: 0, y: 0 });

// Store for registered cards
const cards = writable(new Map<string, CardElement>());

// Derived store that calculates effects for cards in range
export const cardEffects = derived(
  [mousePosition, scrollPosition, cards],
  ([$mousePosition, $scrollPosition, $cards]) => {
    const effects = new Map<string, CardEffect>();
    const HOVER_DISTANCE = 100; // Reduced from 150px
    const HOVER_DISTANCE_SQUARED = HOVER_DISTANCE * HOVER_DISTANCE; // Avoid sqrt when possible

    // Adjust mouse position for scroll
    const scrollAdjustedX = $mousePosition.x + $scrollPosition.x;
    const scrollAdjustedY = $mousePosition.y + $scrollPosition.y;

    $cards.forEach((card, id) => {
      // Get absolute position of card (including scroll)
      const rect = card.rect;
      const cardAbsoluteLeft = rect.left + $scrollPosition.x;
      const cardAbsoluteTop = rect.top + $scrollPosition.y;
      const cardAbsoluteRight = cardAbsoluteLeft + rect.width;
      const cardAbsoluteBottom = cardAbsoluteTop + rect.height;

      // Calculate distance to nearest point on card using absolute positions
      const dx = Math.max(cardAbsoluteLeft - scrollAdjustedX, 0, scrollAdjustedX - cardAbsoluteRight);
      const dy = Math.max(cardAbsoluteTop - scrollAdjustedY, 0, scrollAdjustedY - cardAbsoluteBottom);
      const distanceSquared = dx * dx + dy * dy;
      
      // Only include cards within range (compare squared distances to avoid sqrt)
      if (distanceSquared <= HOVER_DISTANCE_SQUARED) {
        const distance = Math.sqrt(distanceSquared);
        const intensity = 1 - (distance / HOVER_DISTANCE);
        effects.set(id, {
          mouseX: scrollAdjustedX - cardAbsoluteLeft,
          mouseY: scrollAdjustedY - cardAbsoluteTop,
          intensity
        });
      }
    });

    return effects;
  }
);

// Update mouse position (throttled)
let lastUpdate = 0;
const THROTTLE_MS = 1000 / 15; // 15fps - reduced from 30fps

export function updateMousePosition(x: number, y: number) {
  const now = performance.now();
  if (now - lastUpdate < THROTTLE_MS) return;
  lastUpdate = now;
  mousePosition.set({ x, y });
}

// Register a card with the controller
export function registerCard(id: string, element: HTMLElement, color: string) {
  cards.update($cards => {
    const rect = element.getBoundingClientRect();
    $cards.set(id, { element, rect, color });
    return $cards;
  });
}

// Unregister a card
export function unregisterCard(id: string) {
  cards.update($cards => {
    $cards.delete(id);
    return $cards;
  });
}

// Update card position (e.g., on resize or scroll)
export function updateCardPosition(id: string) {
  cards.update($cards => {
    const card = $cards.get(id);
    if (card) {
      card.rect = card.element.getBoundingClientRect();
    }
    return $cards;
  });
}

// Setup global listeners
if (typeof window !== 'undefined') {
  let rafId: number;
  
  // Mouse move listener
  window.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateMousePosition(e.clientX, e.clientY);
    });
  }, { passive: true });

  // Scroll listener
  window.addEventListener('scroll', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      scrollPosition.set({
        x: window.scrollX,
        y: window.scrollY
      });
      
      // Update all card positions on scroll
      cards.update($cards => {
        $cards.forEach((card) => {
          card.rect = card.element.getBoundingClientRect();
        });
        return $cards;
      });
    });
  }, { passive: true });
}