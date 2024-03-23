<script>
  import { onMount } from "svelte";

  let width = 0;
  let height = 0;

  onMount(() => {
    width = window.innerWidth;
    height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
    });
  });
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
<div class="bg-base py-2">
  <ul class="flex items-center">
    <!-- Logo Area -->
    <li>
      <button class="text-4xl mx-3 text-text ml-4"> SB~% </button>
    </li>
    <!-- a spacer -->
    <li class="flex-auto"></li>
    <!-- Hamburger Menu -->
    <button class="flex sm:flex md:hidden py-1 px-3 mx-3 mr-4"
      ><span class="material-symbols-outlined text-9xl text-text"> menu </span>
    </button>
    <!-- the other 3 buttons -->
    <li>
      <div class="text-lg hidden sm:hidden md:flex">
        <button class="bg-surface2 rounded-md py-1 px-3 mx-3 text-text">
          Blog
        </button>
        <button class="bg-surface2 rounded-md py-1 px-3 mx-3 text-text">
          Projects
        </button>
        <button class="bg-surface2 rounded-md py-1 px-3 mx-3 mr-4 text-text">
          Contact
        </button>
      </div>
    </li>
  </ul>
</div>
<div>
  {width}, {height}
</div>
