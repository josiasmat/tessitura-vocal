<script>
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

	import Header from "$lib/components/Header.svelte";
    import PulseIndicator from "$lib/components/PulseIndicator.svelte";

	import { RangeDetector } from "$lib/modules/range-detector";
    import { midiToNoteName } from "$lib/modules/notes.js";
	
	let { gender, onfinish } = $props();

	let isListening = $state(false);

    let currentPitch = $state(null);
    let lowestPitch  = $state(null);
    let highestPitch = $state(null);

	let pitchOutsideRange = $derived(
		(currentPitch !== null) && 
		(currentPitch < RangeDetector.min_pitch || currentPitch > RangeDetector.max_pitch)
	);

	let currentNote = $derived(currentPitch ? midiToNoteName(currentPitch) : '--');
	let lowestNote  = $derived(lowestPitch  ? midiToNoteName(lowestPitch)  : null);
	let highestNote = $derived(highestPitch ? midiToNoteName(highestPitch) : null);

    let canStopListening = $derived(
        isListening 
        && (lowestPitch !== null) && (highestPitch !== null) 
        && (highestPitch - lowestPitch > 11)
    );

	function startListening() {
		RangeDetector.resetAll();
		RangeDetector.lastPitchCallback = (pitch) => currentPitch = pitch;
		RangeDetector.lowPitchCallback  = (pitch) => lowestPitch  = pitch;
		RangeDetector.highPitchCallback = (pitch) => highestPitch = pitch;
		if ( gender === "male" )
			RangeDetector.max_pitch = 74; // D4
		else if ( gender === "female" )
			RangeDetector.min_pitch = 48; // C2
		RangeDetector.start();
		isListening = true;
	}

	function stopListening() {
		RangeDetector.stop();
		isListening = false;
		const range = [lowestPitch, highestPitch];
		onfinish(range);
	}

	onMount(() => startListening());
</script>

<div class="container" in:fly={{ y: 50, duration: 300, delay: 50 }}>

	<Header>
		<h2>Escutando sua voz…</h2>
		<p class="instructions">
			Cante gradualmente até a nota mais grave que você consegue alcançar 
			confortavelmente, e depois até a nota mais aguda, sem usar falsete.
			Ao terminar, toque em "Finalizar".
		</p>
	</Header>

	<div class="listening-area">
		<PulseIndicator active={isListening} />

		<div class="current-note">
			<div class="note-label">Nota atual</div>
			<div class={["note-display", pitchOutsideRange && "note-off-range"]}>{currentNote}</div>
		</div>

		<div class="range-display">
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="range-item" onclick={() => RangeDetector.resetLowPitch()}>
				<span class="range-label">Mais grave</span>
				<span class="range-value">{lowestNote || '--'}</span>
			</div>
			<div class="range-separator">▶</div>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
			<div class="range-item" onclick={() => RangeDetector.resetHighPitch()}>
				<span class="range-label">Mais aguda</span>
				<span class="range-value">{highestNote || '--'}</span>
			</div>
		</div>

		<div class="range-reset-hint">
			Se precisar, toque na nota detectada para anular.
		</div>
	</div>

	<button class="btn-primary" onclick={stopListening} disabled={!canStopListening}>
		Finalizar
	</button>
</div>

<style>

	.instructions {
		color: #555;
		font-size: 16px;
	}
	
	.listening-area {
		background: #f5f5f5;
		border-radius: 12px;
		padding: 25px 20px;
		margin-bottom: 30px;
		text-align: center;
	}

	.current-note {
		margin-bottom: 15px;
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

	.note-off-range {
		color: #c53131;
	}

	.range-display {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-top: 30px;
		padding-top: 15px;
		border-top: 1px solid #e0e0e0;
	}

	.range-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 5px;
		cursor: pointer;
		user-select: none;
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
		color: #999;
		padding: none;
	}

	.range-reset-hint {
		margin-top: 20px;
		font-size: 10px;
		color: #999;
		text-wrap: balance;
	}

	@media (max-width: 480px) {
		.container {
			padding: 20px;
		}

		h2 {
			font-size: 20px;
		}

		.instructions {
			font-size: 14px;
		}

		.listening-area {
			padding: 25px 15px;
		}

		.note-display {
			font-size: 36px;
		}

		.range-value {
			font-size: 20px;
		}
	}
</style>
