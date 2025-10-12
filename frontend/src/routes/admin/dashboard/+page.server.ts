import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
    fetch,
    cookies,
}: ServerLoadEvent) => {
    const token = cookies.get('token');
    if (!token) {
        throw redirect(307, '/login');
    }

    const headers = {
        Cookie: `token=${token}`,
    };

    const [dashboardResponse, statsResponse] = await Promise.all([
        fetch('/api/auth/dashboard', { headers }),
        fetch('/api/analytics/stats', { headers }),
    ]);

    if (!dashboardResponse.ok || !statsResponse.ok) {
        if (dashboardResponse.status === 401 || statsResponse.status === 401) {
            throw redirect(307, '/login');
        }
        return {
            error: 'Nie udało się załadować danych.',
        };
    }

    const dashboardData = await dashboardResponse.json();
    const statsData = await statsResponse.json();

    return {
        dashboardData,
        statsData,
    };
};
