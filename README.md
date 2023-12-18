# Taylor Swift Super Fan Website (and i18n Demo, I guess)

* [Live demo](https://fluent-reef.cloudvent.net/)

## Features

* Supports English and Spanish (any number of languages can be added)
	* Using [Eleventy’s i18n plugin](https://www.11ty.dev/docs/plugins/i18n/)
	* Using [`rosetta` for string transformation](https://www.npmjs.com/package/rosetta)
* Custom redirects are not necessary! The HTML links _just work_.
* For-free inter-language page-aware language chooser _(e.g. “Also available in…”)_
* Translated header, footer, and banner (in a different repo via Site Mounting)
* For-free [locale aware search from Pagefind](https://pagefind.app/docs/multilingual/)
* Album art pulled from Spotify Open Graph images
* Deep links to various streaming services
* Built with Eleventy v3.0
	* Using `node` front matter in `songs.liquid` (to enable the `before` pagination callback in JavaScript)
	* Using custom [dual pagination](https://github.com/11ty/eleventy/issues/332) using `before` over both languages and songs.
* Using seasonally [appropriate `<snow-fall>` web component](https://www.zachleat.com/web/snow-fall/).