<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let isNavOpen = false;

    const toggleNav = () => {
        isNavOpen = !isNavOpen;
    };

    const closeNav = () => {
        isNavOpen = false;
    };

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        closeNav();
        await goto('/login');
    }

    $: if (typeof document !== 'undefined') {
        if (isNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    $: isAdminPage = $page.url.pathname.startsWith('/admin');
</script>

<header class="header">
    <a href="/" class="logo-adjustment" title="Strona główna">
        <img src="/logo.webp" alt="Bogrom" draggable="false" />
    </a>
    <nav class="hamburger-nav" class:nav-open={isNavOpen}>
        <ul class="hamburger-nav-elements">
            {#if isAdminPage}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/admin/dashboard"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <span class="hamburger-nav-element-text"
                            >Panel Główny</span
                        >
                    </a>
                </li>
            {:else}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/windows"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <svg
                            class="hamburger-nav-element-icon"
                            aria-hidden="true"
                            focusable="false"
                            width="32"
                            height="32"
                        >
                            <use
                                xlink:href="/header/hamburger/window.svg#window"
                            />
                        </svg>
                        <span class="hamburger-nav-element-text">Okna</span>
                    </a>
                </li>
            {/if}
            {#if isAdminPage}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/admin/dashboard/announcements"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <span class="hamburger-nav-element-text"
                            >Ogłoszenia</span
                        >
                    </a>
                </li>
            {:else}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/doors"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <svg
                            class="hamburger-nav-element-icon"
                            aria-hidden="true"
                            focusable="false"
                            width="32"
                            height="32"
                        >
                            <use xlink:href="/header/hamburger/door.svg#door" />
                        </svg>
                        <span class="hamburger-nav-element-text">Drzwi</span>
                    </a>
                </li>
            {/if}
            {#if !isAdminPage}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/others"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <svg
                            class="hamburger-nav-element-icon"
                            aria-hidden="true"
                            focusable="false"
                            width="32"
                            height="32"
                        >
                            <use
                                xlink:href="/header/hamburger/other.svg#other"
                            />
                        </svg>
                        <span class="hamburger-nav-element-text">Inne</span>
                    </a>
                </li>
            {/if}
            {#if isAdminPage}
                <li>
                    <button
                        type="button"
                        on:click={handleLogout}
                        class="logout-btn"
                    >
                        <span class="hamburger-nav-element-text">Wyloguj</span>
                    </button>
                </li>
            {:else}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/services"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <svg
                            class="hamburger-nav-element-icon"
                            aria-hidden="true"
                            focusable="false"
                            width="32"
                            height="32"
                        >
                            <use
                                xlink:href="/header/hamburger/service.svg#service"
                            />
                        </svg>
                        <span class="hamburger-nav-element-text">Usługi</span>
                    </a>
                </li>
            {/if}
            {#if !isAdminPage}
                <li class="hamburger-nav-element-cover">
                    <a
                        href="/contact"
                        class="hamburger-nav-element"
                        on:click={closeNav}
                    >
                        <svg
                            class="hamburger-nav-element-icon"
                            aria-hidden="true"
                            focusable="false"
                            width="32"
                            height="32"
                        >
                            <use
                                xlink:href="/header/hamburger/contact.svg#contact"
                            />
                        </svg>
                        <span class="hamburger-nav-element-text">Kontakt</span>
                    </a>
                </li>
            {/if}
        </ul>
    </nav>
    <button
        type="button"
        class="hamburger-icon"
        class:open={!isNavOpen}
        class:close={isNavOpen}
        on:click={toggleNav}
        aria-label="Toggle navigation menu"
    >
        <span class="hamburger-line" id="first"></span>
        <span class="hamburger-line" id="second"></span>
        <span class="hamburger-line" id="third"></span>
    </button>
</header>

<style>
    .logout-btn {
        background-color: red;
        padding: 10px;
        border-radius: 0.5rem;
        color: white;
    }
</style>
