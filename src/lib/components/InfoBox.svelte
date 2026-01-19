<script>
    let { children, color = "#f0f4ff" } = $props();
</script>

<div class="info-box" style="--background-color: {color}">
	<div class="info-icon">ℹ️</div>
	<div class="info-content">
        {@render children()}
    </div>
</div>

<style>
    .info-box {
		display: flex;
		flex-direction: row;
		background: var(--background-color);
		border-radius: 8px;
		padding: 12px;
	}

	.info-icon {
		font-size: 16px;
		margin-top: 1px;
		margin-right: 10px;
		color: #666;
	}

	.info-content, 
    .info-content :global(*) {
		text-align: left;
		color: #666;
		font-weight: normal;
		font-size: 12px;
		margin: 0;
		padding: 0;
        text-wrap: wrap;
	}

    .info-content :global(p):not(:last-child) {
        margin-bottom: 0.4em;
    }

    .info-content :global(ul),
    .info-content :global(ol) {
        padding-left: 1.0em;
        :global(li):not(:last-child) {
            margin-bottom: 0.4em;
        }
    }

</style>
