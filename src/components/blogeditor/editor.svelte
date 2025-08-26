<script>
    import Code from "./codeeitor.svelte";
    import Preview from "./preview.svelte";
    import PostPicker from "./postpicker.svelte";
    import ProjectPicker from "./projectpicker.svelte" 
    import { curPage } from "./stores.ts";
</script>

<div class="bg-base p-1 flex flex-row gap-2 w-fit">
    <button class="hover:bg-surface2 px-2 py-1 text-text transition-colors {(($curPage == "Posts") ? "bg-surface2" : "bg-surface1")}" onclick={() => {$curPage = "Posts"}}>Posts</button>
    <button class="hover:bg-surface2 px-2 py-1 text-text transition-colors {(($curPage == "Projects") ? "bg-surface2" : "bg-surface1")}" onclick={() => {$curPage = "Projects"}}>Projects</button>
    <button class="hover:bg-surface2 px-2 py-1 text-text transition-colors {(($curPage == "Editor") ? "bg-surface2" : "bg-surface1")}" onclick={() => {$curPage = "Editor"}}>Editor</button>
    <button class="hover:bg-surface2 px-2 py-1 text-text transition-colors {(($curPage == "Preview") ? "bg-surface2" : "bg-surface1")}" onclick={() => {$curPage = "Preview"}}>Preview</button>
</div>

{#if $curPage == "Posts"}
    <PostPicker />
{:else if $curPage == "Projects"}
    <ProjectPicker />
{:else if $curPage == "Editor"}
    <Code />
{:else if $curPage == "Preview"}
    <Preview />
{/if}
<!-- 
<div>
    <Lbar />
    <Code />
</div> -->