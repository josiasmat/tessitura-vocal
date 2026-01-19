<script>
	import { createScoreView, updateScoreView } from "$lib/modules/score-view.js";
	import { onMount } from "svelte";
	
	let { low, high } = $props();

	onMount(() => {
		createScoreView(document.getElementById('score'));
        $effect(() => updateScoreView(low, high));
	});
</script>

<div id="score"></div>

<style>
	#score {
		:global(svg) {
			width: 100%;
			height: 100%;
			max-height: 250px;
		}
	}
</style>