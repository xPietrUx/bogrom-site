<script lang="ts">
    // Announcements
    import type { PageData } from './$types';

    export let data: PageData;
    let showAnnouncements = data.announcements && data.announcements.length > 0;

    function dismissAnnouncements() {
        showAnnouncements = false;
    }

    // Copy to clipboard
    let copiedId: string = '';

    async function copyToClipboard(text: string, id: string) {
        try {
            await navigator.clipboard.writeText(text);
            copiedId = id;
            setTimeout(() => {
                copiedId = '';
            }, 2000);
        } catch (error) {
            console.error('Nie udało się skopiować: ', error);
        }
    }

    // Contact form logic
    let name = '';
    let email = '';
    let phone = '';
    let subject = '';
    let message = '';
    let consent = false;
    let formStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
    let statusMessage = '';

    async function handleSubmit() {
        formStatus = 'submitting';
        statusMessage = 'Wysyłanie... ';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    consent,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                formStatus = 'success';
                statusMessage = result.message || 'Wiadomość została wysłana!';
                name = '';
                email = '';
                phone = '';
                subject = '';
                message = '';
            } else {
                formStatus = 'error';
                statusMessage =
                    result.message ||
                    'Wystąpił błąd podczas wysyłania wiadomości. Prosimy spróbować ponownie, bądź wysłanie e-maila w tradycyjny sposób';
            }
        } catch (error) {
            formStatus = 'error';
            statusMessage =
                'Nie udało się połączyć z serwerem. Spróbuj ponownie później.';
        } finally {
            setTimeout(() => {
                formStatus = 'idle';
                statusMessage = '';
            }, 5000);
        }
    }
</script>

<svelte:head>
    <title>Kontakt — Zawsze służymy pomocą | Bogrom</title>
    <meta
        name="description"
        content="Skontaktuj się z Bogrom S.C. w Zabrzu — telefony, e‑mail, godziny otwarcia oraz formularz kontaktowy. Szybka obsługa zapytań handlowych i serwisowych."
    />
    <meta
        name="keywords"
        content="Bogrom, kontakt, Zabrze, telefon, e-mail, formularz kontaktowy, godziny otwarcia"
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://bogrom.pl/contact" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Kontakt — Bogrom" />
    <meta
        property="og:description"
        content="Skontaktuj się z Bogrom S.C. w Zabrzu — telefony, e‑mail i formularz kontaktowy."
    />
    <meta property="og:url" content="https://bogrom.pl/contact" />
    <meta property="og:image" content="https://bogrom.pl/logo.webp" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Kontakt — Bogrom" />
    <meta
        name="twitter:description"
        content="Skontaktuj się z Bogrom S.C. w Zabrzu — telefony, e‑mail i formularz kontaktowy."
    />
    <meta name="twitter:image" content="https://bogrom.pl/logo.webp" />

    <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bogrom S.C.",
            "url": "https://bogrom.pl",
            "logo": "https://bogrom.pl/logo.webp",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+48-785-935-686",
                "contactType": "customer service"
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sikorskiego 8",
                "addressLocality": "Zabrze",
                "postalCode": "41-809",
                "addressCountry": "PL"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        }
    </script>
</svelte:head>

