// export const state = () => ({
//   menu: [
//     {
//       icon: 'HomeIcon',
//       path: '/',
//       title: 'หน้าแรก',
//       isShow: true
//     },
//     {
//       icon: 'SidebarIcon',
//       path: '/Lottery',
//       title: 'รายการหวย',
//     },
//     {
//       icon: 'SidebarIcon',
//       path: '',
//       title: 'การเงิน',
//       subMenu: [
//         // {
//         //   icon: "",
//         //   pageName: "",
//         //   title: "จัดการโบนัส",
//         // },
//         {
//           icon: "",
//           pageName: "",
//           path : "/finance/withdrawMoneyList",
//           title: "รายการถอนเงินลูกค้า",
//         },
//         {
//           icon: "",
//           pageName: "WithdrawListAgent",
//           path : "/finance/withdrawMoneyAgent/",
//           title: "รายการถอนเงินตัวแทน",
//         },
//         {
//           icon: "",
//           pageName: "UserDepositFaild",
//           path : "/finance/userDepositFaild",
//           title: "รายการฝากเงินไม่สำเร็จ",
//         },
//         {
//           icon: "",
//           pageName: "",
//           path : "/finance/statement",
//           title: "รายการเดินบัญชี",
//         },
//       ]
//     },
//     // {
//     //   icon: 'SidebarIcon',
//     //   path: '',
//     //   title: 'จัดการงวดออกรางวัล',
//     // },
//     {
//       icon: 'SidebarIcon',
//       path: '/User',
//       title: 'ข้อมูลสมาชิก',
//     },
//     {
//       icon: 'SidebarIcon',
//       path: '/agent',
//       title: 'ข้อมูลตัวแทน',
//     },
//     {
//       icon: 'SidebarIcon',
//       path: '/bonus',
//       title: 'จัดการโบนัส',
//     },
//     {
//       icon: 'SidebarIcon',
//       path: '/Template',
//       title: 'Template',
//     },
//     {
//       icon: "SidebarIcon",
//       path : "/Permission/",
//       title: "สิทธิ์การใช้งานระบบ",
//     },
//     // {
//     //   icon: 'SidebarIcon',
//     //   path: '',
//     //   title: 'รายงาน',
//     // },
//     // {
//     //   icon: 'SidebarIcon',
//     //   path: '',
//     //   title: 'ตั้งค่า',
//     // },
//     'devider',
//   ],
// });
import Vue from "vue";
var jwt = require('jsonwebtoken');

// import createPersistedState from "vuex-persistedstate";
// const dataState = createPersistedState({
//   paths: ['auth'],
//   reducer: state => ({
//     auth: state.auth,
//   })
// })

// console.log('เข้า file side menu');
Vue.use(jwt);
let menuAdmin = [];

let data_menu = [
  {
    icon: 'HomeIcon',
    path: '/',
    title: 'หน้าแรก',
    id: 0,
    isShow: true,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/Lottery',
    title: 'รายการหวย',
    id: 1,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '',
    title: 'การเงิน',
    isHaveSubmenu : true,
    subMenu: [
      {
        icon: "",
        pageName: "",
        path : "/finance/withdrawMoneyList",
        title: "รายการถอนเงินลูกค้า",
        id : 2
      },
      {
        icon: "",
        pageName: "WithdrawListAgent",
        path : "/finance/withdrawMoneyAgent/",
        title: "รายการถอนเงินตัวแทน",
        id : 3
      },
      {
        icon: "",
        pageName: "UserDepositFaild",
        path : "/finance/userDepositFaild",
        title: "รายการฝากเงินไม่สำเร็จ",
        id : 4
      },
      {
        icon: "",
        pageName: "",
        path : "/finance/statement",
        title: "รายการเดินบัญชี",
        id : 5
      },
    ]
  },
  {
    icon: 'SidebarIcon',
    path: '/User',
    title: 'ข้อมูลสมาชิก',
    id : 6,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/agent',
    title: 'ข้อมูลตัวแทน',
    id : 7,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/bonus',
    title: 'จัดการโบนัส',
    isHaveSubmenu : false,
    id : 8
  },
  {
    icon: 'SidebarIcon',
    path: '/Template',
    title: 'Template',
    isHaveSubmenu : false,
    id : 9,
  },
  {
    icon: "SidebarIcon",
    path : "/Permission/",
    title: "สิทธิ์การใช้งานระบบ",
    isHaveSubmenu : false,
    id : 10
  },
  // 'devider',
]

const state = () => {
  return {
    // menu : data_menu,
    menu : menuAdmin
  }
}

const mutations = {
  setMenuToState(state,post) {
    state.menu = post.menuAdmin;
  },

  // setMenuHaveSub(state,post) {
  //   // console.log('setMenuHaveSub',state.menu);
  //   // console.log('setMenuHaveSubPosttt',post);
  //   let index =  post.index;
  //   let subMenu =  post.arraySubmenu;
  //   console.log('index',index);
  //   console.log('subMenu',subMenu);
  //   // console.log('setMenuHaveSub',state.menu[post.index]);
  //   // console.log('setMenuHaveSubPosttt',post.arraySubmenu);
  //   state.menu[index].subMenu = subMenu
  // }
}

const actions = {
  // { state }, token
  async setMenu (vuexContext, context) {

    let tokenAdmin = await this.$auth.strategy.token.get().split(" ");
    let perMission = jwt.decode(tokenAdmin[1], { complete: true }).payload.permissions;
    const numPermission = perMission.map((item) => {
      return item-1;
    })


    data_menu.forEach((item,index) => {

      if(item.isHaveSubmenu == false) {
        if(numPermission.includes(item.id)) {
          menuAdmin.push(item)
        }
      } else if(item.isHaveSubmenu == true) {
        // console.log(item);
        if(item.subMenu.length > 0) {
          let _data = {
            icon: item.icon,
            isHaveSubmenu: item.isHaveSubmenu,
            path: item.path,
            subMenu: [],
            title: item.title
          }

          item.subMenu.forEach((itemSub) => {
            if(numPermission.includes(itemSub.id)) {
              _data.subMenu.push(itemSub);
            }
            // console.log('data',_data);
            
          })
          menuAdmin.push(_data)
        }
        
        
        //เก็บ
        // menuAdmin.push(item)
        // item.subMenu.forEach((itemSub) => {
        //   if(numPermission.includes(itemSub.id)) {
        //     arraySubmenu.push(itemSub);
        //   }
        // })
        // vuexContext.commit("setMenuHaveSub",{
        //   arraySubmenu,index
        // })
        // menuAdmin[index].subMenu = arraySubmenu;
      }
    })
    // console.log('menuAdmin',menuAdmin);
    // console.log(vuexContext);
    vuexContext.commit("setMenuToState", {
      menuAdmin
    })
    menuAdmin = []
    
  }
}

const getters = {
  menu: state => state.menu
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};