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

	function setCurrentScreen(id) {
		currentScreen = id;
		scrollTo(0, 0);
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

<div id="app-background"></div>

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
			low={detectedRange[0]}
			high={detectedRange[1]}
			gender={voiceGender}
			onreset={goBackToWelcome}
		/>
	{/if}
</div>


<style>

	#app-background {
		height: 100vh;
		width: 100vw;
		box-sizing: border-box;
		overflow: hidden;
		position: fixed;
		background: linear-gradient(135deg, #4557a7 10%, #603e83 90%);
		background-attachment: fixed;
		background-position: center;
		background-size: cover;
		border: none;
		margin: 0;
		z-index: -1;
	}

	#screen {
		position: absolute;
		min-height: 100%;
		width: 100%;
		box-sizing: border-box;
		margin: 0;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 
			calc(20px + env(safe-area-inset-top)) 
			20px 
			calc(20px + env(safe-area-inset-bottom));
	}

</style>