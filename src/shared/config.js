// Set config for dev and production
export const WEB_PORT = process.env.PORT || 3000
export const isProd = process.env.NODE_ENV === 'production'
