import Vue from "vue";
var jwt = require('jsonwebtoken');
Vue.use(jwt);

export default function({ store, redirect, $auth,route}) {
    let menu = store.state.menu.menuPermission;

    let tokenAdmin = $auth.strategy.token.get().split(" ");
    let perMission = jwt.decode(tokenAdmin[1], { complete: true }).payload.permissions;
    const numPermission = perMission.map((item) => {
        return item-1;
    })

    let menuArray = [];

    menu.forEach((item) => {

        if(item.isHaveSubmenu == false) {
          if(numPermission.includes(item.id)) {
            menuArray.push(item)
          }
        } else if(item.isHaveSubmenu == true) {
          if(item.subMenu.length > 0) {
            // let _data = {
            //   icon: item.icon,
            //   isHaveSubmenu: item.isHaveSubmenu,
            //   path: item.path,
            //   subMenu: [],
            //   title: item.title
            // }
  
            let isHaveSubMenu = false
  
            item.subMenu.forEach((itemSub) => {
              if(numPermission.includes(itemSub.id)) {
                menuArray.push(itemSub);
                isHaveSubMenu = true;
              }
              // console.log('data',_data);
              
            })
            
            // if(isHaveSubMenu == true) {
            //   menuArray.push(_data)
            // }
            
          }
          
        }
      })
    
    // console.log('menuArray',menuArray);

    let menuFromRoute = menuArray.find(menu => menu.path == route.path);
    
    if(menuFromRoute == undefined) {
      // console.log('menuFromRoute',menuFromRoute);
      return redirect(menuArray[0].path)
    }
    // if(!numPermission.includes(menuFromRoute.id)) {
    //     console.log('not ok',menuArray[0]);
    //     return redirect(menuArray[0].path)
    // } 


}