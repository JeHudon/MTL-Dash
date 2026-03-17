export default {
    async fetch(request) {
        const url = new URL(request.url);
        const nhlUrl =
            "https://api-web.nhle.com/v1" + url.pathname.replace("/api", "") + url.search;

        return fetch(nhlUrl, {
            headers: request.headers,
            method: request.method,
        });
    },
};
