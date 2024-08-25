/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
			  "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
			  "meteor": "meteor 5s linear infinite",
			},
			keyframes: {
			  "border-beam": {
					"100%": {
						"offset-distance": "100%",
					},
			  },
			  "meteor": {
					"0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
					"70%": { opacity: 1 },
					"100%": {
						transform: "rotate(215deg) translateX(-500px)",
						opacity: 0,
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
