import Axios from 'axios'
import Cookies from 'js-cookie'
// import store from '@/store'
import { API_URL, API_ADMIN } from '@/config/server'
const token = Cookies.get('auth._token.local')
const URL = `${API_URL}${API_ADMIN}`
const headers = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
  'Authorization': `${token}`
}


