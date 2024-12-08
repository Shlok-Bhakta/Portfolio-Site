<script>
import { auth } from "./stores.ts"
import { Login } from "./login.svelte"
</script>

{#if !auth}
    <Login />
{/if}