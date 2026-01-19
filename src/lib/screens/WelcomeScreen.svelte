<script>
	import { fly } from 'svelte/transition';
	import Header from '$lib/components/Header.svelte';
	import InfoBox from '$lib/components/InfoBox.svelte';
	
	let { onstart } = $props();
</script>

<div class="container" in:fly={{ y: 50, duration: 300, delay: 300 }}>

	<Header>
		<h1>Detector de tessitura&nbsp;vocal</h1>
		<p class="description">
			Descubra seu tipo de voz! Este aplicativo ouvirá sua voz e 
			identificará as notas mais graves e agudas que você pode cantar.
		</p>
	</Header>
	
	<div class="features">
		<h3>O que este aplicativo faz:</h3>
		<ul>
			<li data-bullet="🎤"> Escuta a entrada do seu microfone*</li>
			<li data-bullet="🎵"> Detecta as notas que você está cantando</li>
			<li data-bullet="📊"> Determina sua tessitura vocal**</li>
			<li data-bullet="😮"> Compara seu resultado com os tipos vocais padrão</li>
		</ul>
	</div>

	<InfoBox>
		<p>*Para melhores resultados, faça o teste em um ambiente silencioso.</p>
		<p>**Este teste não substitui uma avaliação realizada por profissional.</p>
	</InfoBox>

	<button class="btn-primary" onclick={onstart}>
		Iniciar
	</button>

	<div class="footer">
		<p>
			© 2026 Josias Matschulat. Obtenha o 
			<a href="https://github.com/josiasmat/tessitura-vocal" target="_blank">código fonte</a>.
		</p>
	</div>

</div>

<style>
	.description {
		line-height: 1.4;
		text-wrap: balance;
	}

	.features {
		background: #f9f9f9;
		border-left: 4px solid #667eea;
		padding: 15px 15px 7px 15px;
		border-radius: 8px;
		margin: 20px 0;
	}

	.features h3 {
		margin: 0 0 10px 0;
		font-size: 14px;
		color: #333;
		text-transform: uppercase;
		font-weight: 600;
	}

	.features ul {
		margin: 0;
	}

	.features li {
		margin: 8px 0;
		color: #666;
		font-size: 14px;
	}

	.features li::marker {
		content: attr(data-bullet) " ";
	}

	.btn-primary {
		margin-top: 20px;
	}

	.footer p {
		text-align: center;
		font-size: 12px;
		color: #777;
		margin: 30px 0 0 0;
	}

	@media (max-width: 480px) {
		.container {
			padding: 20px;
		}

		h1 {
			font-size: 24px;
		}

		.features h3 {
			font-size: 12px;
		}

		.features ul {
			padding-left: 20px;
		}

		.features li {
			font-size: 13px;
		}
	}
</style>
