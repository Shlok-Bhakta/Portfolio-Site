<script>
  import { onMount, onDestroy } from 'svelte';
  import { cardEffects, registerCard, unregisterCard, updateCardPosition } from './GlassmorphicController';
  import { nanoid } from 'nanoid';
  
  export let color = '#00ffd5';
  color = "#cdd6f4"
  
  function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [ h, s, l ];
  }

  let cardElement;
  const cardId = nanoid();
  let effect = { mouseX: 0, mouseY: 0, intensity: 0 };
  
  // Subscribe to card effects
  $: {
    if ($cardEffects.has(cardId)) {
      effect = $cardEffects.get(cardId);
    } else {
      effect = { mouseX: 0, mouseY: 0, intensity: 0 };
    }
  }
  
  onMount(() => {
    if (!cardElement) return;
    
    // Register this card with the controller
    registerCard(cardId, cardElement, color);

    // Update position on resize
    const ro = new ResizeObserver(() => {
      if (cardElement) {
        updateCardPosition(cardId);
      }
    });
    ro.observe(cardElement);

    return () => {
      ro.disconnect();
      unregisterCard(cardId);
    };
  });

  // Computed styles for glow effect
  $: overlayStyles = `
    --glow-color: ${color}50;
    --glow-light-color: ${color}10;
    --glow-opacity: ${effect.intensity};
    --mouse-x: ${effect.mouseX}px;
    --mouse-y: ${effect.mouseY}px;
  `;
</script>

<style>
  .glassmorphic-container {
    position: relative;
    z-index: 10;
    transform: translateZ(0);
    will-change: transform;
  }

  .content {
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(205, 214, 244, 0.2);
    background-color: rgba(30, 30, 46, 0.6);
    color: rgb(205, 214, 244);
    /* backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px); */
    box-shadow: 
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(205, 214, 244, 0.05);
    transition: background-color 200ms ease;
  }

  .content:hover {
    background-color: rgba(30, 30, 46, 0.75);
  }

  .overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    border-radius: 0.75rem;
    opacity: var(--glow-opacity, 0);
    -webkit-mask: radial-gradient(25rem 25rem at var(--mouse-x, 0) var(--mouse-y, 0), #000 1%, transparent 50%);
    mask: radial-gradient(25rem 25rem at var(--mouse-x, 0) var(--mouse-y, 0), #000 1%, transparent 50%);
    background-color: color-mix(in srgb, var(--glow-light-color, currentColor) 20%, transparent);
    border: 2px solid var(--glow-color, currentColor);
    box-shadow: 
      0 0 4px var(--glow-color, currentColor),
      0 0 8px color-mix(in srgb, var(--glow-color, currentColor) 50%, transparent),
      inset 0 0 12px color-mix(in srgb, var(--glow-color, currentColor) 25%, transparent);
    will-change: mask, opacity;
    transform: translateZ(0);
  }
</style>

<div
  class="glassmorphic-container w-full h-full"
  bind:this={cardElement}
>
  <div class="content w-full h-full">
    <slot></slot>
  </div>
  
  <div 
    class="overlay w-full h-full"
    style={overlayStyles}
  ></div>
</div>