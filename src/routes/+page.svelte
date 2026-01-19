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

	function goToGender() {
		currentScreen = 'gender';
		scrollToTop();
	}

	function goToPermission(gender) {
		voiceGender = gender;
		currentScreen = 'permission';
		scrollToTop();
	}

	function goToListening() {
		currentScreen = 'listening';
		scrollToTop();
	}

	function goToResults(range) {
		detectedRange = range;
		currentScreen = 'results';
		scrollToTop();
	}

	function goBackToWelcome() {
		currentScreen = 'welcome';
		voiceGender = null;
		detectedRange = { lowest: null, highest: null };
		matchedVocalType = null;
		scrollToTop();
	}

	function scrollToTop() {
		window.scrollTo(0, 0);
	}

</script>

<div class="screen">
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
