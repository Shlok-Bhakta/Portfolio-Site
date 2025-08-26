<script>
  import { fade } from "svelte/transition";
  
  let { globalColor = "#00ffd5" } = $props();
  
  let clicked = $state(false);
  function toggle() {
    clicked = !clicked;
  }
</script>

<button 
  onclick={toggle} 
  class="p-2 border border-overlay0 bg-surface0/50 hover:bg-surface1 transition-all duration-200"
  style={`hover:border-color: ${globalColor};`}
>
  <svg 
    class="w-4 h-4 text-text transition-colors duration-200" 
    style={`color: ${globalColor};`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
</button>

{#if clicked}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed top-0 left-0 right-0 bottom-0 bg-base/95 backdrop-blur-xl z-[100] p-6"
    onclick={toggle}
  >
    <div 
      class="bg-crust/95 backdrop-blur-sm border border-overlay0 shadow-2xl w-full max-w-md mx-auto mt-20 overflow-hidden"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header with close button -->
      <div class="flex items-center justify-between p-6 bg-mantle/95 border-b border-overlay0">
        <span class="text-lg font-mono text-white font-medium" style={`color: ${globalColor};`}>menu.nav</span>
        <button 
          onclick={toggle} 
          class="p-2 hover:bg-surface0 rounded-md transition-colors"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Navigation links -->
      <div class="p-6 space-y-4">
        <a 
          href="/" 
          onclick={toggle} 
          class="block p-4 font-mono text-base text-white bg-surface0/80 hover:bg-surface1 border border-overlay0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          style={`hover:border-color: ${globalColor}; hover:color: ${globalColor};`}
        > 
          ~/home
        </a>
        <a 
          href="/blog/" 
          onclick={toggle} 
          class="block p-4 font-mono text-base text-white bg-surface0/80 hover:bg-surface1 border border-overlay0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          style={`hover:border-color: ${globalColor}; hover:color: ${globalColor};`}
        > 
          ./blog
        </a>
        <a 
          href="/projects/" 
          onclick={toggle} 
          class="block p-4 font-mono text-base text-white bg-surface0/80 hover:bg-surface1 border border-overlay0 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
          style={`hover:border-color: ${globalColor}; hover:color: ${globalColor};`}
        > 
          ./projects
        </a>
      </div>
    </div>
  </div>
{/if}
