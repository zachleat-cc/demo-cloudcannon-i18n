// Thank you! https://codepen.io/alphardex/pen/dyPorwJ
class Snow extends HTMLElement {
	static random(min, max) {
		return min + Math.floor(Math.random() * (max - min) + 1);
	}

	generateCss(count) {
		let css = [];
		css.push(`
:host {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	pointer-events: none;
}
* {
	position: absolute;
	width: 10px;
	height: 10px;
	background: #fff;
	border-radius: 50%;
}`);
		count = count ?? 100;

		for(let j = 1; j<= count; j++ ) {
			let x = Snow.random(0, 90); // vw
			let offset = Snow.random(-10, 10); // vw
			let xEnd = x + offset; // (vw)
			let xEndYoyo = x + offset / 2; // (vw)
			let yoyoY = Math.round(Snow.random(30, 100)); // % (time) and vh
			let scale = Snow.random(0, 1);
			let duration = Snow.random(10, 30); // s
			let delay = Snow.random(0, 30) * -1; // s

			css.push(`
:nth-child(${j}) {
	opacity: ${Snow.random(0, 10000) * 0.0001};
	transform: translate(${x}vw, -10px) scale(${scale});
	animation: fall-${j} ${duration}s ${delay}s linear infinite;
}

@keyframes fall-${j} {
	${yoyoY}% {
		transform: translate(${xEnd}vw, ${yoyoY}vh) scale(${scale});
	}

	to {
		transform: translate(${xEndYoyo}vw, 100vh) scale(${scale});
	}
}`)
		}
		return css.join("\n");
	}

	connectedCallback() {
		// https://caniuse.com/mdn-api_cssstylesheet_replacesync
		if(this.shadowRoot || !("replaceSync" in CSSStyleSheet.prototype)) {
			return;
		}

		let count = parseInt(this.getAttribute("count")) || 100;
		let shadowroot = this.attachShadow({ mode: "open" });

		let sheet = new CSSStyleSheet();
		sheet.replaceSync(this.generateCss(count));
		shadowroot.adoptedStyleSheets = [sheet];

		let d = document.createElement("div");
		for(let j = 0, k = count; j<k; j++) {
			shadowroot.appendChild(d.cloneNode());
		}
	}
}

customElements.define("snow-fall", Snow);