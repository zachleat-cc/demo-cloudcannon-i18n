const yaml = require("js-yaml");
const rosetta = require("rosetta");

const eleventyImage = require("@11ty/eleventy-img");

const siteMountedConfig = require("./src/_includes/marketing-components/eleventySharedConfig.cjs");

const LANGUAGES = ["en", "es"];

module.exports = async function(eleventyConfig) {
	const { EleventyI18nPlugin } = await import("@11ty/eleventy");

	// used on index.md song pages
	eleventyConfig.addGlobalData("languages", LANGUAGES);

	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: LANGUAGES[0],
	});

	eleventyConfig.addFilter("i18n", function (key, langOverride) {
		let lang = this.page?.lang || this.ctx?.page?.lang || this.context?.environments?.page?.lang || LANGUAGES[0];
		let strs = this.ctx?.i18n || this.context?.environments?.i18n || {};
		let extraData = {}; // for later
		const i18n = rosetta(strs);
		return i18n.t(key, extraData, langOverride || lang);
	})

	// Copy
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

	// Ignores
	eleventyConfig.ignores.add("_schemas/*");

	/* Yaml data */
	eleventyConfig.addDataExtension("md", (contents, filePath) => {
		contents = contents.trim();

		if(contents.startsWith("---")) {
			contents = contents.slice(3);
		}
		if(contents.endsWith("---")) {
			contents = contents.slice(0, -3);
		}

		return yaml.load(contents.trim());
	});

	/* Image processing */
	async function optimizeImage(filepath, attrs = {}) {
		let metadata = await eleventyImage(filepath, {
			widths: ["auto"],
			formats: ["avif", "webp", "jpeg"],
			outputDir: "./public/img/",
			urlPath: "/public/img/",
		});

		let imageAttributes = Object.assign({
			loading: "lazy",
			decoding: "async",
		}, attrs);

		// You bet we throw an error on a missing alt (alt="" works okay)
		return eleventyImage.generateHTML(metadata, imageAttributes);
	}

	eleventyConfig.addShortcode("albumArt", async function(title, url, cls) {
		return optimizeImage(url, {
			alt: `Album art for ${title}`,
			loading: "eager",
			class: "song-album" + (cls ? ` ${cls}` : ""),
		});
	});

	// Site Mounting
	eleventyConfig.addPlugin(siteMountedConfig);

	return {
		dir: {
			input: "src",
			data: "../_data",
		}
	}
};