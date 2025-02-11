<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let color = '#00ffd5';
  
  let cardElement;
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;
  let intensity = 0;
  let isDragging = false;

  const HOVER_DISTANCE = 800; // Distance in pixels to start the effect
  const dispatch = createEventDispatcher();
  
  const updatePosition = (clientX, clientY) => {
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    
    // Calculate distance to nearest point on card
    const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
    const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate normalized distance (0 = on/inside card, 1 = at or beyond HOVER_DISTANCE)
    const normalizedDistance = Math.max(0, Math.min(1, 1 - distance / HOVER_DISTANCE));
    intensity = normalizedDistance;
    
    if (normalizedDistance > 0) {
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
      isHovering = true;
    } else {
      isHovering = false;
    }
  };

  // Handle mouse events
  const updateMousePosition = (event) => {
    updatePosition(event.clientX, event.clientY);
  };

  // Handle touch events
  const handleTouchStart = (event) => {
    isDragging = true;
    const touch = event.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    event.preventDefault(); // Prevent scrolling while dragging
    const touch = event.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    isDragging = false;
    isHovering = false;
    intensity = 0;
  };
  
  onMount(() => {
    const handleGlobalMouseMove = (event) => {
      if (!isDragging) { // Only process mouse moves if not currently dragging via touch
        // Update this instance
        updateMousePosition(event);
        
        // Notify other instances
        dispatch('mousemove', {
          clientX: event.clientX,
          clientY: event.clientY
        });
      }
    };

    // Listen for mousemove events from other instances
    window.addEventListener('glassmorphic-mousemove', (e) => {
      if (e.detail && e.detail !== cardElement && !isDragging) { // Don't process events while dragging
        updatePosition(e.detail.clientX, e.detail.clientY);
      }
    });

    document.addEventListener('mousemove', handleGlobalMouseMove);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  });

  // When this instance receives a mousemove event from another instance
  const handleInstanceMouseMove = (event) => {
    // Dispatch a custom event that other instances can listen to
    const customEvent = new CustomEvent('glassmorphic-mousemove', {
      detail: {
        element: cardElement,
        clientX: event.detail.clientX,
        clientY: event.detail.clientY
      }
    });
    window.dispatchEvent(customEvent);
  };
  
  // CSS custom properties for the glow color
  $: hslStyles = {
    '--hue': '165',
    '--saturation': '82.26%',
    '--lightness': '51.37%',
    '--hsl': 'var(--hue), var(--saturation), var(--lightness)'
  };
  
  // Computed styles for the overlay with intense border glow
  $: overlayStyles = `
    opacity: ${intensity};
    -webkit-mask: radial-gradient(25rem 25rem at ${mouseX}px ${mouseY}px, #000 1%, transparent 50%);
    mask: radial-gradient(25rem 25rem at ${mouseX}px ${mouseY}px, #000 1%, transparent 50%);
    background-color: ${color}33;
    border: 2px solid ${color};
    box-shadow: 0 0 2px ${color},
                0 0 4px ${color},
                0 0 6px ${color},
                0 0 8px ${color},
                0 0 15px ${color}80,
                inset 0 0 20px ${color}40;
    transition: all 200ms ease;
    will-change: mask, opacity;
  `;
</script>

<div
  class="relative"
  bind:this={cardElement}
  on:mousemove={handleInstanceMouseMove}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  on:touchcancel={handleTouchEnd}
>
  <div 
    class="p-6 rounded-xl border border-subtext0/20 bg-mantle text-gray-100 transition-colors duration-200 bg-opacity-80 backdrop-blur-sm"
    style={Object.entries(hslStyles).map(([key, value]) => `${key}: ${value}`).join(';')}
  >
    <slot></slot>
  </div>
  
  <div
    class="absolute inset-0 pointer-events-none select-none rounded-xl"
    style={overlayStyles}
  ></div>
</div>