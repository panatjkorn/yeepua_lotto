
// const state = () => ({
//     isAdminCookie : "",
//     isRefreshToken : "",
//     login : false
// })

// const mutations = {
//     addCookieToState(state,post) {
//         state.isAdminCookie = post.setCookie
//         state.isRefreshToken = post.refreshToken
//         state.login = true;
//     },
//     deleteCookieToState(state) {
//         // console.log('delete');
//         state.isAdminCookie = null
//         state.isRefreshToken = null
//         state.login = false
//     }
// }

// const actions = {
//     addCookie(vuexContext, context) {
//         const adminCookie = context
//         vuexContext.commit("addCookieToState", {
//           adminCookie
//         })
//     },
//     deleteCookie(context) {
//       console.log('context',context);
//       context.commit('deleteCookieToState');
//     }
// }

// const getters = {
//     // isGetCookie(state) {
//     //     return state.isAdminCookie
//     // }
//     cookieAdmin: state => state.isAdminCookie,
//     refreshToken: state => state.isRefreshToken,
// }

// export default {
//     namespaced: true,
//     state,
//     mutations,
//     getters,
//     actions
// };

