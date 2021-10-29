
const state = () => ({
  accessToken : null,
  refreshToken : null,
})


const mutations = {
  addCookieToState(state,post) {
    state.accessToken = post.accessToken
    state.refreshToken = post.refreshToken

  },
  // deleteCookieToState(state) {
  //     // console.log('delete');
  //     state.isAdminCookie = null
  //     state.isRefreshToken = null
  //     state.login = false
  // }
}

const actions = {
  setCookie(vuexContext, context) {
    vuexContext.commit('addCookieToState', context);
  },
  // deleteCookie(context) {
  //   console.log('context',context);
  //   context.commit('deleteCookieToState');
  // }
}

const getters = {
  cookieAdmin: state => state.accessToken,
  refreshToken: state => state.refreshToken,
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
