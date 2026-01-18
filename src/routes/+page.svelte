<script>
	import WelcomeScreen from '$lib/components/WelcomeScreen.svelte';
	import GenderScreen from '$lib/components/GenderScreen.svelte';
	import PermissionScreen from '$lib/components/PermissionScreen.svelte';
	import ListeningScreen from '$lib/components/ListeningScreen.svelte';
	import ResultsScreen from '$lib/components/ResultsScreen.svelte';

	let currentScreen = 'welcome'; // 'welcome' | 'gender' |'permission' | 'listening' | 'results'
	let voiceGender = null; // 'male' | 'female' | null
	let detectedRange = { lowest: null, highest: null };
	let matchedVocalType = null;

	function goToGender() {
		currentScreen = 'gender';
	}

	function goToPermission(gender) {
		voiceGender = gender;
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
		voiceGender = null;
		detectedRange = { lowest: null, highest: null };
		matchedVocalType = null;
	}
</script>

{#if currentScreen === 'welcome'}
	<WelcomeScreen onstart={goToGender} />
{:else if currentScreen === 'gender'}
	<GenderScreen oncontinue={goToPermission} />
{:else if currentScreen === 'permission'}
	<PermissionScreen oncontinue={goToListening} />
{:else if currentScreen === 'listening'}
	<ListeningScreen onfinish={goToResults} />
{:else if currentScreen === 'results'}
	<ResultsScreen
		range={detectedRange}
		gender={voiceGender}
		onreset={goBackToWelcome}
	/>
{/if}
