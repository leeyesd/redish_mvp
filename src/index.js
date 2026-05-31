export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response('Static assets are not connected. Deploy with wrangler.toml.', {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
