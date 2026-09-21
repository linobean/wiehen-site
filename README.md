# wiehen.com

Simple static site for wiehen.com, currently deployed via nginx on a DigitalOcean droplet.

## Structure

```
index.html                 Homepage (hero, about, focus areas, contact)
css/style.css               Homepage styling — auto light/dark based on system preference

kindle-living/index.html   Brochure site for Kindle Living, served at wiehen.com/kindle-living/
kindle-living/css/style.css Kindle Living's own styling (separate palette/brand from the homepage)
```

No build step, no dependencies. Edit the HTML/CSS directly and redeploy.

`kindle-living/` is currently placeholder copy — replace the bracketed text and section content in `kindle-living/index.html` with the real content when ready. It's linked from the homepage footer.

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
