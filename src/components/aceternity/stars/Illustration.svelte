<script lang="ts">
	import { cn } from "./cn.ts";
	import Glow from "./Glow.svelte";
	import Star from "./Star.svelte";
	import { AnimatePresence } from "svelte-motion";
	import { onDestroy, onMount } from "svelte";
	import { writable } from "svelte/store";

	let mouseEnter: boolean = false;

	export let stars = 108;
	const columns = 18;
	let glowingStars: number[] = [];

	// const highlightedStars = useRef<number[]>([]);
	const highlightedStars = writable<number[]>([]);

	onMount(() => {
		const interval = setInterval(() => {
			$highlightedStars = Array.from({ length: 5 }, () => Math.floor(Math.random() * stars));
			glowingStars = [...$highlightedStars];
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<div class="h-full w-full gap-1" style={`display: grid; grid-template-columns: repeat(${columns}, 1fr);`}>
	{#each [...Array(stars)] as star, starIdx (`matrix-col-${starIdx}}`)}
		{@const isGlowing = glowingStars.includes(starIdx)}
		{@const delay = (starIdx % 10) * 0.1}
		{@const staticDelay = starIdx * 0.01}

		<div class="relative flex items-center justify-center pb-[5vw] pl-[5vw]">
			<Star {isGlowing} {delay} />
			{#if mouseEnter}
				<Glow delay={staticDelay} />
			{/if}
			<AnimatePresence show={true}>
				{#if isGlowing}
					<Glow {delay} />
				{/if}
			</AnimatePresence>
		</div>
	{/each}
</div>
