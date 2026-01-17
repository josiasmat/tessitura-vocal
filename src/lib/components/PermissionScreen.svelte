<script>
	import { onMount } from 'svelte';
    import { queryMicAccess, startMicrophoneStream } from '$lib/modules/mic';

	let { oncontinue } = $props();

	/** 'unknown' | 'granted' | 'denied' | 'prompt' */
	let micAccessState = $state('unknown'); 
    let micAccessGranted = $derived(micAccessState === 'granted');
	let requestingMicAccess = $state(false);

    function requestMicrophoneAccess() {
		queryMicAccess().then((state) => {
			alert(state);
			if ( state !== 'granted' )
				micAccessState = state;
			if ( state === 'denied' ) 
				return;
			requestingMicAccess = true;
			startMicrophoneStream().then((result) => {
				requestingMicAccess = false;
				queryMicAccess().then((state) => {
					micAccessState = state;
				});
				if ( result )
					setTimeout(() => oncontinue(), 1500);
			});
		});
    }

	onMount(() => requestMicrophoneAccess());
</script>

<div class="screen permission-screen">
	<div class="container">
		<div class="big-icon">🎤</div>
		
		<h2>Acesso ao microfone</h2>
		
		{#if micAccessGranted}
			<div class="success-message">
				✓ Acesso ao microfone concedido!
			</div>

            <div class="indicator active">
				<div class="pulse"></div>
				<div class="pulse" style="animation-delay: 0.2s"></div>
				<div class="pulse" style="animation-delay: 0.4s"></div>
			</div>

		{:else}
			<p class="description">
				Este aplicativo precisa de acesso ao seu microfone para ouvir sua voz 
				e detectar as notas	que você está cantando.
			</p>

			{#if micAccessState === 'prompt'}
				{#if requestingMicAccess}
					<div class="waiting-message">
						Autorize o acesso do aplicativo ao microfone no pop-up do navegador...
					</div>

					<div class="indicator active">
						<div class="pulse"></div>
						<div class="pulse" style="animation-delay: 0.2s"></div>
						<div class="pulse" style="animation-delay: 0.4s"></div>
					</div>

				{:else}
					<button class="btn-primary" onclick={requestMicrophoneAccess}>
						Solicitar acesso ao microfone
					</button>
				{/if}

			{:else if micAccessState === 'denied'}
				<p class="error-message">
					O acesso ao microfone foi negado. Por favor, permita o acesso 
					ao microfone nas configurações do seu navegador para continuar.
				</p>

				<button class="btn-primary" onclick={requestMicrophoneAccess}>
					Tentar novamente
				</button>
			{/if}

            <div class="permission-info">
                <p>Seu microfone será usado apenas:</p>
                <ul>
                    <li>Enquanto este aplicativo estiver em execução</li>
                    <li>Para análise de voz no seu navegador</li>
                    <li>Nenhum áudio é gravado ou enviado para qualquer lugar</li>
                </ul>
    		</div>
		{/if}
	</div>
</div>

<style>
	.container {
		text-align: center;
	}

	.big-icon {
		font-size: 56px;
		margin-bottom: 20px;
	}

	.description {
		color: #666;
		font-size: 16px;
		line-height: 1.6;
		margin-bottom: 25px;
	}

	.permission-info {
		background: #f0f4ff;
		border: 1px solid #e0e7ff;
		border-radius: 8px;
		padding: 15px;
		margin: 25px 0;
		text-align: left;
	}

	.permission-info p {
		margin: 0 0 10px 0;
		color: #333;
		font-weight: 500;
		font-size: 14px;
	}

	.permission-info ul {
		margin: 0;
		padding-left: 20px;
		color: #666;
		font-size: 14px;
	}

	.permission-info li {
		margin: 6px 0;
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
