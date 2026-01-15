# Calcforge – Minecraft Damage Calculator

Calcforge is a small static site that focuses on accurate Minecraft combat maths.
It currently ships with a Minecraft Damage Calculator for both Java and Bedrock
editions, plus supporting content pages (about, terms, privacy, contact,
disclaimer).

All pages are plain HTML + Tailwind CSS loaded from CDN. There is no build
step or framework; you can deploy the repository as a static site to any host.

## Project structure

- `index.html` – Landing page that explains Minecraft damage and links to tools
- `tools/minecraft-damage-calculator/index.html` – Main calculator UI
- `assets/js/site.js` – Theme switcher and small UI helpers
- `assets/js/damage-calculator.js` – Core damage calculation logic
- `about.html`, `terms.html`, `privacy.html`, `contact.html`, `disclaimer.html` – Informational and legal pages

## Running locally

Because everything is static, you can either open `index.html` directly in a
browser or serve the folder with a simple HTTP server.

Examples:

- Using Python 3: `python -m http.server 8000`
- Using Node (serve): `npx serve .`

Then open `http://localhost:8000/` in your browser.

## Analytics

The site uses Google Analytics 4 via `gtag.js` with the measurement ID
`G-0HHBDEVG14`. The snippet is included in:

- `index.html`
- `tools/minecraft-damage-calculator/index.html`
- `about.html`
- `terms.html`
- `privacy.html`
- `contact.html`
- `disclaimer.html`

Legal and contact pages include `meta name="robots" content="noindex,follow"`
to avoid wasting crawl budget while keeping internal links crawlable.

