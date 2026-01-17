<script>
    import { midiToNoteName } from "$lib/modules/notes.js";
	let { range, onreset } = $props();

	const vocalTypes = {
		'Soprano': {
			description: 'Voz feminina mais aguda',
			range: [60, 81],
			color: '#FF6B9D'
		},
		'Mezzo-Soprano': {
			description: 'Voz feminina média',
			range: [57, 77],
			color: '#C06C84'
		},
		'Contralto': {
			description: 'Voz feminina mais grave',
			range: [53, 74],
			color: '#6C567B'
		},
		'Tenor': {
			description: 'Voz masculina mais aguda',
			range: [47, 67],
			color: '#4A90E2'
		},
		'Barítono': {
			description: 'Voz masculina média',
			range: [43, 64],
			color: '#2E5C8A'
		},
		'Baixo': {
			description: 'Voz masculina mais grave',
			range: [40, 60],
			color: '#1A3B5C'
		}
	};

    function getVoiceType(range) {
        let detectedLow = range[0];
        let detectedHigh = range[1];
        let bestMatch = null;
        let smallestDiff = Infinity;

        for ( const [type, info] of Object.entries(vocalTypes) ) {
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

</script>

<div class="screen results-screen">
	<div class="container">
		<div class="header">
			<h2>Sua tessitura vocal</h2>
		</div>

		<div class="results">
			<div class="detected-range">
				<h3>Extensão detectada</h3>
				<div class="range-box">
					<span class="note lowest">{range[0] ? midiToNoteName(range[0]) : '--'}</span>
					<span class="range-span">até</span>
					<span class="note highest">{range[0] ? midiToNoteName(range[1]) : '--'}</span>
				</div>
			</div>

			<div class="vocal-type">
				<h3>Classificação do tipo vocal</h3>
				<div class="type-card" style="border-top-color: {selectedType.color}">
					<div class="type-name">{vocalType}</div>
					<p class="type-description">{selectedType.description}</p>
					<div class="type-range">
						<span class="label">Tessitura padrão:</span>
						<span class="range">{rangeToNotes(selectedType.range)}</span>
					</div>
				</div>
			</div>

			<div class="info-box">
				<h4>Sobre sua tessitura vocal</h4>
				<p>
					Sua tessitura vocal detectada foi associada à classificação vocal padrão mais próxima.
					Lembre-se de que as extensões vocais podem variar e melhorar com prática e treino.
				</p>
			</div>
		</div>

		<div class="actions">
			<button class="btn-primary" onclick={onreset}>
				↻ Voltar ao início
			</button>
		</div>
	</div>
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
		padding: 20px;
		border-radius: 12px;
	}

	.range-box {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 15px;
		font-size: 36px;
		font-weight: 700;
		font-family: 'Monaco', 'Courier New', monospace;
	}

	.note {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 12px 20px;
		border-radius: 8px;
		flex: 0 0 auto;
	}

	.range-span {
		color: #999;
		font-size: 16px;
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
		color: #666;
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

	.info-box {
		background: #f0f4ff;
		border-left: 4px solid #667eea;
		padding: 15px;
		border-radius: 8px;
	}

	.info-box h4 {
		margin: 0 0 10px 0;
		font-size: 14px;
		color: #333;
		text-transform: uppercase;
		font-weight: 600;
	}

	.info-box p {
		margin: 0;
		color: #666;
		font-size: 13px;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		gap: 10px;
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
			font-size: 28px;
		}

		.type-name {
			font-size: 20px;
		}
	}
</style>
