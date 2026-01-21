<script>
	import WelcomeScreen from '$lib/screens/WelcomeScreen.svelte';
	import GenderScreen from '$lib/screens/GenderScreen.svelte';
	import PermissionScreen from '$lib/screens/PermissionScreen.svelte';
	import ListeningScreen from '$lib/screens/ListeningScreen.svelte';
	import ResultsScreen from '$lib/screens/ResultsScreen.svelte';

	/** @type {string} -
	 *  'welcome' | 'gender' | 'permission' | 'listening' | 'results' */
	let currentScreen = $state('welcome');
	/** @type {string|null} -
	 *  'male' | 'female' | null */
	let voiceGender = $state(null); 
	/** @type {{lowest: number|null, highest: number|null}} -
	 *  Detected vocal range in MIDI key numbers. */
	let detectedRange = $state({ lowest: null, highest: null });
	/** @type {string|null} -
	 *  'soprano' | 'mezzo' | 'alto' | 'tenor' | 'baritone' | 'bass' | 'unknown' */
	let matchedVocalType = $state(null);

	function setCurrentScreen(id) {
		currentScreen = id;
		scrollTo(0, 0);
	}

	function goToGender() {
		setCurrentScreen("gender");
	}

	function goToPermission() {
		setCurrentScreen("permission");
	}

	function goToListening() {
		detectedRange = { lowest: null, highest: null };
		matchedVocalType = null;
		setCurrentScreen("listening");
	}

	function goToResults(range) {
		detectedRange = range;
		setCurrentScreen("results");
	}

	function goBackToWelcome() {
		voiceGender = null;
		setCurrentScreen("welcome");
	}

</script>


<div id="app-background"></div>

<div id="screen">
	{#if currentScreen === 'welcome'}
		<WelcomeScreen onstart={goToGender} />
	{:else if currentScreen === 'gender'}
		<GenderScreen 
			bind:gender={voiceGender}
			oncontinue={goToPermission} 
		/>
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
			ontryagain={goToGender}
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