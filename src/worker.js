export default {
    async fetch(request, env, ctx) {
        // Static assets are served automatically by Cloudflare
        // Add any custom Worker logic here if needed
        return env.ASSETS.fetch(request);
    },
};
