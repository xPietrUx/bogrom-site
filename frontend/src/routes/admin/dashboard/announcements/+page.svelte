<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    let announcements = data.announcements || [];
    let content = '';
    let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);
    let editingId: number | null = null;

    async function handleSubmit() {
        const url = editingId
            ? `/api/announcements/${editingId}`
            : '/api/announcements';
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, expiresAt }),
        });

        if (response.ok) {
            await refreshAnnouncements();
            resetForm();
        } else {
            alert('Wystąpił błąd.');
        }
    }

    async function deleteAnnouncement(id: number) {
        if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;

        const response = await fetch(`/api/announcements/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            await refreshAnnouncements();
        } else {
            alert('Nie udało się usunąć ogłoszenia.');
        }
    }

    function editAnnouncement(announcement: (typeof announcements)[0]) {
        editingId = announcement.id;
        content = announcement.content;
        expiresAt = new Date(announcement.expiresAt).toISOString().slice(0, 16);
    }

    function resetForm() {
        editingId = null;
        content = '';
        expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16);
    }

    async function refreshAnnouncements() {
        const res = await fetch('/api/announcements');
        if (res.ok) {
            announcements = await res.json();
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('pl-PL');
    }
</script>

<div class="announcements-panel">
    <h1>Zarządzanie Ogłoszeniami</h1>

    <form on:submit|preventDefault={handleSubmit} class="announcement-form">
        <h2>{editingId ? 'Edytuj' : 'Dodaj'} ogłoszenie</h2>
        <div class="form-group">
            <label for="content">Treść</label>
            <textarea id="content" bind:value={content} required rows="4"
            ></textarea>
        </div>
        <div class="form-group">
            <label for="expiresAt">Wygasa dnia</label>
            <input
                type="datetime-local"
                id="expiresAt"
                bind:value={expiresAt}
                required
            />
        </div>
        <div class="form-actions">
            <button type="submit"
                >{editingId ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}</button
            >
            {#if editingId}
                <button type="button" on:click={resetForm}>Anuluj</button>
            {/if}
        </div>
    </form>

    <div class="announcements-list">
        <h2>Istniejące ogłoszenia</h2>
        {#if announcements.length > 0}
            <ul>
                {#each announcements as announcement (announcement.id)}
                    <li>
                        <div class="announcement-content">
                            <p>{announcement.content}</p>
                            <small
                                >Wygasa: {formatDate(
                                    announcement.expiresAt
                                )}</small
                            >
                        </div>
                        <div class="announcement-actions">
                            <button
                                on:click={() => editAnnouncement(announcement)}
                                >Edytuj</button
                            >
                            <button
                                on:click={() =>
                                    deleteAnnouncement(announcement.id)}
                                class="delete-btn">Usuń</button
                            >
                        </div>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>Brak ogłoszeń.</p>
        {/if}
    </div>
</div>

<style>
    .announcements-panel {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
    }
    .announcement-form {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #ccc;
        border-radius: var(--border-radius-sm);
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
    }
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
    }
    .form-actions {
        display: flex;
        gap: 1rem;
    }
    .announcements-list ul {
        list-style: none;
        padding: 0;
    }
    .announcements-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #eee;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .announcement-actions {
        display: flex;
        gap: 0.5rem;
    }
    button {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        border: none;
        cursor: pointer;
        background-color: var(--primary-color);
        color: var(--body-bg);
    }

    .delete-btn {
        background-color: var(--error-color);
        color: white;
    }
</style>
