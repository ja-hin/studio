# Sparsh K Enterprise - studio website (home page)

Static home page modelled on the reference site (soundchapelstudio.com), built with plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser.

## Files

- `index.html` - page structure and copy
- `css/style.css` - all styles (colour tokens at the top under `:root`)
- `js/main.js` - mobile menu, hero waveform, stat counters, testimonial slider
- `assets/images/` - put the client's photos, posters and logos here

## What to replace for the client

1. **Logo** - the header uses a text logo. Replace it with the client's logo file once supplied.
2. **Photos** - real photos from the client's Drive folder are in `assets/images/` (resized to 1000 to 1920 px wide). Each image is set inline with `style="background-image:url(assets/images/...)"` in `index.html`, so swapping one is a single edit. The hero background is `.hero-bg` in the CSS.
3. **Posters** in "Known for" - swap `.art-1` to `.art-4` for real poster images and update the project titles.
4. **Client logos** - replace the text in `.client-logo` with `<img>` tags.
5. **Contact details** - email, phone and address in the contact section and footer.
6. **Social links** - the `href="#"` values in the footer.
7. **Stats and testimonials** - the numbers and quotes are copied from the reference site as placeholders. Replace them with the client's own figures and reviews.

## Sections (same order as the reference)

Header, hero with photo strip, Known for, About intro, Stats, Why choose us, Services, Trusted by clients, Our studios (Studio 1 and 2), Gear, Testimonials, Contact CTA, Footer.

## Pages

- `index.html` - Home
- `about.html` - About (story, values, team, clients, stats)
- `services.html` - Services (index of 6, detail sections, how we work)
- `gallery.html` - Gallery with category filters and lightbox
- `contact.html` - Contact form, details, map, FAQ
- `studio-1.html`, `studio-2.html` - Studio pages with specs, gear, photos and booking form

Inner pages load `css/pages.css` and `js/pages.js` in addition to the shared files. The header and footer are repeated in every file, so a nav change must be made in all seven pages.

## Forms

The contact and booking forms post to the URL in their `action` attribute. Replace `https://FORM_ENDPOINT_NOT_SET` with a Formspree or Web3Forms endpoint (one line per form) and submissions will be emailed. Until then the page shows a "not connected" notice instead of sending.
# studio
