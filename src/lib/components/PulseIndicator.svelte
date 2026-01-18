<script>
    let { 
        color = '#667eea', 
        active = true 
    } = $props();
</script>

<div class={["indicator", {active}]} style:--pulse-color={color}>
    <div class="pulse"></div>
    <div class="pulse" style="animation-delay: 0.2s"></div>
    <div class="pulse" style="animation-delay: 0.4s"></div>
</div>

<style>
    .indicator {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 60px;
        margin-bottom: 30px;
    }

    .indicator.active .pulse {
        background: var(--pulse-color);
        animation: pulse-animation 1s ease-in-out infinite;
    }

    .pulse {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #ddd;
    }

    @keyframes pulse-animation {
        0%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0.5;
        }
    }
</style>
