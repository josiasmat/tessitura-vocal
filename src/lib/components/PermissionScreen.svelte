<script>
    import { isMicAccessGranted, queryMicAccess, requestMicAccess } from '$lib/modules/mic';
	let { oncontinue } = $props();
    let micAccessGranted = $state(false);

    $effect(() => {
        if ( micAccessGranted )
            setTimeout(() => oncontinue(), 1500);
    });

    function updateMicAccessStatus() {
		micAccessGranted = isMicAccessGranted() 
			|| queryMicAccess( (result) => micAccessGranted = (result=="granted") );
    }

    function requestMicrophoneAccess() {
        requestMicAccess()
        .then(() => updateMicAccessStatus());
    }

    updateMicAccessStatus();
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

			<button class="btn-primary" onclick={requestMicrophoneAccess}>
				Solicitar acesso ao microfone
			</button>

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

	.success-message {
		background: #d4edda;
		border: 1px solid #c3e6cb;
		color: #155724;
		padding: 12px;
		border-radius: 8px;
		margin-bottom: 20px;
		font-weight: 500;
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
