# Cloudflare Pages Deployment

This repository deploys the docs app to Cloudflare Pages through [deploy-docs.yml](../.github/workflows/deploy-docs.yml).

## Why Pages

`ui.sil.mt` should be hosted with Cloudflare Pages, not a Worker custom domain.

- Cloudflare Pages supports custom **subdomains** without moving the parent zone to Cloudflare.
- Worker custom domains are attached to a hostname **within a Cloudflare zone**.
- If `sil.mt` stays on another DNS provider, Pages + external CNAME is the simplest fit.

## One-time Cloudflare setup

1. Create a Cloudflare Pages project named `ui-docs`.
2. In that Pages project, open **Custom domains** and add `ui.sil.mt`.
3. Keep the Pages-generated `*.pages.dev` hostname for the project. You will need it for DNS.

If you use a different Pages project name, update `CLOUDFLARE_PAGES_PROJECT` in [deploy-docs.yml](../.github/workflows/deploy-docs.yml).

## One-time DNS setup at the current `sil.mt` provider

Add this record at the provider that currently hosts DNS for `sil.mt`:

```txt
Type:    CNAME
Name:    ui
Target:  ui-docs.pages.dev
```

Replace `ui-docs.pages.dev` if your Cloudflare Pages project uses a different default hostname.

Do not add only the CNAME first. Add `ui.sil.mt` in the Cloudflare Pages dashboard before or during the DNS change so Cloudflare can provision the hostname correctly.

## GitHub secrets

Add these repository secrets before enabling the workflow:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token should be scoped to deploy and manage the target Cloudflare Pages project in the correct account.

## Deploy flow

Every push to `main` or `master` will:

1. Install dependencies
2. Run the test suite
3. Run docs type-checking
4. Build the docs app
5. Upload `docs-app/dist` to Cloudflare Pages

## Notes

- If `sil.mt` has restrictive `CAA` records, allow Cloudflare-supported certificate issuers before attaching `ui.sil.mt`.
- If you want Cloudflare proxying for other `sil.mt` hostnames while keeping external authoritative DNS, Cloudflare documents partial zones for Business or Enterprise plans. That is not required for `ui.sil.mt` on Pages.
