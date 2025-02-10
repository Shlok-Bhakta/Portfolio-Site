<script>
  import { onMount, onDestroy } from 'svelte';

  // New props
  export let svgContent = '';
  export let altText = '';
  export let primaryColor = '#fef08a';
  export let url = ''; // New prop for the clickable URL

  // Existing props
  export let gap = '3';
  export let speed = '20';
  export let noFocus = false;

  let canvas;
  let ctx;
  let pixels = [];
  let animation;
  let resizeObserver;
  let timeInterval = 1000 / 60;
  let timePrevious = performance.now();
  let reducedMotion;

  const isBrowser = typeof window !== 'undefined';

  const safeCancelAnimationFrame = (id) => {
    if (isBrowser && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(id);
    }
  };

  // Function to generate similar colors
  function generateSimilarColors(baseColor) {
    const rgb = parseInt(baseColor.slice(1), 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;

    const variations = [
      [r, g, b],
      [Math.max(0, r - 20), Math.max(0, g - 20), Math.max(0, b - 20)],
      [Math.min(255, r + 20), Math.min(255, g + 20), Math.min(255, b + 20)]
    ];

    return variations.map(([r, g, b]) => `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`);
  }

  $: colors = generateSimilarColors(primaryColor);

  class Pixel {
    constructor(canvas, context, x, y, color, speed, delay) {
      this.width = canvas.width;
      this.height = canvas.height;
      this.ctx = context;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = this.getRandomValue(0.1, 0.9) * speed;
      this.size = 0;
      this.sizeStep = Math.random() * 0.4;
      this.minSize = 0.5;
      this.maxSizeInteger = 2;
      this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
      this.delay = delay;
      this.counter = 0;
      this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
      this.isIdle = false;
      this.isReverse = false;
      this.isShimmer = false;
    }

    getRandomValue(min, max) {
      return Math.random() * (max - min) + min;
    }

    draw() {
      const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(
        this.x + centerOffset,
        this.y + centerOffset,
        this.size,
        this.size
      );
    }

    appear() {
      this.isIdle = false;

      if (this.counter <= this.delay) {
        this.counter += this.counterStep;
        return;
      }

      if (this.size >= this.maxSize) {
        this.isShimmer = true;
      }

      if (this.isShimmer) {
        this.shimmer();
      } else {
        this.size += this.sizeStep;
      }

      this.draw();
    }

    disappear() {
      this.isShimmer = false;
      this.counter = 0;

      if (this.size <= 0) {
        this.isIdle = true;
        return;
      } else {
        this.size -= 0.1;
      }

      this.draw();
    }

    shimmer() {
      if (this.size >= this.maxSize) {
        this.isReverse = true;
      } else if (this.size <= this.minSize) {
        this.isReverse = false;
      }

      if (this.isReverse) {
        this.size -= this.speed;
      } else {
        this.size += this.speed;
      }
    }
  }

  function init() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    pixels = [];
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    createPixels();
  }

  function getDistanceToCanvasCenter(x, y) {
    const dx = x - canvas.width / 2;
    const dy = y - canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance;
  }

  function createPixels() {
    const gapValue = parseInt(gap);
    const speedValue = parseFloat(speed) * 0.001;

    for (let x = 0; x < canvas.width; x += gapValue) {
      for (let y = 0; y < canvas.height; y += gapValue) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = reducedMotion ? 0 : getDistanceToCanvasCenter(x, y);

        pixels.push(new Pixel(canvas, ctx, x, y, color, speedValue, delay));
      }
    }
  }

  function animate(fnName) {
    if (!isBrowser) return;

    animation = window.requestAnimationFrame(() => animate(fnName));

    const timeNow = performance.now();
    const timePassed = timeNow - timePrevious;

    if (timePassed < timeInterval) return;

    timePrevious = timeNow - (timePassed % timeInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pixels.length; i++) {
      pixels[i][fnName]();
    }

    if (pixels.every((pixel) => pixel.isIdle)) {
      safeCancelAnimationFrame(animation);
    }
  }

  function handleAnimation(name) {
    safeCancelAnimationFrame(animation);
    animation = animate(name);
  }

  function handleMouseEnter() {
    handleAnimation('appear');
  }

  function handleMouseLeave() {
    handleAnimation('disappear');
  }

  function handleFocusIn(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('appear');
  }

  function handleFocusOut(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('disappear');
  }

  onMount(() => {
    if (!isBrowser || !canvas) return;

    ctx = canvas.getContext('2d');
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    init();
    resizeObserver = new ResizeObserver(() => init());
    resizeObserver.observe(canvas);

    const parent = canvas.parentNode;
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);

      if (!noFocus) {
        parent.addEventListener('focusin', handleFocusIn);
        parent.addEventListener('focusout', handleFocusOut);
      }
    }
  });

  onDestroy(() => {
    if (!isBrowser) return;

    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeEventListener('mouseenter', handleMouseEnter);
      canvas.parentNode.removeEventListener('mouseleave', handleMouseLeave);

      if (!noFocus) {
        canvas.parentNode.removeEventListener('focusin', handleFocusIn);
        canvas.parentNode.removeEventListener('focusout', handleFocusOut);
      }
    }
    safeCancelAnimationFrame(animation);
  });
</script>

<div class="w-full h-full">
  <a target="_blank" href={url} class="card" style:--active-color={primaryColor} class:no-url={!url}>
    <canvas bind:this={canvas}></canvas>
    <!-- <img src={svgContent} alt={altText} class="sr-only" /> -->
    {@html svgContent}
    <span class="sr-only">{altText}</span>
  </a>
</div>

<style>
  :global(:root) {
    --space: 1rem;
    --bg: #11111b;
    --fg: #cdd6f4;
    --surface-1: #181825;
    --surface-2: #1e1e2e;
    --surface-3: #313244;
    --ease-out: cubic-bezier(0.5, 1, 0.89, 1);
    --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  }

  .card {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-areas: "card";
    place-items: center;
    width: 100%;
    height: 100%;
    /* aspect-ratio: 4/5; */
    border: 1px solid var(--surface-2);
    isolation: isolate;
    transition: border-color 200ms var(--ease-out);
    user-select: none;
    text-decoration: none;
    color: inherit;
  }

  .card.no-url {
    pointer-events: none;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at bottom left,
      transparent 10%,
      var(--surface-1)
    );
    pointer-events: none;
    box-shadow: var(--bg) -0.5cqi 0.5cqi 2.5cqi inset;
    transition: opacity 900ms var(--ease-out);
  }

  .card::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    aspect-ratio: 1;
    background: radial-gradient(circle, var(--bg), transparent 65%);
    opacity: 0;
    transition: opacity 800ms var(--ease-out);
  }

  .card > * {
    grid-area: card;
  }

  .card :global(svg) {
    position: relative;
    z-index: 1;
    width: 30%;
    height: auto;
    color: var(--surface-3);
    transition: 300ms var(--ease-out);
    transition-property: color, scale;
  }

  .card:focus-within {
    outline: 5px auto Highlight;
    outline: 5px auto -webkit-focus-ring-color;
  }

  .card:where(:hover, :focus-within) {
    border-color: var(--active-color, var(--fg));
    transition: border-color 800ms var(--ease-in-out);
  }

  .card:where(:hover, :focus-within) :global(svg) {
    color: var(--active-color, var(--fg));
    scale: 1.1;
    transition: 300ms var(--ease-in-out);
  }

  .card:where(:hover, :focus-within)::before {
    opacity: 0;
  }

  .card:where(:hover, :focus-within)::after {
    opacity: 1;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>