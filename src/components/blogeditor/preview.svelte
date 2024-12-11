<script>
    import { currentEdit, showImage, imageElement } from "./stores";
    import { PreRendered } from "carta-md";
    import "../../styles/blog.css";
</script>



<style>
  .card {
      backdrop-filter: blur(5px) saturate(180%);
      -webkit-backdrop-filter: blur(5px) saturate(180%);
      background-color: #3132443f;
      border-radius: 12px;
      border:  1px solid;
  }
</style>

<div class="flex justify-center mt-4">
  <div class="card w-4/5 lg:w-2/4 p-1" style='border-color: {$currentEdit.color};'>
    {#if $showImage}
        <img class="aspect-auto w-full rouned-md" src={$imageElement} alt={$currentEdit.title} />
    {:else}
        <img class="aspect-auto w-full rouned-md" src={$currentEdit.thumbnail} alt={$currentEdit.title} />
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

