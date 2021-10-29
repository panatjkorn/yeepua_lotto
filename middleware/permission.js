import Vue from "vue";
var jwt = require('jsonwebtoken');
Vue.use(jwt);

export default function({ store, redirect, $auth,route}) {
  let data_menu_permission = store.state.menu.menuPermission;
  // console.log('data_menu_permission',data_menu_permission);

    // let data_menu_permission = [
    //     {
    //       icon: 'HomeIcon',
    //       path: '/',
    //       title: 'หน้าแรก',
    //       id: 0,
    //       isShow: true,
    //       iconId : 1,
    //       isHaveSubmenu : false
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/Lottery',
    //       title: 'รายการหวย',
    //       id: 1,
    //       iconId : 2,
    //       isHaveSubmenu : false
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '',
    //       title: 'การเงิน',
    //       iconId : 3,
    //       isHaveSubmenu : true,
    //       subMenu: [
    //         {
    //           icon: "",
    //           pageName: "",
    //           path : "/finance/withdrawMoneyList",
    //           title: "รายการถอนเงินลูกค้า",
    //           id : 2
    //         },
    //         {
    //           icon: "",
    //           pageName: "WithdrawListAgent",
    //           path : "/finance/withdrawMoneyAgent/",
    //           title: "รายการถอนเงินตัวแทน",
    //           id : 3
    //         },
    //         {
    //           icon: "",
    //           pageName: "TopupPendingList",
    //           path : "/finance/PendingList/",
    //           title: "รายการรอชำระเงิน",
    //           id : 11
    //         },
    //         {
    //           icon: "",
    //           pageName: "UserDepositFaild",
    //           path : "/finance/userDepositFaild",
    //           title: "รายการฝากเงินล้มเหลว",
    //           id : 4
    //         },
    //         {
    //           icon: "",
    //           pageName: "",
    //           path : "/finance/statement",
    //           title: "รายการเดินบัญชี",
    //           id : 5
    //         },
    //       ]
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/User',
    //       title: 'ข้อมูลสมาชิก',
    //       iconId : 4,
    //       id : 6,
    //       isHaveSubmenu : false
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/agent',
    //       title: 'ข้อมูลตัวแทน',
    //       iconId : 5,
    //       id : 7,
    //       isHaveSubmenu : false
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/bonus',
    //       title: 'จัดการโบนัส',
    //       iconId : 6,
    //       isHaveSubmenu : false,
    //       id : 8
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/Template',
    //       title: 'Template',
    //       iconId : 7,
    //       isHaveSubmenu : false,
    //       id : 9,
    //     },
    //     {
    //       icon: 'SidebarIcon',
    //       path: '/admin',
    //       title: 'จัดการผู้ดูแลระบบ',
    //       iconId : 7,
    //       isHaveSubmenu : false,
    //       id : 12,
    //     },
    //     {
    //       icon: "SidebarIcon",
    //       path : "/Permission/",
    //       title: "สิทธิ์การใช้งานระบบ",
    //       iconId : 8,
    //       isHaveSubmenu : false,
    //       id : 10
    //     },
    // ]

    let tokenAdmin = $auth.strategy.token.get().split(" ");
    let perMission = jwt.decode(tokenAdmin[1], { complete: true }).payload.permissions;
    const numPermission = perMission.map((item) => {
        return item-1;
    })

    let menuArray = [];

    data_menu_permission.forEach((item) => {

        if(item.isHaveSubmenu == false) {
          if(numPermission.includes(item.id)) {
            menuArray.push(item)
          }
        } else if(item.isHaveSubmenu == true) {
          if(item.subMenu.length > 0) {

            let isHaveSubMenu = false
  
            item.subMenu.forEach((itemSub) => {
              if(numPermission.includes(itemSub.id)) {
                menuArray.push(itemSub);
                isHaveSubMenu = true;
              }
              
            })
          }
          
        }
    })
    // console.log('menuArray',menuArray);

    let menuFromRoute = menuArray.find(menu => menu.path == route.path);
    
    if(menuFromRoute == undefined) {
      return redirect(menuArray[0].path)
    }
}