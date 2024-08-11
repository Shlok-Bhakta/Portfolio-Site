<script lang="ts">
    import "../../styles/global.css";
    import { cn } from "./utils.ts";

    let className: any = "";
    export { className as class };
    let cardContent = {
        title: "Svelte is Vibe",
        description: "Svelte is a fun way to build web applications.",
    };
</script>

<div class={cn("text-left", className)}>
    <h3 class="text-lg font-bold mb-1 text-text nerdfont">
        {cardContent.title}
    </h3>
    <p class="text-subtext1 nerdfont">
        {cardContent.description}
    </p>
</div>
