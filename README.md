# wiehen.com

Simple static site for wiehen.com, currently deployed via nginx on a DigitalOcean droplet.

## Structure

```
index.html                   Homepage (hero, about, focus areas, contact)
css/style.css                 Homepage styling — auto light/dark based on system preference

kindle-living/index.html     Full Kindle Living brochure site, served at wiehen.com/kindle-living/
kindle-living/css/style.css   Kindle Living's own brand styling (warm/editorial palette, Fraunces + Inter)
kindle-living/js/main.js      Mobile menu, product filters, color swatches, quote-request interactions
kindle-living/images/slides/  12 optimized hero slider photos (slide-01.jpg … slide-12.jpg, max 1920px wide)
```

No build step, no dependencies (Google Fonts is the only external resource, loaded via CSS `@import`).

`kindle-living/` reproduces the structure and copy of the kindleliving.figma.site draft (nav, hero image slider, product grid with filters, featured product, brand story, awards, Heat/Heat & Light/Light sections, testimonial, positioning statement, quote-request flow, footer).

The homepage hero is now a real auto-advancing image slider (`.hero-slider` in `index.html` / `css/style.css`, logic in `js/main.js`), built from photos in `images/slides/` — resized and deduped from the originals in `images/Home-slides/`. To change which photos appear or their order, edit the list of `<div class="slide" style="background-image:url('images/slides/slide-XX.jpg');">` elements in `index.html`.

Everything else (product grid thumbnails, category sections, awards, portrait) is still CSS gradient placeholders (`.grad-1` etc, in `css/style.css`) — swap these for real `<img>` tags or `background-image` as more photography becomes available. Product names in the grid (`kindle-living/js/main.js`, top of file) are placeholders too — edit the `products` array with real names/categories.

## Local preview

Just open `index.html` in a browser, or run a quick local server:

```bash
python3 -m http.server 8000
```

## Deploying to the droplet

The droplet serves this from `/var/www/wiehen.com`. To deploy after pushing changes to GitHub:

```bash
ssh lino@165.227.172.218
cd /var/www/wiehen.com
git pull
```

### First-time setup on the droplet (only needed once)

If `/var/www/wiehen.com` isn't already a git repo:

```bash
ssh lino@165.227.172.218
sudo rm -rf /var/www/wiehen.com/*        # back up first if anything's there you want to keep
sudo git clone https://github.com/<your-username>/wiehen-site.git /var/www/wiehen.com
sudo chown -R lino:lino /var/www/wiehen.com
```

After that, every future update is just a `git pull` on the server following a `git push` from wherever you're editing.
