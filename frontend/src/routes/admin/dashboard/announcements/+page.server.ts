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

    const response = await fetch('/api/announcements', {
        headers: {
            Cookie: `token=${token}`,
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw redirect(307, '/login');
        }
        return {
            announcements: [],
            error: 'Nie udało się załadować ogłoszeń.',
        };
    }

    const announcements = await response.json();
    return {
        announcements,
    };
};
