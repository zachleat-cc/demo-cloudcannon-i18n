module.exports = {
	"pagination": {
		"before": function(paginationData, fullData) {
			let ret = [];
			for(let songKey in fullData.songs) {
				let song = fullData.songs[songKey];
				for(let lang of Object.keys(song)) {
					if(lang === "metadata") {
						continue;
					}

					ret.push({
						language: lang,
						slug: lang !== "en" ? `/${lang}/` : "/",
						...song.metadata,
						...song[lang],
					});
				}
			}
			return ret;
		}
	}
}