<script>
	let { oncontinue } = $props();
	let selectedGender = $state(null);

	function selectGender(gender) {
		selectedGender = gender;
	}

	function handleContinue() {
		if (selectedGender)
			oncontinue(selectedGender);
	}
</script>

<div class="screen gender-screen">
	<div class="container">
		<h1>Selecione seu gênero vocal</h1>
		
		<div class="description">
			<p>Isso nos ajudará a identificar corretamente sua tessitura vocal.</p>
		</div>

		<div class="options-box">
			<div class="switch-group">
				<button
					class="switch"
					class:active={selectedGender === 'male'}
					onclick={() => selectGender('male')}
				>
					<span class="icon">🧑🏽</span>
					<span class="label">Voz masculina</span>
				</button>
				<button
					class="switch"
					class:active={selectedGender === 'female'}
					onclick={() => selectGender('female')}
				>
					<span class="icon">👩🏽</span>
					<span class="label">Voz feminina</span>
				</button>
			</div>
		</div>

		<button
			class="btn-primary"
			onclick={handleContinue}
			disabled={!selectedGender}
		>
			Continuar
		</button>
	</div>
</div>

<style>
	.description {
		margin-bottom: 20px;
		text-align: center;
	}

	p {
		color: #666;
		font-size: 16px;
		line-height: 1.6;
	}

	.options-box {
		border-radius: 12px;
		padding: 20px;
		background: #fafafa;
		margin-bottom: 30px;
	}

	.switch-group {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.switch {
		padding: 20px;
		border: 2px solid #ddd;
		background: white;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 15px;
		color: #666;
		transition: all 0.3s ease-out;
	}

	.switch:hover {
		border-color: #999;
		background: #f9f9f9;
		transition: none;
	}

	.switch.active {
		border-color: #2e5c8a;
		background: #c0d1ff;
		color: #0f3152;
		cursor: default;
		animation: normal 0.5s pulse-button;
	}

	.icon {
		font-size: 24px;
	}

	.label {
		display: block;
	}

	@keyframes pulse-button {
		0% {
			box-shadow: 0 0 0 0 rgba(46, 92, 138, 0.7);
		}
		70% {
			box-shadow: 0 0 0 5px rgba(46, 92, 138, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(46, 92, 138, 0);
		}
	}
</style>
