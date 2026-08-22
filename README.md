# Ashwani Kumar | Computational Engineering Researcher

Personal site of **Ashwani Kumar**, a researcher at ETH Zürich working on multiphysics and multiscale
simulation of manufacturing processes, machine-learning surrogate models, and FEM.

Live at **[ashwakumar.github.io](https://ashwakumar.github.io/)**.

## Structure

```
index.html              single-scroll home page (dark)
multiscale_sps.html     Direct FE² for spark plasma sintering
multimaterial_sps.html  Multi-material SPS
sps_sim.html            Material parameter identification for SPS
bone_sim.html           Bone tunnel stress in AC joint reconstruction
dolomite_sim.html       Stress regime effects on carbonate permeability

assets/css/main.css     home page styles
assets/css/paper.css    project / paper page styles (light academic theme)
assets/js/main.js       scroll reveals, word animation, scroll-spy nav

index_old.html          previous vCard-template site, kept for reference (noindex)
assets/css/style.css    styles for the old site only
assets/js/script.js     scripts for the old site only
assets/js/particles.js  particle background for the old site only
```

## Design

Two deliberately opposed themes:

- **Home page** — near-black (`#101a1f`) with an ember accent (`#f4581e`), full-viewport hero,
  credential marquee, sticky scroll-spy nav, alternating full-bleed colour blocks.
- **Project pages** — white academic theme, the inverse of the home page. Research artifacts should
  read as paper, not as marketing. Set `--accent: #111111` in `paper.css` to neutralise the remaining
  accent entirely.

Typography is Inter Tight + IBM Plex Mono, headings at a single weight — size and tight leading do the
work rather than boldness. All sizing is fluid `clamp()`; no breakpoint-only layout.

No frameworks, no build step. Plain HTML, CSS, and vanilla JS.

## Running locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>.

## Credits

The previous version of this site (`index_old.html`) was based on the
[vCard Personal Portfolio](https://github.com/codewithsadee/vcard-personal-portfolio) template by
[codewithsadee](https://github.com/codewithsadee). The current design is a ground-up rewrite.

---
*© 2026 Ashwani Kumar*
