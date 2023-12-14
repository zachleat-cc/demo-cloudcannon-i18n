const yaml = require("js-yaml");
const rosetta = require("rosetta");

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

	// Components
	eleventyConfig.addPassthroughCopy({
		"./public/*": "/public/",
		"./node_modules/@11ty/is-land/is-land.js": "/public/is-land.js",
	});

	// Server
	eleventyConfig.setServerOptions({
		domDiff: false,
	});
	eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	// Liquid
	eleventyConfig.setLiquidOptions({
		jsTruthy: true
	});

	// Ignores
	eleventyConfig.ignores.add("src/_schemas/*");

	eleventyConfig.addDataExtension("yml, yaml", (contents, filePath) => {
		return yaml.load(contents)
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