<script>
	import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
	import PermissionScreen from '$lib/components/PermissionScreen.svelte';
	import ListeningScreen from '$lib/components/ListeningScreen.svelte';
	import ResultsScreen from '$lib/components/ResultsScreen.svelte';

	let currentScreen = 'welcome'; // 'welcome' | 'permission' | 'listening' | 'results'
	let detectedRange = { lowest: null, highest: null };
	let matchedVocalType = null;

	function goToPermission() {
        currentScreen = 'permission';
	}

	function goToListening() {
		currentScreen = 'listening';
	}

	function goToResults(range) {
		detectedRange = range;
		currentScreen = 'results';
	}

	function goBackToWelcome() {
		currentScreen = 'welcome';
		detectedRange = { lowest: null, highest: null };
		matchedVocalType = null;
	}
</script>

{#if currentScreen === 'welcome'}
	<WelcomeScreen onstart={goToPermission} />
{:else if currentScreen === 'permission'}
	<PermissionScreen oncontinue={goToListening} />
{:else if currentScreen === 'listening'}
	<ListeningScreen onfinish={goToResults} />
{:else if currentScreen === 'results'}
	<ResultsScreen
		range={detectedRange}
		onreset={goBackToWelcome}
	/>
{/if}
