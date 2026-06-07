# Creative Animation Site (Canvas Universe) 🌌

A single-page, animation-heavy developer portfolio/workspace built with **Vite**, **Three.js**, and **Anime.js**. You start with a glowing particle “universe” background, click **Explore Workspace**, and the scene transitions into a glassmorphic Bento Grid of project cards.

---

## What you’ll see
- **Interactive particle universe** (Three.js) that subtly reacts to your cursor.
- **Cinematic transition** into the workspace (Anime.js explosion + UI reveal).
- **Bento grid cards** that expand and then **redirect to the project links**.

---

## Features
- Smooth canvas/WebGL background running on `requestAnimationFrame`.
- Cursor-driven parallax rotation for the particle field.
- “Explore Workspace” dissolves the landing layer and reveals the grid.
- “Return” brings the landing layer back and resets particles.
- Clickable cards animated into a full-screen view before redirecting.

---

## Tech stack
- **Vite** (build + dev server)
- **Three.js** (3D particle scene)
- **Anime.js** (timelines, staggered animations, transitions)
- **Vanilla JS (ES modules)** + **HTML/CSS**

---

## How it works (mapped to the code)
- `src/index.html`
  - Defines the landing layer (`#landing-layer`), workspace layer (`#portfolio-content`), and the Bento cards.
  - Each project card uses a `data-url` attribute for redirect.
- `src/js/main.js`
  - Imports CSS and initializes:
    - `initUniverse()` from `src/js/canvasUniverse.js`
    - `inituiAnimations()` from `src/js/uiAnimations.js`
- `src/js/uiAnimations.js`
  - Handles the intro stagger animation (title, subtitle, button)
  - Adds button hover effects
- `src/js/canvasUniverse.js`
  - Creates the Three.js scene using a `canvas#universe`
  - Runs the render loop + cursor tracking
  - On **Explore Workspace**:
    - explodes particles
    - hides landing content
    - animates cards into view
  - On **Return**:
    - restores landing content
    - animates particles back to their original positions
  - On project card click:
    - animates the selected card to fill the screen
    - then redirects to the card’s `data-url`

---

## Getting started

### 1) Install dependencies
```bash
npm install
```

### 2) Start development server
```bash
npm run dev
```

### 3) Build for production
```bash
npm run build
```

### 4) Preview production build
```bash
npm run preview
```

---

## Usage
1. Open the app.
2. Click **Explore Workspace**.
   - The landing layer disappears.
   - The Bento Grid fades/animates in.
3. Click any project card.
   - The card expands with a smooth transition.
   - You’re redirected to the link stored in `data-url`.
4. Click **Return** to go back.

---

## Notes
- This project uses **WebGL** (via Three.js). If you’re on a device/browser with limited WebGL support, the background may not render as expected.

---

## Copyright / sharing note
© 2026 Varad. All rights reserved.

You are welcome to clone this repository for educational analysis, learning, or private experimentation.

If you re-host, adapt, or deploy a public version of this layout, please update or remove the copyright strings in the source files to reflect your own identity.

