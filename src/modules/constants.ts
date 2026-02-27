export const PROJECT_NAME = process.env.BASEDSERVER_PROJECT_NAME ?? "Inksplash"; // Default prefix for the logger module.
export const PROJECT_VERSION = process.env.BASEDSERVER_PROJECT_VERSION ?? "1.0";
export const BODY_SIZE_LIMIT = process.env.BASEDSERVER_BODY_SIZE_LIMIT ?? "50mb"; // Doesn't accept requests with body sizes larger than this value.
export const SERVER_URL = process.env.BASEDSERVER_SERVER_URL ?? "localhost"; // The server's URL. Not used for a lot by default.
export const IS_HTTPS = process.env.BASEDSERVER_IS_HTTPS ?? SERVER_URL !== "localhost";
export const SHOW_PORT = (process.env.BASEDSERVER_SHOW_PORT ?? "false") == "true"
export const PORT = process.env.BASEDSERVER_PORT ?? 6677; // Port for the server to run on.
export const ENDPOINT_AUTHENTICATION_ENABLED = !!process.env.BASEDSERVER_ENDPOINT_AUTHENTICATION; // Whether the server is locked down behind a header.
export const _ENDPOINT_AUTHENTICATION_ENV = process.env.BASEDSERVER_ENDPOINT_AUTHENTICATION;
export const ENDPOINT_AUTH_HEADER = _ENDPOINT_AUTHENTICATION_ENV?.split(":")[0]; // Header name for endpoint auth.
export const ENDPOINT_AUTH_VALUE = _ENDPOINT_AUTHENTICATION_ENV?.split(":")[1]; // Value of the header for endpoint auth.
export const FULL_SERVER_ROOT = `http${IS_HTTPS ? "s" : ""}://${SERVER_URL}${(SHOW_PORT ? `:${PORT}` : "")}`; // A shortcut so that you don't need to type this out every time you wanna display the server URL.

export const ENVIRONMENT = process.env.BASEDSERVER_ENVIRONMENT ?? "develop";
export const IS_NGINX = ["yes", "true"].includes((process.env.BASEDSERVER_IS_NGINX ?? "false").toLowerCase());
export const IS_DEBUG = ENVIRONMENT.toLowerCase().includes("develop") || ENVIRONMENT.toLowerCase().includes("stage"); // IS_DEBUG can be used to enable test endpoints, unsafe code and more.

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
export const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://test:test@localhost:11111/inksplash";

export const DISCORD_EPOCH = 1420070400000;
export const SERVICE_IDENTIFIER = `${`${PROJECT_NAME}-${PROJECT_VERSION}`.toLowerCase().replace(/[\s\.]/ig, "-")}-${ENVIRONMENT.toLowerCase()}-${Math.round((Date.now() - DISCORD_EPOCH) / 1000)}`;
export const GATEWAY_IDENTIFIER = `gateway-${SERVICE_IDENTIFIER}`

// --- Inksplash
export const INK_GATEWAY_PORT = parseInt(process.env.INK_GATEWAY_PORT ?? "6688");
export const INK_GATEWAY_HEARTBEAT_INTERVAL_MS = parseInt(process.env.INK_GATEWAY_HEARTBEAT_INTERVAL_MS ?? "41250")