// import type { HandleFetch } from '@sveltejs/kit';

// /*
//     Redirect sveltekit asking api to nginx
//  */

// export const handleFetch: HandleFetch = async ({ request, fetch }) => {
//     const url = new URL(request.url);
//     if (url.pathname.startsWith('/api/')) {
//         const newUrl = `http://nginx${url.pathname}${url.search}`;
//         const newRequest = new Request(newUrl, {
//             method: request.method,
//             headers: request.headers,
//             body: request.body,
//             mode: request.mode,
//             credentials: request.credentials,
//             cache: request.cache,
//             redirect: request.redirect,
//             integrity: request.integrity,
//             referrer: request.referrer,
//         });

//         return fetch(newRequest);
//     }

//     return fetch(request);
// };
