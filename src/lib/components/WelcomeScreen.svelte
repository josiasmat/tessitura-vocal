<script>
	let { onstart } = $props();
</script>

<div class="screen welcome-screen">
	<div class="container">
		<h1>Detector de tessitura vocal</h1>
		
		<div class="description">
			<p>
                Descubra sua tessitura vocal! Este aplicativo ouvirá sua voz e 
                identificará as notas mais graves e mais agudas que você pode cantar.
			</p>
			
			<div class="features">
				<h3>O que este aplicativo faz:</h3>
				<ul>
					<li>🎤 Escuta a entrada do seu microfone</li>
					<li>🎵 Detecta as notas que você está cantando</li>
					<li>📊 Determina sua tessitura vocal</li>
					<li>😮 Compara sua tessitura com os tipos vocais padrão</li>
				</ul>
			</div>
		</div>

		<button class="btn-primary" onclick={onstart}>
			Iniciar
		</button>

		<p class="footer">
			© 2026 Josias Matschulat. 
			Obtenha o <a href="https://github.com/josiasmat/tessitura-vocal" target="_blank">código fonte</a>.
		</p>
	</div>
</div>

<style>
	.description {
		margin-bottom: 30px;
	}

	p {
		color: #666;
		font-size: 16px;
		line-height: 1.6;
		margin: 0 0 20px 0;
	}

	p.footer {
		text-align: center;
		font-size: 12px;
		color: #777;
		margin: 30px 0 0 0;
	}

	.features {
		background: #f9f9f9;
		border-left: 4px solid #667eea;
		padding: 15px;
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
		padding-left: 20px;
		list-style: none;
	}

	.features li {
		margin: 8px 0;
		color: #666;
		font-size: 14px;
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

		.features li {
			font-size: 13px;
		}
	}
</style>
