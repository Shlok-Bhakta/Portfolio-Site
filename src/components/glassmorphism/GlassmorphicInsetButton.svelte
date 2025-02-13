<script>
    const props = $props();
</script>

<style>
    
</style>

<button
    class="p-4 rounded-lg border border-base
           backdrop-blur-sm
           bg-[radial-gradient(ellipse_at_center,#181825,#11111b)]
           hover:backdrop-brightness-150 hover:border-white/20
           transition-all duration-300"
    >
    <slot></slot>
</button>
