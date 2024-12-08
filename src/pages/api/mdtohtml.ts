import type { APIRoute } from 'astro';



export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const phoneNumberInput = url.searchParams.get('phonenum') as string;


    return new Response(JSON.stringify("yabadoo"),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

}