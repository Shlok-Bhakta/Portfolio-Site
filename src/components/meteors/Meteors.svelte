<script lang="ts">
    import { onMount } from "svelte";
  
    interface Props {
        number?: number;
    }

    let { number = 10 }: Props = $props();
    let meteorStyles: any = $state([]);
    // Using actual color values instead of Tailwind classes
    let trailColor: string[] = ["#f5e0dc", "#f38ba8", "#fab387", "#89dceb", "#cdd6f4", "#89b4fa", "#94e2d5"];
    let trailColorMid: string[] = ["#f5e0dc", "#f38ba8", "#fab387", "#89dceb", "#cdd6f4", "#89b4fa", "#94e2d5"];
    
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

<style>
    @keyframes meteor {
        0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            transform: rotate(215deg) translateX(-1800px);
            opacity: 0;
        }
    }

    .meteor {
        pointer-events: none;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2.4px;
        height: 2.4px;
        transform: rotate(215deg);
        border-radius: 9999px;
        background: var(--crust);
        box-shadow: 0 0 0 1px var(--crust);
        animation: meteor 5s linear infinite;
    }

    .meteor-trail {
        pointer-events: none;
        position: absolute;
        top: 50%;
        z-index: -10;
        height: 1px;
        width: 50px;
        transform: translateY(-50%);
    }
</style>

{#each meteorStyles as style, idx}
<span
    id="meteor-{idx+1}"
    class="meteor"
    style="top: {style.top}px; left: {style.left}; animation-delay: {style.animationDelay}; animation-duration: {style.animationDuration}; z-index: {style.zLevel};"
>
    <!-- Meteor Trail  -->
    <div
        id="trail-{idx+1}"
        class="meteor-trail"
        style="background: linear-gradient(to right, {style.fromCol}, {style.viaCol}, transparent);"
    ></div>
</span>
{/each}