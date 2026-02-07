# Almost Sent

A small place for the messages that never made it. The ones you typed out and deleted. The confessions, the apologies, the *I miss you*s and the *I wish I had told you*s that never got sent.

**Almost Sent** lets you write a note—to someone (by name or initial) and a short message—and leave it in a shared archive. No sign-in, no pressure. Just a quiet corner for the things we almost said.

---

## What’s in here

- **Write a note** — Who it’s to, and what you wanted to say (max 200 characters).
- **Archive** — Browse notes, search by name, refresh when you want to see new ones.
- **Guide** — The story behind the project (link in the header).

---

## Run it locally

1. Clone the repo and `cd` into it.
2. Create a `.env` in the project root (this file is gitignored):

   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

3. Start the local server (it serves the site and exposes `/env.json` so the app can talk to Supabase):

   ```bash
   node server.js
   ```

4. Open **http://localhost:3000** in your browser.

---

## Deploy on GitHub Pages

GitHub Pages only serves static files. So you have two paths:

**Option A — Static only (no live notes from the hosted site)**  
Push the repo and turn on GitHub Pages for this repo (e.g. “Deploy from branch” → main → `/ (root)` or a `docs` folder). The pages will load, but the app won’t have Supabase keys unless you bake them into the client (not ideal for public repos).

**Option B — Use the static site + your own backend**  
- Host the static files (e.g. `index.html`, `guide.html`, `app.js`, `styles.css`, images) on GitHub Pages.
- Run `server.js` somewhere that can serve `env.json` (e.g. a tiny Node host), and point the app at that URL for config, **or** configure the app to read Supabase URL/key from another source (e.g. build-time env in a static host that supports it).

For a quick “demo on GitHub Pages” you can use Option A; for a real “write and read notes” deployment, use Option B and keep your Supabase keys out of the repo.

---

## Tech

- Plain HTML, CSS, JavaScript (no framework).
- [Supabase](https://supabase.com) for the database (table name used in code: `unsent_notes`).
- Local dev: Node.js static server that serves files and `/env.json` from `.env`.

---

## In place of a license

This project is offered in the spirit of those almost-sent messages: no formal license, just a hope that you use it kindly. Take the idea, remix it, or run it as-is. If you build something with it, a nod back somewhere is lovely but not required. Mostly: say the things you need to say, when you’re ready.

*— For the things we almost sent.*
