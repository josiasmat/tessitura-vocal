<script>
    let { children } = $props();
</script>

<div class="header">
    {@render children()}
</div>

<style>

    .header {
        text-align: center;
        margin: 0 0 20px 0;
    }

    .header :global(*) {
        margin: 0;
        color: #666;
        text-align: center;
    }

    .header :global(h1),
    .header :global(h2) {
        color: #333;
    }

    .header :global(h1) {
        margin: 0 0 15px 0;
        font-size: 28px;
    }

    .header :global(h2) {
        margin: 0 0 10px 0;
        font-size: 24px;
    }

</style>
