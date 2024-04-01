<script>
  let clicked = false;
  function toggle() {
    clicked = !clicked;
    console.log(clicked);
  }
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
<div class="">
  <button on:click={toggle} class="flex md:hidden mx-3 mr-4"
    ><span
      class="material-symbols-outlined text-9xl text-text py-1.5 px-3 hover:bg-surface1 rounded-md"
    >
      menu
    </span>
  </button>

  <dialog open={clicked} class="bg-base px-auto py-3 rounded-md">
    <div class="flex flex-col space-y-3 items-center">
      <a
        href="/blog/"
        class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"
      >
        Blog
      </a>
      <a
        href="/projects/"
        class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 text-text nerdfont text-center"
      >
        Projects
      </a>
      <a
        href="/contact/"
        class="bg-surface2 rounded-md py-7 w-[80svw] mx-3 mr-4 text-text nerdfont text-center"
      >
        Contact
      </a>
    </div>
  </dialog>
</div>
