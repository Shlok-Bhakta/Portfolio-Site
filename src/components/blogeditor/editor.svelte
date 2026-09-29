<script>
    import Code from "./codeeitor.svelte";
    import Preview from "./preview.svelte";
    import PostPicker from "./postpicker.svelte";
    import ProjectPicker from "./projectpicker.svelte"
    import { curPage } from "./stores.ts";

    const tabs = ["Posts", "Projects", "Editor", "Preview"];
</script>

<header class="cms-head">
    <h1 class="display-title">Editor</h1>
    <nav class="tabs" aria-label="Editor sections">
        {#each tabs as tab}
            <button class:active={$curPage == tab} onclick={() => {$curPage = tab}}>{tab.toLowerCase()}</button>
        {/each}
    </nav>
</header>

{#if $curPage == "Posts"}
    <PostPicker />
{:else if $curPage == "Projects"}
    <ProjectPicker />
{:else if $curPage == "Editor"}
    <Code />
{:else if $curPage == "Preview"}
    <Preview />
{/if}

<style>
    .cms-head {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: clamp(2rem, 5vw, 3.5rem);
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--line);
    }

    .tabs {
        display: flex;
        gap: 0.3rem;
        padding: 0.3rem;
        border: 1px solid var(--line);
        border-radius: 999px;
    }

    .tabs button {
        padding: 0.5rem 1rem;
        border: 0;
        border-radius: 999px;
        color: var(--muted);
        background: transparent;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        transition: color 160ms, background 160ms;
    }

    .tabs button:hover {
        color: var(--paper);
    }

    .tabs button.active {
        color: var(--ink);
        background: var(--accent);
    }
</style>
