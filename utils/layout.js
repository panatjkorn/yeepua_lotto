// Setup side menu
const findActiveMenu = (subMenu, route) => {
  let match = false;
  subMenu.forEach((item) => {
    if (item.path === route.path && !item.ignore) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, route);
    }
  });
  return match;
};

const nestedMenu = (menu, route) => {
  menu.forEach((item, key) => {
    if (typeof item !== 'string') {
      let menuItem = menu[key];
      menuItem.active =
        (item.path === route.path ||
          (item.subMenu && findActiveMenu(item.subMenu, route))) &&
        !item.ignore;

      if (item.subMenu) {
        menuItem.activeDropdown = findActiveMenu(item.subMenu, route);
        menuItem = {
          ...item,
          ...nestedMenu(item.subMenu, route),
        };
      }
    }
  });

  return menu;
};

const linkTo = (menu, router, event) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    event.preventDefault();
    if(menu.path == '/finance/statement') {
      let route = router().resolve({path: menu.path});
      window.open(route.href, '_blank')
    } else {
      router().push(menu.path);
    }
  }
};

export { nestedMenu, linkTo };
