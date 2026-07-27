# Favicon instructions

Place the image you attached (calendar icon) into this folder so it can be used as the site's favicon.

Recommended filenames and locations:
- `images/favicon.png` — used by the existing HTML link in `index.html`.
- `favicon.ico` — optional, some older clients prefer `.ico`.

Quick steps
1. Save the attached image as `favicon.png` and put it in `public/images/`.
2. Optional: convert to an `.ico` containing multiple sizes using ImageMagick (Windows/macOS/Linux):

```powershell
# Resize and create multi-size ICO (requires ImageMagick)
magick convert images\favicon.png -define icon:auto-resize=64,48,32,16 favicon.ico
```

Notes
- Browsers may cache favicons — clear browser cache or open in a private window to verify changes.
- `index.html` already references `/images/favicon.png?v=2` so placing the file at `public/images/favicon.png` is sufficient.

If you'd like, I can add the image into the repo for you — upload it here or confirm and I'll proceed.
