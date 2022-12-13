import { sveltekit } from '@sveltejs/kit/vite';
import injectSocketIO from "./socket/socket-handler.js";

const config = {
	plugins: [sveltekit(),
	{
		name: "sveltekit-socket-io",
		configureServer(server) {
			injectSocketIO(server.httpServer); // <- call the function here
		}
	}
]
};

export default config;
