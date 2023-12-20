const yaml = require("js-yaml");
const rosetta = require("rosetta");
const eleventyImage = require("@11ty/eleventy-img");

const LANGUAGES = ["en", "es"];

async function optimizeImage(filepath, options = {}, attrs = {}) {
	let metadata = await eleventyImage(filepath, Object.assign({
		widths: ["auto"],
		formats: ["avif", "webp", "jpeg"],
		outputDir: "./public/img/",
		urlPath: "/public/img/",
	}, options));

	let imageAttributes = Object.assign({
		loading: "lazy",
		decoding: "async",
	}, attrs);

	// You bet we throw an error on a missing alt (alt="" works okay)
	return eleventyImage.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
	eleventyConfig.on("eleventy.beforeConfig", async (eleventyConfig) => {
		const { EleventyI18nPlugin } = await import("@11ty/eleventy");

		eleventyConfig.addPlugin(EleventyI18nPlugin, {
			defaultLanguage: LANGUAGES[0],
		});
	});

	// used on index.md song pages
	eleventyConfig.addGlobalData("languages", LANGUAGES);
	eleventyConfig.addGlobalData("streamingServiceNames", {
		"lastfm": "last.fm",
		"spotify": "Spotify",
		"tidal": "Tidal",
		"youtube": "YouTube",
	});


	eleventyConfig.addFilter("i18n", function (key, langOverride) {
		let lang = this.page?.lang || this.ctx?.page?.lang || this.context?.environments?.page?.lang || LANGUAGES[0];
		let strs = this.ctx?.i18n || this.context?.environments?.i18n || {};
		let extraData = {}; // for later
		const i18n = rosetta(strs);
		return i18n.t(key, extraData, langOverride || lang);
	});

	// Image processing
	eleventyConfig.addShortcode("albumArt", async function(song, cls) {
		if(!song?.urls?.Spotify) {
			return "";
		}

		let albumArtUrl = `https://v1.opengraph.11ty.dev/${encodeURIComponent(song?.urls?.Spotify)}/opengraph/jpeg/`;

		return optimizeImage(albumArtUrl, {}, {
			alt: `Album art for ${song.title}`,
			loading: "eager",
			class: "song-album" + (cls ? ` ${cls}` : ""),
		});
	});

	// Assets
	eleventyConfig.addPassthroughCopy({
		"./public/": "/public/",
		"./node_modules/@11ty/is-land/is-land.js": "/public/is-land.js",
		"./node_modules/@zachleat/pagefind-search/pagefind-search.js": "/public/pagefind-search.js",
		"./node_modules/@zachleat/snow-fall/snow-fall.js": "/public/snow-fall.js",
	});

	// Server
	eleventyConfig.setServerOptions({
		domDiff: false,
	});

	// Liquid
	eleventyConfig.setLiquidOptions({
		jsTruthy: true
	});

	// Site Mounting
	const siteMountedConfig = require("./_includes/marketing-components/eleventySharedConfig.cjs");
	eleventyConfig.addPlugin(siteMountedConfig);

	return {
		dir: {
			input: "src",
			includes: "../_includes/"
		}
	}
};