/** vite.config.js */
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { unovite } from './js_sdk/a-hua-unocss';
import config from './config.json'

const colors = {
	// 文字色
	text: "#000",
	// 品牌主色
	main: "#2376F3",
	"main-25": "#f7fbff",
	"main-50": "#E6F0FF",
	"main-100": "#CDE1FE",
	"main-200": "#9BC2FD",
	"main-300": "#69A4FC",
	"main-400": "#3685FC",
	"main-500": "#2376F3",
	"main-600": "#0352C9",
	"main-700": "#033E96",
	"main-800": "#022964",
	"main-900": "#011532",
	"main-950": "#000919",
	// 错误色
	error: "#F54C5A",
	"error-50": "#FEE7E9",
	"error-100": "#FCCFD3",
	"error-200": "#FA9EA6",
	"error-300": "#F76E7A",
	"error-400": "#F43E4D",
	"error-500": "#F54C5A",
	"error-600": "#C10B1A",
	"error-700": "#960303",
	"error-800": "#640202",
	"error-900": "#320101",
	"error-950": "#190101",
	// 警示色
	warn: "#F17509",
	"warn-50": "#faf7ed",
	"warn-100": "#FCE4CF",
	"warn-200": "#F9C99F",
	"warn-300": "#F7AE6E",
	"warn-400": "#F3882B",
	"warn-500": "#F17509",
	"warn-600": "#C1600B",
	"warn-650": "#997642",
	"warn-700": "#914808",
	"warn-800": "#603006",
	"warn-900": "#301803",
	"warn-950": "#180c01",
	// 成功色
	success: "#20AC4C",
	"success-50": "#EAFBEF",
	"success-100": "#D4F7DF",
	"success-200": "#A9EFBF",
	"success-300": "#53DF7F",
	"success-400": "#28D75F",
	"success-500": "#20AC4C",
	"success-600": "#188139",
	"success-700": "#146c2f",
	"success-800": "#105626",
	"success-900": "#082b13",
	"success-950": "#04150a",
	// 中性灰
	"gray-25": "#F7F7F7",
	"gray-50": "#F2F2F3",
	"gray-100": "#E5E6E7",
	"gray-150": "#D8D9DA",
	"gray-200": "#CACCCE",
	"gray-300": "#B1B3B5",
	"gray-400": "#96999C",
	"gray-500": "#B1B1B1",
	"gray-600": "#636669",
	"gray-700": "#4A4D4F",
	"gray-800": "#2D2E2F",
	"gray-850": "#252627",
	"gray-900": "#191A1B",
	"gray-950": "#0D0D0D",
	// 品牌灰
	"mainGray-20": "#F7F9FD",
	"mainGray-25": "#F4F6FA",
	"mainGray-50": "#F0F3F7",
	"mainGray-75": "#e6eaef",
	"mainGray-100": "#E0E5EB",
	"mainGray-150": "#D0D8E1",
	"mainGray-200": "#BBC5D3",
	"mainGray-300": "#98AABD",
	"mainGray-400": "#7C90AB",
	"mainGray-450": "#738199",
	"mainGray-500": "#12171C",
	"mainGray-600": "#5F7A95",
	"mainGray-700": "#40536D",
	"mainGray-750": "#33465A",
	"mainGray-800": "#192134",
	"mainGray-950": "#253354"
};

export default defineConfig({
	plugins: [
		uni(),
		unovite({
			theme: { colors },
		})
	],
	server: {
		host: "0.0.0.0",
		port: 8099,
		proxy: {
			"/sf-web": {
				target: config.baseUrl,
				rewrite: (path) => path.replace(/^\/sf-web/, ""),
				changeOrigin: true
			},
			'/stomp': {
					changeOrigin: true,
					target: 'https://dev.huasuerp.com:6060/',
					ws: true,
				},
		}
	},
});