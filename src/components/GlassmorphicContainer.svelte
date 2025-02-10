<script>
  import { onMount } from 'svelte';
  
  export let color = '#00ffd5';
  
  let cardElement;
  let mouseX = 0;
  let mouseY = 0;
  let isHovering = false;
  
  const handleMouseMove = (event) => {
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      isHovering = true;
    }
  };

  const handleMouseLeave = () => {
    isHovering = false;
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
    opacity: ${isHovering ? 1 : 0};
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
    transition: opacity 400ms ease, mask 400ms ease;
    will-change: mask, opacity;
  `;
</script>

<!-- Invisible larger wrapper -->
<div 
  class="p-8" 
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  style="margin: -2rem;"
  aria-hidden="true"
>
  <!-- Actual card -->
  <div class="relative" bind:this={cardElement}>
    <div 
      class="p-6 rounded-lg border border-subtext0/20 bg-mantle text-gray-100 transition-colors duration-300 hover:bg-opacity-80 hover:backdrop-blur-sm"
      style={Object.entries(hslStyles).map(([key, value]) => `${key}: ${value}`).join(';')}
    >
      <slot></slot>
    </div>
    
    <div
      class="absolute inset-0 pointer-events-none select-none rounded-xl"
      style={overlayStyles}
    ></div>
  </div>
</div>