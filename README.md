# Almost Sent

A small place for the messages that never made it. The ones you typed out and deleted. The confessions, the apologies, the *I miss you*s and the *I wish I had told you*s that never got sent.

**Almost Sent** lets you write a note—to someone (by name or initial) and a short message—and leave it in a shared archive. No sign-in, no pressure. Just a quiet corner for the things we almost said.

Inspired by [The Unsent Project](https://theunsentproject.com).

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

## Tech

- Plain HTML, CSS, JavaScript (no framework).
- [Supabase](https://supabase.com) for the database (table name used in code: `unsent_notes`).
- Local dev: Node.js static server that serves files and `/env.json` from `.env`.

---

## In place of a license

This project is offered in the spirit of those almost-sent messages: no formal license, just a hope that you use it kindly. Take the idea, remix it, or run it as-is. If you build something with it, a nod back somewhere is lovely but not required. Mostly: say the things you need to say, when you’re ready.

*— For the things we almost sent.*
