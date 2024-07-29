<script lang="ts">
    import { Motion } from "svelte-motion";
    export let delay: number;
</script>

<Motion
    let:motion
    initial={{
        opacity: 0,
    }}
    animate={{
        opacity: [0, 0.2, 0.5, 0.7, 1, 0.7, 0.5, 0.2, 0],
    }}
    transition={{
        duration: 2,
        ease: "easeInOut",
        delay: delay,
    }}
    exit={{
        opacity: 0,
    }}
>
    <div use:motion class="absolute z-10 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-lavender shadow-2xl shadow-lavender blur-[2px]" />
</Motion>
