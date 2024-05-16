<script>
  import { fade } from "svelte/transition";
  let clicked = false;
  function toggle() {
    clicked = !clicked;
  }
</script>

<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<div class="">
  <button on:click={toggle} class="flex md:hidden mx-3 mr-4">
    <span class="material-symbols-outlined text-9xl text-text py-1.5 px-3 bg-inherit transition-all ease-in-out delay-50 hover:bg-surface1 rounded-md"> menu </span>
  </button>

  {#if clicked}
    <dialog
      open="True"
      id="dialogbox"
      transition:fade={{ duration: 100 }}
      class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-base px-auto py-3 m-3 rounded-md backdrop-blur-md bg-opacity-30"
    >
      <div class="flex flex-col space-y-3 items-center backdrop-blur-md bg-opacity-50">
        <button on:click={toggle} class="flex mx-3 mr-4">
          <span class="material-symbols-outlined text-9xl text-text py-1.5 px-1.5 transition-all ease-in-out delay-50 hover:bg-surface1 rounded-md"> close </span>
        </button>
        <a href="/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Home </a>
        <a href="/blog/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Blog </a>
        <a href="/projects/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"> Projects </a>
        <a href="/contact/" class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 mr-4 text-text nerdfont text-center"> Contact </a>
      </div>
    </dialog>
  {/if}
</div>
