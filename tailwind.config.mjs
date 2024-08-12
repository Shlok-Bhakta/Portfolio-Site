/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
			  "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
			},
			keyframes: {
			  "border-beam": {
				"100%": {
				  "offset-distance": "100%",
				},
			  },
			},
		  },
		fontFamily: {
			'display': ['CaskaydiaCoveNF', "/fonts/CaskaydiaCoveNF.ttf"],
		  }
	},
	plugins: [require("@catppuccin/tailwindcss")],
}
