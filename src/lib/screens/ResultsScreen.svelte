<script>
	import { onMount } from "svelte";
    import { fly } from "svelte/transition";

	import Header from "$lib/components/Header.svelte";
	import ScoreView from "$lib/components/ScoreView.svelte";
	import InfoBox from "$lib/components/InfoBox.svelte";

    import { 
		RangeDetector, evaluateRange, getStandardRange 
	} from "$lib/modules/range-detector";
	import { midiToNoteName } from "$lib/modules/notes.js";
    import { stopMicrophoneStream } from "$lib/modules/mic";

	let { low, high, gender, onreset } = $props();

	const vocalTypes = {
		'soprano': {
			name: 'Soprano',
			description: 'Voz feminina mais aguda',
			color: '#FF6B9D'
		},
		'mezzo': {
			name: 'Mezzo-Soprano',
			description: 'Voz feminina média',
			color: '#C06C84'
		},
		'alto': {
			name: 'Contralto',
			description: 'Voz feminina mais grave',
			color: '#6C567B'
		},
		'tenor': {
			name: 'Tenor',
			description: 'Voz masculina mais aguda',
			color: '#4A90E2'
		},
		'baritone': {
			name: 'Barítono',
			description: 'Voz masculina média',
			color: '#2E5C8A'
		},
		'bass': {
			name: 'Baixo',
			description: 'Voz masculina mais grave',
			color: '#1A3B5C'
		},
		'unknown': {
			name: 'Não identificado',
			description: 'Não foi possível determinar o tipo vocal',
			color: '#f00'
		}
	};

    function getRangeStr(type) {
		const range = getStandardRange(type);
        return `${midiToNoteName(range[0])} - ${midiToNoteName(range[1])}`;
    }

    let voiceType = $derived(evaluateRange(low, high, gender));

	let typeName = $derived(vocalTypes[voiceType].name);
	let typeDescription = $derived(vocalTypes[voiceType].description);
	let typeColor = $derived(vocalTypes[voiceType].color);
	let typeRange = $derived(voiceType !== 'unknown' ? getRangeStr(voiceType) : '--');

	onMount(() => stopMicrophoneStream());

</script>


<div class="container" in:fly={{ y: 50, duration: 300, delay: 300 }}>
	<Header>
		<h2>Sua tessitura vocal</h2>
	</Header>

	<div class="results">
		<table class="detected-range"><tbody><tr>
			<td class="score-container">
				<ScoreView {low} {high} />
			</td>
			<td><div class="range-box">
				<span class="note highest">{midiToNoteName(high)}</span>
				<span class="range-span">▲</span>
				<span class="note lowest">{midiToNoteName(low)}</span>
			</div></td>
		</tr></tbody></table>

		<div class="vocal-type">
			<h3>Provável tipo vocal:</h3>
			<div class="type-card" style="border-top-color: {typeColor}">
				<div class="type-name">{typeName}</div>
				<p class="type-description">{typeDescription}</p>
				{#if voiceType !== 'unknown'}
				<div class="type-range">
					<span class="label">Tessitura padrão:</span>
					<span class="range">{typeRange}</span>
				</div>
				{/if}
			</div>
		</div>

		<InfoBox>
			<p>Sua tessitura vocal detectada foi associada à classificação vocal padrão mais próxima.
			Para uma avaliação mais precisa, consulte um professor de canto ou regente coral.
			Lembre-se também de que a extensão vocal pode variar e melhorar com prática e treino.</p>
		</InfoBox>
	</div>

	<button class="btn-primary" onclick={onreset}>
		↻ Voltar ao início
	</button>
</div>

<style>
	h2 {
		margin: 0;
		font-size: 28px;
	}

	.results {
		display: flex;
		flex-direction: column;
		gap: 25px;
		margin-bottom: 30px;
	}

	h3 {
		margin: 0 0 15px 0;
		font-size: 16px;
		color: #333;
		text-transform: uppercase;
		font-weight: 600;
	}

	.detected-range {
		background: #f5f5f5;
		padding: 0 20px;
		border-radius: 12px;
	}

	.score-container {
		height: 100%;
		padding-right: 25px;
		text-align: center;
		vertical-align: middle;
	}

	.range-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
		font-size: 24px;
		font-weight: 700;
		font-family: 'Monaco', 'Courier New', monospace;
		vertical-align: middle;
	}

	.note {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 12px 20px;
		border-radius: 8px;
		flex: 0 0 auto;
		width: 4ch;
		text-align: center;
	}

	.range-span {
		color: #555;
		font-size: 22px;
		font-weight: 400;
	}

	.vocal-type {
		background: #f5f5f5;
		padding: 20px;
		border-radius: 12px;
	}

	.type-card {
		background: white;
		border: 2px solid #e0e0e0;
		border-top: 4px solid #667eea;
		border-radius: 8px;
		padding: 20px;
	}

	.type-name {
		font-size: 24px;
		font-weight: 700;
		color: #333;
		margin-bottom: 8px;
	}

	.type-description {
		margin: 0 0 15px 0;
		color: #555;
		font-size: 14px;
	}

	.type-range {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 12px;
		border-top: 1px solid #e0e0e0;
		font-size: 14px;
	}

	.type-range .label {
		color: #999;
		text-transform: uppercase;
		font-weight: 600;
	}

	.type-range .range {
		color: #333;
		font-weight: 600;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	@media (max-width: 480px) {
		.container {
			padding: 20px;
		}

		h2 {
			font-size: 24px;
		}

		h3 {
			font-size: 14px;
		}

		.range-box {
			font-size: 16px;
			gap: 4px;
		}

		.range-span {
			font-size: 16px;
		}

		.type-name {
			font-size: 20px;
		}

		.type-range .range {
			min-width: 11ch;
			text-align: right;
		}
	}
</style>