<section class="contact-section">
    {#if showAnnouncements}
        <div class="announcements-container">
            {#each data.announcements as announcement}
                <div class="announcement">
                    <p>{announcement.content}</p>
                </div>
            {/each}
            <button
                on:click={dismissAnnouncements}
                class="dismiss-btn"
                title="Zamknij">&times;</button
            >
        </div>
    {/if}
    <div class="contact-map">
        <iframe
            title=""
            width="100%"
            height="400"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            id="gmap_canvas"
            src="https://maps.google.com/maps?q=bogrom&t=&z=11&ie=UTF8&iwloc=&output=embed"
        >
        </iframe>
    </div>
    <div class="form-desc-handler">
        <div class="contact-description">
            <ul>
                <li>
                    <div class="contact-desc-cover">
                        <div class="contact-description-image">
                            <img
                                src="/media/pages/contact/location.webp"
                                alt="Lokalizacja"
                            />
                        </div>
                        <div class="contact-description-content">
                            <h3>Siedziba Firmy</h3>
                            <p>Sikorskiego 8</p>
                            <p>41-809 Zabrze</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="contact-desc-cover">
                        <div class="contact-description-image">
                            <img
                                src="/media/pages/contact/call.webp"
                                alt="Telefon"
                            />
                        </div>
                        <div class="contact-description-content">
                            <h3>Zadzwoń do Nas</h3>
                            <button
                                type="button"
                                on:click={() =>
                                    copyToClipboard('785 935 686', 'phone1')}
                                style="cursor: pointer;"
                                title="Kliknij, aby skopiować"
                            >
                                785 935 686
                                {#if copiedId === 'phone1'}
                                    <span class="copied-feedback">
                                        (Skopiowano!)</span
                                    >
                                {/if}
                            </button>
                            <button
                                type="button"
                                on:click={() =>
                                    copyToClipboard('32 227 39 93', 'phone2')}
                                style="cursor: pointer;"
                                title="Kliknij, aby skopiować"
                            >
                                32 227 39 93
                                {#if copiedId === 'phone2'}
                                    <span class="copied-feedback">
                                        (Skopiowano!)</span
                                    >
                                {/if}
                            </button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="contact-desc-cover">
                        <div class="contact-description-image">
                            <img
                                src="/media/pages/contact/mail.webp"
                                alt="Telefon"
                            />
                        </div>
                        <div class="contact-description-content">
                            <h3>Napisz do Nas</h3>
                            <button
                                type="button"
                                on:click={() =>
                                    copyToClipboard('biuro@bogrom.pl', 'email')}
                                style="cursor: pointer;"
                                title="Kliknij, aby skopiować"
                            >
                                biuro@bogrom.pl
                                {#if copiedId === 'email'}
                                    <span class="copied-feedback">
                                        (Skopiowano!)</span
                                    >
                                {/if}
                            </button>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="contact-desc-cover">
                        <div class="contact-description-image">
                            <img
                                src="/media/pages/contact/opening.webp"
                                alt="Telefon"
                            />
                        </div>
                        <div class="contact-description-content">
                            <h3>Godziny otwarcia</h3>
                            <p>Od poniedziałku do piątku:</p>
                            <p>9:00 - 17:00</p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="contact-desc-cover">
                        <div class="contact-description-image">
                            <img
                                src="/media/pages/contact/info.webp"
                                alt="Telefon"
                            />
                        </div>
                        <div class="contact-description-content">
                            <h3>Bogrom</h3>
                            <p>Bogrom S.C. Roman Kirsz, Joanna Kirsz</p>
                            <p>NIP: 6481024097</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <form
            class="contact-form"
            on:submit|preventDefault
            id="contact-form-here"
        >
            <h2>Formularz kontaktowy</h2>
            <div class="form-group">
                <label for="name">👤 Imię i nazwisko</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jan Nowak"
                    required
                    bind:value={name}
                />
            </div>
            <div class="form-group">
                <label for="email">📧 Adres e-mail</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="przykład@e-mail.com"
                    required
                    bind:value={email}
                />
            </div>
            <div class="form-group">
                <label for="phone">📞 Telefon</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="123 456 789"
                    required
                    bind:value={phone}
                />
            </div>
            <div class="form-group">
                <label for="subject">💡 Temat</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="W czym możemy pomóc?"
                    required
                    bind:value={subject}
                />
            </div>
            <div class="form-group">
                <label for="message">📝 Wiadomość</label>
                <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Dzień dobry ,

Chciałbym/chciałabym zapytać o 🤔...

Prosimy o szczegółowy opis zapytania, co pozwoli nam na przygotowanie precyzyjnej odpowiedzi lub oferty 😊."
                    required
                    bind:value={message}
                ></textarea>
            </div>

            <div class="form-group-consent">
                <input type="checkbox" id="consent" bind:checked={consent} />
                <label for="consent">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu
                    odpowiedzi na zapytanie, zgodnie z <a
                        href="/privacy-policy"
                        target="_blank">Polityką Prywatności</a
                    >.
                </label>
            </div>

            {#if statusMessage}
                <p class="status-message {formStatus}">{statusMessage}</p>
            {/if}
            <button
                type="submit"
                class="hero-button"
                disabled={formStatus === 'submitting' ||
                    !consent ||
                    !subject ||
                    !message ||
                    !phone ||
                    !email ||
                    !name}
                on:click={handleSubmit}
            >
                {formStatus === 'submitting'
                    ? 'Wysyłanie...'
                    : 'Wyślij'}</button
            >
        </form>
    </div>
</section>

<style>
    .copied-feedback {
        color: green;
        font-weight: bold;
        animation: fadeIn 0.5s;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .status-message {
        padding: 1rem;
        border-radius: var(--border-radius-sm);
        text-align: center;
        font-weight: bold;
    }
    .status-message.success {
        background-color: #d4edda;
        color: #155724;
    }
    .status-message.error {
        background-color: #f8d7da;
        color: var(--error-color);
    }
    .form-group-consent {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    .form-group-consent input[type='checkbox'] {
        width: auto;
    }
    .form-group-consent a {
        color: var(--primary-color);
        text-decoration: underline;
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .announcements-container {
        position: relative;
        width: 90%;
        margin: 1rem auto;
        padding: 1rem;
        background-color: var(--warning-color);
        border-radius: var(--border-radius-sm);
        box-shadow: var(--box-shadow);
    }
    .announcement p {
        margin: 0;
        padding-right: 2rem;
    }
    .dismiss-btn {
        position: absolute;
        top: 0.5rem;
        right: 1rem;
        font-size: 1.5rem;
        line-height: 1;
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
