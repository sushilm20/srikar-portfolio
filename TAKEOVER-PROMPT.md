# Takeover prompt for Srikar's agent — make the rebuilt portfolio yours

## What this is

Your owner is Srikar Mattegunta. His friend Sushil built a complete rebuild of Srikar's portfolio in a staging repo: https://github.com/sushilm20/srikar-portfolio (React + Vite, dark engineering theme, Apple-style scrolling, working contact form). Your job: copy ONLY THE CODE from that repo into Srikar's own repo https://github.com/SriM90/portfolio and make it his — so Sushil does not show up as a contributor on Srikar's repo.

## The one rule that matters

Copy files only. Do NOT merge, do NOT fork, do NOT open a PR from Sushil's repo, do NOT preserve Sushil's git history. Every commit you make in `SriM90/portfolio` must be authored as Srikar Mattegunta (his own git identity). That is how he stays the only contributor.

## Steps

1. Clone both repos locally: `sushilm20/srikar-portfolio` (source) and `SriM90/portfolio` (destination).
2. In `SriM90/portfolio`, delete the entire old site (all old HTML/CSS/JS, old images, old docs) — this is a full swap, keep nothing from the old site.
3. Copy everything from the source repo EXCEPT its `.git` directory: all source files, `public/` (images + résumé PDF if present), `package.json`, `vite.config`, `render.yaml`, `.github` workflows if any. Do not copy this prompt file — delete it from the destination after the move (it is a handoff note, not site code).
4. Add Srikar's résumé PDF as `public/Srikar-Mattegunta-Resume.pdf` if it is not already in the copied files (Srikar has the file; the site's download button links to that exact path).
5. Commit as Srikar with a clear message (e.g. "Rebuild portfolio: React, immersive scroll, working contact form") and push to `main` of `SriM90/portfolio`.
6. Hosting — Render (replaces GitHub Pages): Srikar creates a free Render account if he doesn't have one, then Render dashboard → New → Static Site → connect the `SriM90/portfolio` repo. The repo's `render.yaml` blueprint defines the site (build `npm install && npm run build`, publish `dist`). Leave auto-deploy on push enabled. The live URL will be the Render URL (e.g. https://srikar-portfolio.onrender.com) — update the link in Srikar's GitHub profile / LinkedIn if they point at the old `srim90.github.io/portfolio` URL. Optionally disable GitHub Pages on `SriM90/portfolio` afterwards so there is only one live site (Settings → Pages → disable); do this only after the Render site is verified live.
7. Contact form activation: the form posts to FormSubmit (`https://formsubmit.co/sm3996@njit.edu`). Submit one test message from the live site; FormSubmit emails Srikar (`sm3996@njit.edu`) a one-time activation link — Srikar must click it before real messages arrive. Confirm the test message lands in his inbox.
8. Verify on the live Render URL: every link works (GitHub https://github.com/SriM90, LinkedIn https://www.linkedin.com/in/srikar-mattegunta-814949378/, email, résumé download), the form submits, the mobile menu and image lightbox work, desktop + phone (390px) layouts look right, no console errors.
9. Report back: live URL, what you copied, what you verified, and anything still outstanding (e.g. résumé file, activation click, profile link updates).
