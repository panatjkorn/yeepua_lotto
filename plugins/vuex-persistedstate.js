import createPersistedState from 'vuex-persistedstate'
import menu from '~/store/menu'
export default ({store}) => {
    // console.log('storexxx',store);
    createPersistedState({
      key: 'menu',
      paths: [menu],
      reducer: state => ({
        menu: state.menu,
      })
    })(store)
  }
      //   reducer: state => console.log('statexxxxxxxxx',state.menu.menu)