<script>
	import WelcomeScreen from '$lib/screens/WelcomeScreen.svelte';
	import GenderScreen from '$lib/screens/GenderScreen.svelte';
	import PermissionScreen from '$lib/screens/PermissionScreen.svelte';
	import ListeningScreen from '$lib/screens/ListeningScreen.svelte';
	import ResultsScreen from '$lib/screens/ResultsScreen.svelte';

	let currentScreen = 'welcome'; // 'welcome' | 'gender' |'permission' | 'listening' | 'results'
	let voiceGender = null; // 'male' | 'female' | null
	let detectedRange = { lowest: null, highest: null };
	let matchedVocalType = null;

	// Workaround for a bug in Chrome mobile where scroll 
	// position is not reset on navigation and a part of
	// the new screen may appear blank.
	function setCurrentScreen(id) {
		currentScreen = id;
		setTimeout(() => scrollTo(0, 0), 50);
	}

	function goToGender() {
		voiceGender = null;
		detectedRange = { lowest: null, highest: null };
		matchedVocalType = null;
		setCurrentScreen("gender");
	}

	function goToPermission(gender) {
		voiceGender = gender;
		setCurrentScreen("permission");
	}

	function goToListening() {
		setCurrentScreen("listening");
	}

	function goToResults(range) {
		detectedRange = range;
		setCurrentScreen("results");
	}

	function goBackToWelcome() {
		setCurrentScreen("welcome");
	}

</script>

<div id="screen">
	{#if currentScreen === 'welcome'}
		<WelcomeScreen onstart={goToGender} />
	{:else if currentScreen === 'gender'}
		<GenderScreen oncontinue={goToPermission} />
	{:else if currentScreen === 'permission'}
		<PermissionScreen oncontinue={goToListening} />
	{:else if currentScreen === 'listening'}
		<ListeningScreen 
			gender={voiceGender}
			onfinish={goToResults} 
		/>
	{:else if currentScreen === 'results'}
		<ResultsScreen
			range={detectedRange}
			gender={voiceGender}
			onreset={goBackToWelcome}
		/>
	{/if}
</div>
