<script lang="ts">
    import { cn } from "./cn.ts";
    import Illustration from "./Illustration.svelte";
</script>

<div class="h-full flex items-center justify-center">
    <Illustration stars={document.documentElement.offsetHeight / 1} />
</div>
<div class="px-2 pb-6"><slot /></div>
