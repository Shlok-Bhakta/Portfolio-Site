<script lang="ts">
    import { cn } from "./utils.ts";
    import { onMount } from "svelte";
  
    export let number = 10;
    let meteorStyles: any = [];
    let trailColor: string[] = ["from-rosewater", "from-red", "from-peach", "from-sky", "from-text", "from-blue", "from-teal"];
    let trailColorMid: string[] = ["via-rosewater", "via-red", "via-peach", "via-sky", "via-text", "via-blue", "via-teal"];
    let changeMeteors = (num: number) => {
      meteorStyles = [];
      const styles = [...new Array(num)].map(() => ({
        top: -20,
        left: Math.floor(Math.random() * 900) + "px",
        animationDelay: Math.random() * 8 + 0.2 + "s",
        animationDuration: Math.floor(Math.random() * 8 + 2.9) + "s",
        fromCol: trailColor[Math.floor(Math.random() * 7)],
        viaCol: trailColorMid[Math.floor(Math.random() * 7)],
        zLevel: Math.floor(Math.random() * 20)
      }));
      meteorStyles = styles;
    };
    onMount(() => {
      changeMeteors(number);
    });
</script>
  
{#each meteorStyles as style, idx}
<span
    id="meteor-{idx+1}"
    class={cn(
    "pointer-events-none absolute left-1/2 top-1/2 size-[2.4px] rotate-[215deg] animate-meteor rounded-full bg-crust shadow-crust"
    )}
    style="top: {style.top}px; left: {style.left}; animation-delay: {style.animationDelay}; animation-duration: {style.animationDuration}; z-index: {style.zLevel};"
>
    <!-- Meteor Tail  -->
    <div
    id = "trail-{idx+1}"
    class="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r {style.fromCol} {style.viaCol} to-transparent"
    />
</span>
{/each}
  