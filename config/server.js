
let apiUrl = 'https://lottery-api-dev-gye6ncwdlq-as.a.run.app'
let webUrl = 'https://lottery-admin-web-dev-gye6ncwdlq-as.a.run.app'

if (process.env.RUN_MODE === 'dev') {
  apiUrl = 'https://lottery-api-dev-gye6ncwdlq-as.a.run.app'
  webUrl = 'https://lottery-admin-web-dev-gye6ncwdlq-as.a.run.app'
}

if (process.env.RUN_MODE === 'prod') {
  apiUrl = 'https://lottery-api-prod-gye6ncwdlq-as.a.run.app'
  webUrl = 'https://lottery-admin-web-prod-gye6ncwdlq-as.a.run.app' 
}
// export const API_VERSION_ADMIN = '/v1/admin'
export const API_ADMIN = '/api/v1/admin'
export const API_ADMIN_MANAGE_USER = '/api/v1/admin_manage_user'
export const API_DATA = '/api/v1/data'
export const API_URL = apiUrl
export const APP_URL = webUrl

