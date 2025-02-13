import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const path = context.url.pathname;
    console.log(path);
    if(path === '/games/spreadthelight/spreadthelight') {
        const response = await next();
        // Add headers to the response
        response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        return response;
    }

    // if the path goes to the contact page, redirect to the main page
    if(path === '/contact/') {
        return context.redirect('/index.html');

    }

    return next();
});
