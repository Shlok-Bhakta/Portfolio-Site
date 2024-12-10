<script>
    import { currentEdit, showImage } from "./stores";
    import { PreRendered } from "carta-md";
    import "../../styles/blog.css";
</script>





<div class="flex justify-center mt-4">
  <div class="card w-4/5 lg:w-2/4 p-1" style='border-color: ${$currentEdit.color}'>
    {#if $showImage}
        <img class="aspect-video w-[calc(100vw-40px)] max-w-4xl mt-4 rounded-md border-2 border-text" style="border-color: {$currentEdit.color};" bind:this={$currentEdit.thumbnail} alt={$currentEdit.title} />
    {:else}
        <img class="aspect-video w-[calc(100vw-40px)] max-w-4xl mt-4 rounded-md border-2 border-text" style="border-color: {$currentEdit.color};" src={$currentEdit.thumbnail} alt={$currentEdit.title} />
    {/if}
  </div>
</div>
<div class="flex justify-center">
  <div class="title text-center text-text nerdfont">
    {$currentEdit.title}
  </div>
</div>
<div class="flex justify-center">
  <article
  class="flex w-full bg-mantle center flex-col justify-center nerdfont p-3 mx-8 rounded-md"
  >
    <PreRendered html={$currentEdit.html} />
  </article>
</div>
<div>
  <img src="/ReadingThanks.svg" class="w-full px-6 pt-12 max:w-4xl" />
</div>

