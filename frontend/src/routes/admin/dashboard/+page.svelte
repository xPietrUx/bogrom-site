<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';

    export let data: PageData;

    let canvas: HTMLCanvasElement;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        await goto('/login');
    }

    onMount(() => {
        if (data.statsData?.dailyVisits && canvas) {
            Chart.register(...registerables);

            const dailyVisits: Record<string, number> =
                data.statsData.dailyVisits;

            const labels = Object.keys(dailyVisits);
            const visitCounts = Object.values(dailyVisits);

            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Liczba odwiedzin',
                            data: visitCounts,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0,
                            },
                        },
                    },
                },
            });
        }
    });
</script>

<div class="admin-panel">
    <h1>Panel Administratora</h1>
    {#if data.error}
        <p class="error">{data.error}</p>
    {:else if data.dashboardData && data.statsData}
        <p>{data.dashboardData.message}</p>

        <div class="stats-container">
            <div class="stat-card">
                <h2>Wysłane wiadomości</h2>
                <p class="stat-number">{data.statsData.sentMessagesCount}</p>
                <small>w ciągu ostatniego miesiąca</small>
            </div>
            <div class="stat-card">
                <h2>Odwiedziny</h2>
                <p class="stat-number">{data.statsData.visitsCount}</p>
                <small>w ciągu ostatniego miesiąca</small>
            </div>
            <div class="stat-card">
                <h2>Aktywne ogłoszenia</h2>
                <p class="stat-number">
                    {data.statsData.activeAnnouncementsCount}
                </p>
            </div>
        </div>

        <div class="chart-container">
            <h2>Odwiedziny w ciągu ostatniego miesiąca</h2>
            <canvas bind:this={canvas}></canvas>
        </div>
    {/if}
</div>

<style>
    .admin-panel {
        max-width: 900px;
        margin: 2rem auto;
        padding: 2rem;
        text-align: center;
    }
    .stats-container {
        display: flex;
        justify-content: space-around;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
    }
    .stat-card {
        flex: 1;
        min-width: 200px;
        padding: 1.5rem;
        border: 1px solid #ccc;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--box-shadow);
    }
    .stat-number {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
        color: var(--primary-color);
    }
    .chart-container {
        margin-top: 3rem;
    }
    button {
        margin-top: 2rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--error-color);
        color: white;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
    .error {
        color: var(--error-color);
    }
</style>
