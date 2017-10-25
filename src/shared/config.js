// Set config for dev and production
export const WEB_PORT = process.env.PORT || 3000
export const IS_PROD = process.env.NODE_ENV === 'production'
