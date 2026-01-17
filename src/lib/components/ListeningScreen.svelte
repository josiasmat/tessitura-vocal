<script>
    import { startPitchDetection, stopPitchDetection } from "$lib/modules/mic.js";
    import { freqToMidi, midiToNoteName } from "$lib/modules/notes.js";

	let { onfinish } = $props();

	let isListening = $state(false);

    let currentPitch = $state(null);
    let lowestPitch = $state(null);
    let highestPitch = $state(null);

	let currentNote = $derived(currentPitch ? midiToNoteName(currentPitch) : '--');
	let lowestNote = $derived(lowestPitch ? midiToNoteName(lowestPitch) : null);
	let highestNote = $derived(highestPitch ? midiToNoteName(highestPitch) : null);

    let canStopListening = $derived(
        isListening 
        && (lowestPitch !== null) && (highestPitch !== null) 
        && (highestPitch - lowestPitch > 11)
    );

	function startListening() {
		let clearCurrentId = null;
        startPitchDetection((result) => {
            const midiPitch = freqToMidi(result.pitch);
            if ( result.clarity >= 0.95 && midiPitch >= 36 && midiPitch < 89) {
				if ( clearCurrentId ) {
					clearTimeout(clearCurrentId);
					clearCurrentId = null;
				}
                currentPitch = midiPitch;
                if ( !lowestPitch || midiPitch < lowestPitch )
                    lowestPitch = midiPitch;
                if ( !highestPitch || midiPitch > highestPitch )
                    highestPitch = midiPitch;
            } else {
				if ( !clearCurrentId )
					clearCurrentId = setTimeout(() => {
						currentPitch = null;
					}, 500);
			}
        });
		isListening = true;
	}

	function stopListening() {
        stopPitchDetection();
		isListening = false;
		const range = [lowestPitch, highestPitch];
		onfinish(range);
	}

	startListening();
</script>

<div class="screen listening-screen">
	<div class="container">
		<div class="header">
			<h2>Detectar sua tessitura vocal</h2>
			<p class="subtitle">
                Cante até a nota mais grave que você consegue alcançar confortavelmente, e depois 
                até a nota mais aguda. O aplicativo ouvirá sua voz e determinará sua tessitura vocal.
            </p>
		</div>

		<div class="listening-area">
			<div class="indicator" class:active={isListening}>
				<div class="pulse"></div>
				<div class="pulse" style="animation-delay: 0.2s"></div>
				<div class="pulse" style="animation-delay: 0.4s"></div>
			</div>

			<div class="current-note">
				<div class="note-label">Nota atual</div>
				<div class="note-display">{currentNote}</div>
			</div>

			<div class="range-display">
				<div class="range-item">
					<span class="range-label">Mais grave</span>
					<span class="range-value">{lowestNote || '--'}</span>
				</div>
				<div class="range-separator">→</div>
				<div class="range-item">
					<span class="range-label">Mais aguda</span>
					<span class="range-value">{highestNote || '--'}</span>
				</div>
			</div>
		</div>

		<div class="controls">
			{#if !isListening}
				<button class="btn-primary" onclick={startListening}>
					Iniciar escuta
				</button>
			{:else}
				<button class="btn-primary" onclick={stopListening} disabled={!canStopListening}>
					Finalizar
				</button>
			{/if}
		</div>

		<div class="instructions">
			<p>
				{#if isListening}
					Continue cantando para expandir sua tessitura detectada. Tente cantar da sua 
                    nota mais grave até a mais aguda confortavelmente.
				{:else}
					Pressione "Iniciar escuta" e cante várias notas para detectar sua tessitura vocal.
				{/if}
			</p>
		</div>
	</div>
</div>

<style>

	h2 {
		margin: 0 0 10px 0;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 14px;
	}

	.listening-area {
		background: #f5f5f5;
		border-radius: 12px;
		padding: 40px 20px;
		margin-bottom: 30px;
		text-align: center;
	}

	.current-note {
		margin-bottom: 20px;
	}

	.note-label {
		font-size: 12px;
		color: #999;
		text-transform: uppercase;
		margin-bottom: 8px;
	}

	.note-display {
		font-size: 48px;
		font-weight: 700;
		color: #667eea;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.range-display {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 30px;
		padding-top: 20px;
		border-top: 1px solid #e0e0e0;
	}

	.range-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.range-label {
		font-size: 12px;
		color: #999;
		text-transform: uppercase;
		margin-bottom: 4px;
	}

	.range-value {
		font-size: 24px;
		font-weight: 700;
		color: #333;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.range-separator {
		font-size: 20px;
		color: #ccc;
	}

	.controls {
		margin-bottom: 20px;
	}

	.instructions {
		background: #f9f9f9;
		border-left: 4px solid #667eea;
		padding: 12px;
		border-radius: 4px;
	}

	.instructions p {
		margin: 0;
		font-size: 13px;
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 480px) {
		.container {
			padding: 20px;
		}

		h2 {
			font-size: 20px;
		}

		.listening-area {
			padding: 30px 15px;
		}

		.note-display {
			font-size: 40px;
		}

		.range-value {
			font-size: 20px;
		}
	}
</style>
