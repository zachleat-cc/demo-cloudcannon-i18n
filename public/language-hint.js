window.customElements.define("language-hint", class extends HTMLElement {
	connectedCallback() {
		if(!navigator.language.startsWith(document.documentElement.lang)) {
			this.classList.add("mismatch");
		} else {
			this.classList.remove("mismatch");
		}
	}
});