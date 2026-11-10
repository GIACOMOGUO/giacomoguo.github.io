# GIACOMO GUO — Website UI Foundation V1

Responsive, buildless static portfolio. Open `index.html` directly in a browser, or run the optional build with Node.js 20 or newer. The build validates project data and creates a single offline preview file at `dist/index.html`.

```sh
node build.mjs
node preview.mjs
```

Open `dist/mobile.html` to try the site inside a 390 px phone-width frame. The optional preview server listens on `http://127.0.0.1:4173/` and serves the same two previews. Links use hash routes so project URLs work in subdirectories and on ordinary static hosting.

## Replace the demo projects

1. Add your image files to `assets/`. Use lowercase filenames without spaces. WebP, AVIF, JPEG, PNG and SVG are supported by the preview build.
2. Open `projects.js` and copy an entry in the `projects` list. Give it a unique lowercase `id`, then set its title, year, category, type, summary and description. Category buttons are generated from the entries.
3. Set `images.object` and `images.context` to the relevant paths and describe each image in its `alt` field. Choose `landscape`, `portrait` or `square` for `ratio`. Set `demo: false` once you replace the sample content.
4. Set `featured` to the ID for the home image. An optional `hero` image is useful for a wide crop. When omitted, the project’s Context image is used.
5. Add a verified address to `contactEmail` to show the address and enable the email-draft link. The enquiry form prepares text locally. It has no server, submission database or automatic delivery.
6. Run `node build.mjs` again to generate an updated standalone preview.

The original demo illustrations were created for this UI preview. All demo entries are visibly labelled. No third-party designer’s project, photo, template or hosted font is used. Typography uses the visitor’s system sans-serif and monospace fonts.

## Future integration

- The renderer consumes a single data model in `projects.js`. A CMS can export the same fields at build time. This version has no CMS login or upload interface.
- `viewerSlot()` is an isolated integration point. Set `project.viewer.src` when adding a viewer module. The slot retains the static Object image for devices where a viewer is unavailable. V1 has no model renderer or lighting controls.
- Review the demo copy and contact address before public use. The independent development branch contains no workflow, domain or deployment setting changes.
