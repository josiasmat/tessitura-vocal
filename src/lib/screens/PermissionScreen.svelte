<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	
	import Header from '$lib/components/Header.svelte';
	import InfoBox from '$lib/components/InfoBox.svelte';
    import PulseIndicator from '$lib/components/PulseIndicator.svelte';

    import { queryMicAccess, startMicrophoneStream } from '$lib/modules/mic';

	let { oncontinue } = $props();

	/** 'unknown' | 'granted' | 'denied' | 'prompt' | 'requesting' */
	let micAccessState = $state('prompt'); 
    let micAccessGranted = $derived(micAccessState === 'granted');
	let requestingMicAccess = $derived(micAccessState === 'requesting');

    function requestMicrophoneAccess() {
		// Since Firefox mobile always returns 'prompt' for
		// permission query, we directly try to start the stream
		// and update the state based on the result.
		micAccessState = 'requesting';
		startMicrophoneStream().then((result) => {
			if ( result ) {
				micAccessState = 'granted';
				setTimeout(() => oncontinue(), 1500);
			} else {
				micAccessState = 'denied';
			}
		});
    }

	onMount(() => requestMicrophoneAccess());
</script>

<div class="container" in:fly={{ y: 50, duration: 300, delay: 50 }}>
	<Header>
		<div class="big-icon">🎤</div>
		<h2>Acesso ao microfone</h2>

		{#if !micAccessGranted}
			<p class="description">
				Este aplicativo precisa acessar seu microfone para ouvir sua voz 
				e detectar as notas	que você está cantando.
			</p>
		{/if}
	</Header>
	
	{#if micAccessGranted}
		<div class="success-message">
			✓ Acesso ao microfone concedido!
		</div>

		<PulseIndicator color="#75b784" />

	{:else}

		{#if micAccessState === 'prompt'}
			<button class="btn-primary" onclick={requestMicrophoneAccess}>
				Solicitar acesso ao microfone
			</button>

		{:else if requestingMicAccess}
			<div class="waiting-message">
				Autorize o acesso ao microfone no pop-up do navegador…
			</div>

			<PulseIndicator color="#c5a444" />

		{:else if micAccessState === 'denied'}
			<p class="error-message">
				O acesso ao microfone foi negado. Por favor, permita o acesso 
				ao microfone nas configurações do seu navegador para continuar.
			</p>

			<button class="btn-primary" onclick={requestMicrophoneAccess}>
				Tentar novamente
			</button>
		{/if}

		<InfoBox>
			<p>Seu microfone será usado apenas:</p>
			<ul>
				<li>Enquanto este aplicativo estiver em execução</li>
				<li>Para análise de voz no seu navegador</li>
				<li>Nenhum áudio é gravado ou enviado para qualquer lugar</li>
			</ul>
		</InfoBox>
	{/if}
</div>

<style>
	.container {
		text-align: center;
	}

	.big-icon {
		font-size: 56px;
		margin-bottom: 15px;
	}

	.description {
		color: #555;
		font-size: 16px;
		line-height: 1.6;
		margin-bottom: 25px;
	}

	.btn-primary {
		margin-bottom: 20px;
	}

	@media (max-width: 480px) {
		.container {
			padding: 20px;
		}

		.big-icon {
			font-size: 48px;
		}

		h2 {
			font-size: 20px;
		}

		.description {
			font-size: 14px;
		}
	}
</style>
