<script lang="ts">
import { session, mapping, getMapping } from "./stores.ts"
import Login from "./login.svelte"
import Editor from "./editor.svelte"
import { onMount } from "svelte";


onMount(async () => {$mapping = await getMapping();}) 
</script>

{#if $session == null}
    <Login />
{:else}
    <Editor />
{/if}