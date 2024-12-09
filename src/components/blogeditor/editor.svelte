<script>
import { session } from "./stores.ts"
import Login from "./login.svelte"
import Editor from "./blogedit.svelte"
</script>

{#if $session == null}
    <Login />
{:else}
    <Editor />
{/if}