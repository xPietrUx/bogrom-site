<script lang="ts">
    import { onMount } from 'svelte';

    let showBanner = false;

    onMount(() => {
        if (!localStorage.getItem('cookie_consent')) {
            showBanner = true;
        }
    });

    function accept() {
        localStorage.setItem('cookie_consent', 'true');
        showBanner = false;
        window.dispatchEvent(new CustomEvent('cookie_consent_given'));
    }

    function decline() {
        localStorage.setItem('cookie_consent', 'false');
        showBanner = false;
    }
</script>

{#if showBanner}
    <div class="cookie-banner">
        <p>
            Używamy plików cookie (i podobnych technologii), aby zbierać
            podstawowe statystyki odwiedzin. Pozwala nam to ulepszać naszą
            stronę. Czy zgadzasz się na to? Więcej informacji znajdziesz w
            naszej <a href="/privacy-policy">Polityce Prywatności</a>.
        </p>
        <div class="buttons">
            <button on:click={accept}>Zgadzam się</button>
            <button on:click={decline} class="decline">Odrzucam</button>
        </div>
    </div>
{/if}

<style>
    .cookie-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--body-bg-alt);
        color: var(--base-font-color);
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        flex-wrap: wrap;
        gap: 1rem;
        text-align: center;
    }
    .cookie-banner p {
        margin: 0;
        flex-grow: 1;
    }
    .cookie-banner a {
        color: var(--primary-color);
        text-decoration: underline;
    }
    .buttons {
        display: flex;
        margin: auto;
        gap: 1rem;
    }
    .buttons button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        background-color: var(--primary-color);
        color: white;
    }
    .buttons button.decline {
        background-color: var(--gray-font);
    }
</style>
