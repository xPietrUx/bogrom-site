import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const response = await fetch('/api/announcements/active');
        if (response.ok) {
            const announcements = await response.json();
            return { announcements };
        }
    } catch (error) {
        console.error('Nie udało się pobrać ogłoszeń:', error);
    }
    return { announcements: [] };
};
