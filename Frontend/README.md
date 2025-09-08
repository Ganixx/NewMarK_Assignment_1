# NewMarK Properties Frontend

Production-ready React + Vite app for browsing and managing property listings.

## Scripts

- `npm run dev`: start dev server
- `npm run build`: type-check and build production assets to `dist`
- `npm run preview`: preview the production build locally
- `npm run test`: run unit tests

## Environment

Create a `.env` file in `Frontend/`:

```env
VITE_API_BASE_URL=/api
```

In production, set `VITE_API_BASE_URL` to your backend URL (e.g. `https://api.example.com`).

## SEO & PWA

- Metadata, Open Graph, and Twitter tags in `index.html`
- `public/site.webmanifest` for installability
- `public/robots.txt` and `public/sitemap.xml` for crawling

If you add PNG icons, place them under `public/icons/` and reference them in the manifest.

## Deployment notes

- Build: `npm run build` → outputs to `dist/`
- Serve `dist/` with any static host (Netlify, Vercel, Nginx, S3+CloudFront)
- Single-page app routing: enable fallback to `index.html` for unknown routes
  - Netlify: `_redirects` with `/* /index.html 200`
  - Vercel: use `routes` with SPA fallback
  - Nginx example:

```nginx
location / {
  try_files $uri /index.html;
}
```

## Testing

Vitest and Testing Library are configured. Run `npm run test`.
