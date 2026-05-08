# DanEnergy — Portfolio Website

**Domain:** danenergy.io
**Stack:** Static HTML/CSS/JS — no build step, no framework
**Hosting target:** Cloudflare Pages (free, global CDN, auto-HTTPS)
**Form provider:** Web3Forms (free up to 250 submissions/month)
**Languages:** English (default) + German (`/de/`)

## File structure

```
danenergy-site/
├── index.html              ← English homepage (all sections on one page)
├── de/
│   └── index.html          ← German version
├── blog/
│   ├── index.html          ← Blog index (post list)
│   ├── why-energy-is-cost.html   ← First demo post
│   └── _template.html      ← Copy this to add new posts
├── css/styles.css          ← All styles (dark + light theme, responsive)
├── js/main.js              ← Nav, theme toggle, scroll reveal, form handler
├── assets/
│   └── images/             ← Logo + project reference images
├── robots.txt
├── sitemap.xml
├── _headers                ← Cloudflare Pages security headers
└── .gitignore
```

## Local preview

Open `index.html` directly in a browser, or — recommended — start a tiny local server so relative paths and the form behave exactly like in production:

```bash
# Python 3 (any OS)
python -m http.server 8000
# then open http://localhost:8000
```

## Step 1 — Wire up the contact form (Web3Forms)

1. Go to <https://web3forms.com>, click **Create Access Key**, enter `hello@danenergy.io` (or whatever inbox you want messages forwarded to).
2. Copy the access key.
3. In `index.html` and `de/index.html`, find:

   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
   ```

   Replace `YOUR_ACCESS_KEY` with the key from step 2 (in both files).
4. Optional: in the same form block, change `subject` and `from_name` if you want different email titles.

> Web3Forms is free up to 250 submissions/month, no backend, no DB. Honeypot anti-spam is already wired in.

## Step 2 — Push to GitHub

1. Create a new repo on GitHub: `danenergy-site` (private or public — Cloudflare Pages handles both).
2. From inside `danenergy-site/`:

   ```bash
   git init
   git add .
   git commit -m "Initial commit — DanEnergy site"
   git branch -M main
   git remote add origin git@github.com:<your-username>/danenergy-site.git
   git push -u origin main
   ```

## Step 3 — Deploy on Cloudflare Pages

1. Sign up / log in at <https://dash.cloudflare.com>.
2. Left sidebar → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Authorize Cloudflare to access GitHub, pick `danenergy-site`.
4. Build settings:
   - **Framework preset:** *None*
   - **Build command:** *(leave empty)*
   - **Output directory:** `/` (root)
5. Click **Save and Deploy**. After ~30 seconds you'll get a `*.pages.dev` preview URL — verify the site works there.

## Step 4 — Point danenergy.io to Cloudflare

You bought the domain on Squarespace. Two options:

### Option A (recommended) — move DNS to Cloudflare

This unlocks Cloudflare's free CDN, DDoS protection and analytics on the apex domain.

1. In Cloudflare dashboard → **Add a site** → enter `danenergy.io`. Choose the Free plan.
2. Cloudflare gives you **two nameservers** (e.g. `xyz.ns.cloudflare.com`).
3. Log in to Squarespace → **Settings** → **Domains** → `danenergy.io` → **DNS Settings** → **Use custom nameservers** → paste the Cloudflare nameservers.
4. Wait 5–60 minutes for propagation. Cloudflare will email you when it's active.
5. Back in Cloudflare → **Workers & Pages** → your project → **Custom domains** → **Set up a custom domain** → `danenergy.io` and `www.danenergy.io`. Cloudflare creates the records automatically.

### Option B — keep DNS at Squarespace

In Squarespace DNS settings, add:
- `CNAME` `www` → `<your-project>.pages.dev`
- `A` `@` → `192.0.2.1` *(Cloudflare gives you the actual IP in the custom-domain setup)*

Option A is cleaner; Option B works but you lose Cloudflare's edge features on the apex.

## Step 5 — Email forwarding for hello@danenergy.io

If you want a real `hello@danenergy.io` inbox without paying for Google Workspace:

1. In Cloudflare dashboard → your domain → **Email** → **Email Routing** → **Get started**.
2. Add destination address (`daniloskoric@outlook.com`) and verify it.
3. Add custom address: `hello@danenergy.io` → forward to `daniloskoric@outlook.com`.
4. Cloudflare auto-creates the MX records. Done.

Free, unlimited forwarding, no setup fee. You'll receive Web3Forms submissions and direct emails on the same Outlook inbox.

## Step 6 — Make it your own

- **Branding:** logo and visual identity are already wired in. To change accent colors, edit `--color-accent` in `css/styles.css`.
- **Add a project:** edit the `.projects-grid` section in `index.html` (and `de/index.html` if you want the DE version updated). Drop the image into `assets/images/` and reference it with a `background-image:url(...)`.
- **Add a blog post:**
  1. `cp blog/_template.html blog/my-post.html`
  2. Fill in title, meta, body
  3. Add a card to `blog/index.html` linking to `my-post.html`
- **Replace placeholder Imprint/Privacy:** the German market requires a proper Impressum & Datenschutzerklärung. Generate at <https://www.e-recht24.de/impressum-generator.html> and <https://www.e-recht24.de/muster-datenschutzerklaerung.html>, paste into `imprint.html` and `privacy.html`, link from the footer.
- **Light theme:** already implemented — `DARK` button in nav toggles it, choice is persisted in localStorage.
- **Responsive:** mobile-first layout, breakpoints at 720px and 960px. Tested down to 320px width.

## Updating the site

Every push to `main` auto-deploys to Cloudflare Pages. Workflow:

```bash
# edit a file
git add .
git commit -m "update services section"
git push
# → Cloudflare deploys automatically in ~30s
```

## Roadmap ideas (when you have time)

- **Imprint + Privacy pages** (legally required for DE market)
- **OG image** — render a 1200×630 social card
- **Service-detail pages** — one per service for SEO depth
- **PV calculator widget** — interactive yield estimator (lead magnet)
- **Case study writeups** — anonymized, focusing on the engineering decision rather than the client
- **Newsletter signup** — Buttondown or Beehiiv free tier

---

## License & ownership

All content © Danilo Skoric. The site code is the personal project of DanEnergy — feel free to adapt for your own portfolio if useful.
