<script>
  import { fade } from "svelte/transition";
  let clicked = $state(false);
  function toggle() {
    clicked = !clicked;
  }
</script>

<div class="">
  <button onclick={toggle} class="flex md:hidden mx-3 mr-4">
    <img src="/menu.svg" alt="Menu Icon" class="text-text py-1.5 px-3 bg-inherit transition-all ease-in-out delay-50 hover:bg-surface1 rounded-md w-12">
  </button>

  {#if clicked}
    <div
      id="dialogbox"
      transition:fade={{ duration: 100 }}
      class="absolute scale-100 -top-4 -left-4 w-svw h-svh flex items-center justify-center bg-base px-auto py-3 m-3 rounded-md backdrop-blur-md bg-opacity-30"
    >
      <div class="flex flex-col space-y-3 items-center">
        <button onclick={toggle} class="flex mx-3 mr-4">
          <img src="/close.svg" alt="Close Menu" class="text-text py0.5 px-1.5 transition-all ease-in-out delay-50 bg-surface0 hover:bg-surface1 rounded-md w-12">
        
        </button>
        <a href="/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Home </a>
        <a href="/blog/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Blog </a>
        <a href="/projects/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Projects </a>
        <!-- <a href="/contact/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 mr-4 text-text nerdfont text-center"> Contact </a> -->
      </div>
    </div>
  {/if}
</div>
