<script lang="ts">
    import { cn } from "./utils.ts";

    let className: any = "";
    export { className as class };
    let cardContent = {
        title: "Svelte is Vibe",
        description: "Svelte is a fun way to build web applications.",
    };
</script>

<div class={cn("text-left", className)}>
    <h3 class="text-lg font-bold mb-1 text-gray-100">
        {cardContent.title}
    </h3>
    <p class="text-gray-300">
        {cardContent.description}
    </p>
</div>
