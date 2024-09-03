<script lang="ts">
    import Ellipses from "./Ellipses.svelte";
</script>

<div class="relative w-full rounded-lg border border-dashed px-4 border-surface0 sm:px-6 md:px-8 bg-crust shadow-sm">
    <div class="absolute left-0 top-4 -z-0 h-px w-full bg-surface0 sm:top-6 md:top-8"></div>
    <div class="absolute bottom-4 left-0 z-0 h-px w-full bg-surface0 sm:bottom-6 md:bottom-8"></div>
    <div class="relative w-full border-x border-surface0">
        <Ellipses />
        <div class="relative z-20 w-full py-8">
            <slot>Default</slot>
        </div>
    </div>
</div>
