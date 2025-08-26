<script>
  import { onMount, onDestroy } from 'svelte';
  import { cardEffects, registerCard, unregisterCard, updateCardPosition } from './GlassmorphicController';
  import { nanoid } from 'nanoid';
  
  let { color = '#00ffd5', text_color = '#cdd6f4', text = '', title_offset = '1.5rem', padding = '1.5rem', borderWidth = '1px', boxShadow = true } = $props();

  let cardElement = $state();
  let titleElement = $state();
  const cardId = nanoid();
  let effect = $state({ mouseX: 0, mouseY: 0, intensity: 0 });
  let currentGlitchText = $state(text);
  let isGlitching = $state(false);
  
  let glitchText = $derived(isGlitching ? currentGlitchText : text);
  
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  const glitchUpdateInterval = 8; // Update glitch text every 3 frames
  
  function startGlitch() {
    if (isGlitching) return;
    isGlitching = true;
    
    const originalText = text;
    const textLength = originalText.length;
    let frame = 0;
  const totalFrames = 60; // Medium speed - 15 frames at 60fps = ~250ms
    
    const animate = () => {
      if (frame >= totalFrames) {
        isGlitching = false;
        return;
      }
      
      // Only update glitch text every n frames
      if (frame % glitchUpdateInterval === 0) {
        // Generate glitched text
        let newText = '';
        for (let i = 0; i < textLength; i++) {
          if (Math.random() < 0.4) { // 40% chance to glitch each character
            newText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            newText += originalText[i];
          }
        }
        currentGlitchText = newText;
      }
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }
  
  // Subscribe to card effects
  $effect(() => {
    if ($cardEffects.has(cardId)) {
      effect = $cardEffects.get(cardId);
    } else {
      effect = { mouseX: 0, mouseY: 0, intensity: 0 };
    }
  });
  
  
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
  let overlayStyles = $derived(`
    --glow-color: ${color}CF;
    --glow-light-color: ${color}20;
    --glow-opacity: ${effect.intensity * 1.2};
    --mouse-x: ${effect.mouseX}px;
    --mouse-y: ${effect.mouseY}px;
    --text_color: ${text_color};
    --color: ${color};
    --content-padding: ${padding};
    --border-width: ${borderWidth};
    --box-shadow: ${boxShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(205, 214, 244, 0.05)' : 'none'};
  `);
</script>

<style>
  .glassmorphic-container {
    position: relative;
    z-index: 10;
    transform: translateZ(0);
    isolation: isolate;
  }

  .content {
    padding: var(--content-padding, 1.5rem);
    border: var(--border-width, 1px) solid #7f849c;
    background-color: rgba(30, 30, 46, 0.85);
    color: rgb(205, 214, 244);
    box-shadow: var(--box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
    transition: background-color 150ms ease;
  }

  .content:hover {
    background-color: rgba(30, 30, 46, 0.95);
  }

  .overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    opacity: var(--glow-opacity, 0);
    -webkit-mask: radial-gradient(15rem 15rem at var(--mouse-x, 0) var(--mouse-y, 0), #000 5%, transparent 50%);
    mask: radial-gradient(15rem 15rem at var(--mouse-x, 0) var(--mouse-y, 0), #000 5%, transparent 50%);
    background-color: var(--glow-light-color, currentColor);
    border: 1px solid var(--glow-color, currentColor);
    box-shadow: 0 0 8px color-mix(in srgb, var(--glow-color, currentColor) 40%, transparent);
    will-change: opacity;
    transform: translateZ(0);
  }

  .upper {
    color: var(--text_color, 0);
    border-color: #7f849c;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100vw - 2rem);
  }

</style>

<div
  class="glassmorphic-container w-full h-full"
  bind:this={cardElement}
  onmouseenter={text ? startGlitch : undefined}
>
  {#if text}
  <div class="absolute -top-3 z-20 bg-mantle text-xs md:text-[1rem]" style="left: {title_offset};">
    <div 
      style={overlayStyles} 
      class="upper border-2 px-3 py-1 select-none" 
      bind:this={titleElement}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === 'Enter' && startGlitch()}
    >
      {@html glitchText}
    </div>
    <div class="overlay w-full h-full" style={overlayStyles}></div>
  </div>
  {/if}
  
  <div class="content w-full h-full">
    <slot></slot>
  </div>
  
  <div class="overlay w-full h-full" style={overlayStyles}></div>
</div>