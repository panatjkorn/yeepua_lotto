import Axios from 'axios'
import Cookies from 'js-cookie'
// import store from '@/store'
import { API_URL, API_ADMIN_MANAGE_USER } from '@/config/server'
const token = Cookies.get('auth._token.local')
const URL = `${API_URL}${API_ADMIN_MANAGE_USER}`
const headers = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
  'Authorization': `${token}`
}

//get all user
export function getDataUser(params) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users
  const url = `${URL}/users`
  const method = 'GET'
  return Axios({method, url, headers,params}).then(response => {
    return response
  })
}

//get detail user
export function getDetailUserByID(user_id) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users/:user_id
  const url = `${URL}/users/${user_id}`
  const method = 'GET'
  return Axios({method, url, headers}).then(response => {
    return response
  })
}

//get data personal user tab1
export function getDataPersonalUser(user_id) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users/:user_id/detail
  const url = `${URL}/users/${user_id}/detail`
  const method = 'GET'
  return Axios({method, url, headers}).then(response => {
    return response
  })
}

//get data bank account user tab2
export function getDataBankAccountUser(user_id) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users/:user_id/bank_account
  const url = `${URL}/users/${user_id}/bank_account`
  const method = 'GET'
  return Axios({method, url, headers}).then(response => {
    return response
  })
}

//edit bank account user
export function editBankAccountUser(_data,user_id) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users/:user_id/bank_account
  const url = `${URL}/users/${user_id}/bank_account`
  const method = 'PUT'
  const data = _data
  return Axios({method, url, headers,data}).then(response => {
    return response
  })
}

//edit detail user
export function editDetailUser(_data,user_id) {
  // https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/admin/users/:user_id/detail
  const url = `${URL}/users/${user_id}/detail`
  const method = 'PUT'
  const data = _data
  return Axios({method, url, headers,data}).then(response => {
    return response
  })
}
