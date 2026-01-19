<script>
	import { onMount } from "svelte";
    import { fly } from "svelte/transition";

	import Header from "$lib/components/Header.svelte";
	import ScoreView from "$lib/components/ScoreView.svelte";
	import InfoBox from "$lib/components/InfoBox.svelte";

    import { midiToNoteName } from "$lib/modules/notes.js";

	let { range, gender, onreset } = $props();

	const vocalTypes = {
		'Soprano': {
			description: 'Voz feminina mais aguda',
			range: [60, 81],
			gender: 'female',
			color: '#FF6B9D'
		},
		'Mezzo-Soprano': {
			description: 'Voz feminina média',
			range: [57, 77],
			gender: 'female',
			color: '#C06C84'
		},
		'Contralto': {
			description: 'Voz feminina mais grave',
			range: [53, 74],
			gender: 'female',
			color: '#6C567B'
		},
		'Tenor': {
			description: 'Voz masculina mais aguda',
			range: [47, 67],
			gender: 'male',
			color: '#4A90E2'
		},
		'Barítono': {
			description: 'Voz masculina média',
			range: [43, 64],
			gender: 'male',
			color: '#2E5C8A'
		},
		'Baixo': {
			description: 'Voz masculina mais grave',
			range: [40, 60],
			gender: 'male',
			color: '#1A3B5C'
		}
	};

    function getVoiceType(range) {
        let detectedLow = range[0];
        let detectedHigh = range[1];
        let bestMatch = null;
        let smallestDiff = Infinity;

        for ( const [type, info] of Object.entries(vocalTypes) ) {
            if (info.gender !== gender) continue;
            let [typeLow, typeHigh] = info.range;
            let lowDiff = Math.abs(detectedLow - typeLow);
            let highDiff = Math.abs(detectedHigh - typeHigh);
            let totalDiff = lowDiff + highDiff;

            if ( totalDiff < smallestDiff ) {
                smallestDiff = totalDiff;
                bestMatch = type;
            }
        }

        return bestMatch;
    }

    function rangeToNotes(range) {
        return `${midiToNoteName(range[0])} - ${midiToNoteName(range[1])}`;
    }

    let vocalType = $derived(getVoiceType(range));
    let selectedType = $derived(vocalTypes[vocalType]);

	onMount(() => window.scrollTo(0, 0));
</script>

<div class="container" in:fly={{ y: 50, duration: 300, delay: 300 }}>
	<Header>
		<h2>Sua tessitura vocal</h2>
	</Header>

	<div class="results">
		<table class="detected-range"><tbody><tr>
			<td class="score-container">
				<ScoreView low={range[0]} high={range[1]} />
			</td>
			<td><div class="range-box">
				<span class="note highest">{range[0] ? midiToNoteName(range[1]) : '--'}</span>
				<span class="range-span">▲</span>
				<span class="note lowest">{range[0] ? midiToNoteName(range[0]) : '--'}</span>
			</div></td>
		</tr></tbody></table>

		<div class="vocal-type">
			<h3>Provável tipo vocal:</h3>
			<div class="type-card" style="border-top-color: {selectedType.color}">
				<div class="type-name">{vocalType}</div>
				<p class="type-description">{selectedType.description}</p>
				<div class="type-range">
					<span class="label">Tessitura padrão:</span>
					<span class="range">{rangeToNotes(selectedType.range)}</span>
				</div>
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
