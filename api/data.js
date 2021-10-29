import Axios from 'axios'
import Cookies from 'js-cookie'
// import store from '@/store'
import { API_URL, API_DATA } from '@/config/server'
const token = Cookies.get('auth._token.local')
const URL = `${API_URL}${API_DATA}`
const headers = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
  'Authorization': `${token}`
}

//get data bank
export function getDataBank() {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/data/bank
  const url = `${URL}/banks`
  const method = 'GET'
  return Axios({method, url, headers}).then(response => {
    return response
  })
}
