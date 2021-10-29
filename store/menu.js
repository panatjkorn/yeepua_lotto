
import Vue from "vue";
var jwt = require('jsonwebtoken');

Vue.use(jwt);
let menuAdmin = [];

let data_menu = [
  {
    icon: 'HomeIcon',
    path: '/',
    title: 'หน้าแรก',
    id: 0,
    isShow: true,
    iconId : 1,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/Lottery',
    title: 'รายการหวย',
    id: 1,
    iconId : 2,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '',
    title: 'การเงิน',
    iconId : 3,
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
        pageName: "TopupPendingList",
        path : "/finance/PendingList/",
        title: "รายการรอชำระเงิน",
        id : 11
      },
      {
        icon: "",
        pageName: "UserDepositFaild",
        path : "/finance/userDepositFaild",
        title: "รายการฝากเงินล้มเหลว",
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
    iconId : 4,
    id : 6,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/agent',
    title: 'ข้อมูลตัวแทน',
    iconId : 5,
    id : 7,
    isHaveSubmenu : false
  },
  {
    icon: 'SidebarIcon',
    path: '/bonus',
    title: 'จัดการโบนัส',
    iconId : 6,
    isHaveSubmenu : false,
    id : 8
  },
  {
    icon: 'SidebarIcon',
    path: '/Template',
    title: 'Template',
    iconId : 7,
    isHaveSubmenu : false,
    id : 9,
  },
  // {
  //   icon: 'SidebarIcon',
  //   path: '/admin',
  //   title: 'จัดการผู้ดูแลระบบ',
  //   iconId : 7,
  //   isHaveSubmenu : false,
  //   id : 12,
  // },
  {
    icon: "SidebarIcon",
    path : "/Permission/",
    title: "สิทธิ์การใช้งานระบบ",
    iconId : 8,
    isHaveSubmenu : false,
    id : 10
  },
  // 'devider',
]

const state = () => {
  return {
    // menu : data_menu,
    menuPermission : data_menu,
    menu : null,
  }
}

const mutations = {
  setMenuToState(state,post) {
    // console.log('set to state',state);
    state.menu = post.menuAdmin;
  },

}

const actions = {
  // { state }, token
  async setMenu (vuexContext, context) {

    let tokenAdmin = await this.$auth.strategy.token.get().split(" ");
    let perMission = jwt.decode(tokenAdmin[1], { complete: true }).payload.permissions;
    const numPermission = perMission.map((item) => {
      return item-1;
    })

    // console.log('numPermission',numPermission);


    data_menu.forEach((item,index) => {

      if(item.isHaveSubmenu == false) {
        if(numPermission.includes(item.id)) {
          menuAdmin.push(item)
        }
      } else if(item.isHaveSubmenu == true) {
        if(item.subMenu.length > 0) {
          let _data = {
            icon: item.icon,
            isHaveSubmenu: item.isHaveSubmenu,
            path: item.path,
            subMenu: [],
            iconId : item.iconId,
            title: item.title
          }

          let isHaveSubMenu = false

          item.subMenu.forEach((itemSub) => {
            if(numPermission.includes(itemSub.id)) {
              _data.subMenu.push(itemSub);
              isHaveSubMenu = true;
            }
            // console.log('data',_data);
            
          })
          
          if(isHaveSubMenu == true) {
            menuAdmin.push(_data)
          }
          
        }
        
      }
    })
    // console.log('เข้าลูปเมนูแอดมิน',menuAdmin);
    if(context == true) {
        vuexContext.commit("setMenuToState", {
            menuAdmin
        })
    }
    
    menuAdmin = []
    
  }
}

const getters = {
//   menu: state => state.menu
  menu : state => state.menu,
  menuPermission: state => state.menuPermission
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};