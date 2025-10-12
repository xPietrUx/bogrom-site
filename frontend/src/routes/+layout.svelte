<script lang="ts">
    import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';
    import CookieBanner from '$lib/components/CookieBanner.svelte';
    import '../styles/style.css';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    function logVisit() {
        if ($page.url.pathname.startsWith('/admin')) {
            return;
        }

        try {
            if (
                localStorage.getItem('cookie_consent') === 'true' &&
                !sessionStorage.getItem('visitLogged')
            ) {
                navigator.sendBeacon('/api/analytics/log-visit');
                sessionStorage.setItem('visitLogged', 'true');
            }
        } catch (e) {
            console.warn(
                'Dostęp do Storage jest zablokowany. Nie można zalogować wizyty.'
            );
        }
    }

    onMount(() => {
        logVisit();

        const handleConsent = () => logVisit();
        window.addEventListener('cookie_consent_given', handleConsent);

        return () => {
            window.removeEventListener('cookie_consent_given', handleConsent);
        };
    });
</script>

<CookieBanner />
<Header />

<main>
    <slot />
</main>

<Footer />
