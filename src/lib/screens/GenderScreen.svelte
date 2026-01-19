<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import Header from '$lib/components/Header.svelte';
	import InfoBox from '$lib/components/InfoBox.svelte';

	let { oncontinue } = $props();
	let selectedGender = $state(null);

	function selectGender(gender) {
		selectedGender = gender;
	}

	function handleContinue() {
		if (selectedGender)
			oncontinue(selectedGender);
	}

	onMount(() => window.scrollTo(0, 0));
</script>

<div class="container" in:fly={{ y: 50, duration: 300, delay: 50 }}>
	<Header>
		<h2>Selecione&nbsp;seu tipo&nbsp;de&nbsp;voz</h2>
		<div class="description">
			<p>Isso nos ajudará a identificar corretamente sua tessitura vocal.</p>
		</div>
	</Header>

	<div class="options-box">
		<div class="switch-group">
			{#each [
				{ icon: '👩🏽', label: "Voz&nbsp;feminina", value: "female" },
				{ icon: '🧑🏽', label: "Voz&nbsp;masculina", value: "male" },
			] as item}
				<button
					class={["switch", (selectedGender === item.value) && "active"]}
					onclick={() => selectGender(item.value)}
				>
					<span class="icon">{item.icon}</span>
					<span class="label">{@html item.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<button class="btn-primary" onclick={handleContinue} disabled={!selectedGender}>
		Continuar
	</button>

	<InfoBox>
		<p>Esta escolha serve apenas para ajustar os parâmetros de análise da voz
		(faixa de frequência). Ela não se refere à identidade de gênero.</p>
	</InfoBox>
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
		margin-bottom: 20px;
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
		display: inline-block;
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

	.switch .icon {
		font-size: 24px;
		vertical-align: -5%;
		margin-right: 2px;
	}

	.btn-primary {
		margin-bottom: 20px;
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
