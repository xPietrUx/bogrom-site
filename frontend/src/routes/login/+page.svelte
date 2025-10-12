<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    // Login vars
    let username = '';
    let password = '';
    let error = '';

    // Login limiter vars
    let isLockedOut = false;
    let countdown = 0;
    let countdownInterval: ReturnType<typeof setInterval>;

    const LOCKOUT_KEY = 'lockoutExpires';
    const FAILED_ATTEMPTS_KEY = 'failedAttempts';

    function startLockout(seconds: number) {
        const lockoutEndTime = Date.now() + seconds * 1000;
        localStorage.setItem(LOCKOUT_KEY, lockoutEndTime.toString());

        isLockedOut = true;
        countdown = seconds;

        clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                isLockedOut = false;
                error = '';
                localStorage.removeItem(LOCKOUT_KEY);
            }
        }, 1000);
    }

    // Is it blocked?
    onMount(() => {
        const lockoutEndTime = localStorage.getItem(LOCKOUT_KEY);
        if (lockoutEndTime) {
            const remainingTime = Math.round(
                (parseInt(lockoutEndTime) - Date.now()) / 1000
            );

            if (remainingTime > 0) {
                startLockout(remainingTime);
            } else {
                localStorage.removeItem(LOCKOUT_KEY);
            }
        }
    });

    async function handleLogin() {
        error = '';
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 429) {
            const retryAfter = parseInt(
                response.headers.get('Retry-After') || '60'
            );
            startLockout(retryAfter);
            error = `Zbyt wiele prób. Spróbuj ponownie za ${countdown} sekund.`;
            return;
        }

        const data = await response.json();

        if (response.ok) {
            error = '';
            try {
                localStorage.removeItem(LOCKOUT_KEY);
                localStorage.removeItem(FAILED_ATTEMPTS_KEY);
            } catch (e) {
                console.warn('Nie udało się wyczyścić localStorage:', e);
            }
            await goto('/admin/dashboard');
        } else {
            error = data.message || 'Nie udało się zalogować';
        }
    }

    $: if (isLockedOut) {
        error = `Zbyt wiele prób. Spróbuj ponownie za ${countdown} sekund.`;
    }
</script>

<div class="login-container">
    <h1>Logowanie do panelu właściciela</h1>
    <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
            <label for="username">Nazwa użytkownika:</label>
            <input
                type="text"
                id="username"
                bind:value={username}
                disabled={isLockedOut}
                required
            />
        </div>
        <div class="form-group">
            <label for="password">Hasło:</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                disabled={isLockedOut}
                required
            />
        </div>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <button type="submit" disabled={isLockedOut}>
            {#if isLockedOut}
                Zablokowano
            {:else}
                Zaloguj się
            {/if}
        </button>
    </form>
</div>

<!-- Style pozostają bez zmian -->
<style>
    .login-container {
        max-width: 400px;
        margin: 5rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--box-shadow);
    }
    .form-group {
        margin-bottom: 1rem;
    }
    label {
        display: block;
        margin-bottom: 0.5rem;
    }
    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
    }
    .error {
        color: var(--error-color);
        margin-bottom: 1rem;
    }
    button {
        width: 100%;
        padding: 0.75rem;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-weight: bold;
        text-align: center;
    }
    button:hover {
        background-color: var(--secondary-color);
    }
    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>
