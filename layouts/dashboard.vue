<template>
  <div>
    <!-- <DarkModeSwitcher /> -->
    <MobileMenu />
    <TopBar />
    <div class="wrapper">
      <div class="wrapper-box">
        <!-- BEGIN: Side Menu -->
        <nav class="side-nav">
          <ul>
            <!-- BEGIN: First Child -->
            <template v-for="(menu, menuKey) in formattedMenu">
              <li
                v-if="menu == 'devider'"
                :key="menu + menuKey"
                class="side-nav__devider my-6"
              ></li>
              <li v-else :key="menu + menuKey">
                <a
                  :ref="`menu-${menuKey}`"
                  v-tippy="{
                    arrow: true,
                    arrowType: 'round',
                    placement: 'right',
                  }"
                  :content="menu.title"
                  class="side-menu cursor-pointer focus:outline-none"
                  :class="{
                    'side-menu--active': menu.active,
                    'side-menu--open': menu.activeDropdown,
                  }"
                  @click="linkTo(menu, router, $event)"
                >
                  <div class="side-menu__icon">
                    <IconMenu :icon-id="menu.iconId" />
                    <!-- <component :is="menu.icon" /> -->
                  </div>
                  <div class="side-menu__title text-white">
                    {{ menu.title }}
                    <!-- <div v-if="menu.title == 'การเงิน' && notiUserWithdraw == true"
                    class="w-5 h-5 flex items-center justify-center absolute top-0 right-0 text-xs text-white rounded-full bg-red-800 font-medium -mt-1 -mr-1">

                    </div> -->
                    <div
                      v-if="menu.subMenu"
                      class="side-menu__sub-icon"
                      :class="{ 'transform rotate-180': menu.activeDropdown }"
                    >
                      <ChevronDownIcon />
                    </div>
                  </div>
                </a>
                <!-- BEGIN: Second Child -->
                <transition @enter="enter" @leave="leave">
                  <ul v-if="menu.subMenu && menu.activeDropdown">
                    <li
                      v-for="(subMenu, subMenuKey) in menu.subMenu"
                      :key="subMenuKey"
                      class="cursor-pointer"
                    >
                      <a
                        v-tippy="{
                          arrow: true,
                          arrowType: 'round',
                          placement: 'right',
                        }"
                        class="side-menu focus:outline-none"
                        :class="{
                          'side-menu--active': subMenu.active,
                          'side-menu--open': subMenu.activeDropdown,
                        }"
                        :content="subMenu.title"
                        @click="linkTo(subMenu, router, $event)"
                      >
                        <div class="side-menu__icon">
                          <IconMenu :icon-id="'subMenu'" />
                          <!-- <ActivityIcon /> -->
                        </div>
                        <div class="side-menu__title">
                          {{ subMenu.title }}
                          <div
                            v-if="subMenu.subMenu"
                            class="side-menu__sub-icon"
                            :class="{
                              'transform rotate-180': subMenu.activeDropdown,
                            }"
                          >
                            <ChevronDownIcon />
                          </div>
                        </div>
                      </a>
                      <!-- BEGIN: Third Child -->
                      <transition @enter="enter" @leave="leave">
                        <ul
                          v-if="subMenu.subMenu && subMenu.activeDropdown"
                          class="block"
                        >
                          <li
                            v-for="(
                              lastSubMenu, lastSubMenuKey
                            ) in subMenu.subMenu"
                            :key="lastSubMenuKey"
                            class="cursor-pointer"
                          >
                            <a
                              v-tippy="{
                                arrow: true,
                                arrowType: 'round',
                                placement: 'right',
                              }"
                              class="side-menu focus:outline-none"
                              :class="{
                                'side-menu--active': lastSubMenu.active,
                              }"
                              @click="linkTo(lastSubMenu, router, $event)"
                            >
                              <div class="side-menu__icon">
                                <ZapIcon />
                              </div>
                              <div class="side-menu__title">
                                {{ lastSubMenu.title }}
                              </div>
                            </a>
                          </li>
                        </ul>
                      </transition>
                      <!-- END: Third Child -->
                    </li>
                  </ul>
                </transition>
                <!-- END: Second Child -->
              </li>
            </template>
            <!-- END: First Child -->
          </ul>
        </nav>
        <!-- END: Side Menu -->
        <!-- BEGIN: Content -->
        
        <div class="content">
          <!-- @click="$router.push('/finance/statement')" -->
          
          <NuxtLink v-if="notiUserWithdraw == true" to="/finance/withdrawMoneyList" target="_blank">
            <span
              class="relative inline-flex rounded-md shadow-sm mt-2"
            >
            <span
              class="
                animate-ping
                absolute
                inline-flex
                h-full
                w-full
                rounded-md
                bg-red-600
                opacity-75
              "
            ></span>
            <div
              type="button"
              class="
                inline-flex
                items-center
                px-4
                py-1
                text-base
                leading-6
                font-medium
                rounded-md
                bg-transparent
                text-red-600
                hover:text-blue-800
                focus:border-red-300
                shadow-lg
                transition
                ease-in-out
                duration-150
                z-50
                cursor-pointer
              "
            >
              Userถอนเงิน
            </div>
          </span>
          </NuxtLink>
          
          <NuxtLink v-if="notiAgentWithdraw == true" to="/finance/withdrawMoneyAgent/" target="_blank">
            <span
              class="relative inline-flex rounded-md shadow-sm mt-2"
            >
            <span
              class="
                animate-ping
                absolute
                inline-flex
                h-full
                w-full
                rounded-md
                bg-red-600
                opacity-75
              "
            ></span>
            <div
              type="button"
              class="
                inline-flex
                items-center
                px-4
                py-1
                text-base
                leading-6
                font-medium
                rounded-md
                bg-transparent
                text-red-600
                hover:text-blue-800
                focus:border-red-300
                shadow-lg
                transition
                ease-in-out
                duration-150
                z-50
                cursor-pointer
              "
            >
              Agentถอนเงิน
            </div>
          </span>
          </NuxtLink>
          <nuxt />
        </div>
        <!-- <button @click="callToStore()">xxxxxx</button> -->
        <!-- END: Content -->
      </div>
    </div>
    <!-- </client-only> -->
  </div>
</template>

<script>
// import store from '@/store';
import IconMenu from '~/components/core/IconMenuAdmin';

import { linkTo, nestedMenu } from '@/utils/layout';
import { helper as $h } from '@/utils/helper';
import TopBar from '@/components/core/TopBar';
import MobileMenu from '@/components/core/MobileMenu';

export default {
  components: {
    TopBar,
    MobileMenu,
    IconMenu
  },
  data() {
    return {
      formattedMenu: '',
      notiUserWithdraw : false,
      notiAgentWithdraw : false
    };
  },
  watch: {
    $route() {
      this.formattedMenu = $h.toRaw(this.sideMenu());
    },
  },
  created() {
    this.callToSetMenu();
  },
  mounted() {
    document.body.classList.add('main');
    document.body.classList.remove('error-page');
    document.body.classList.remove('login');
    this.formattedMenu = $h.toRaw(this.sideMenu());

    this.getNotiUserWithdraw();
    this.getNotiAgenWithdraw();

    this.dataIntervalUserWithdraw = setInterval(() => {
      this.getNotiUserWithdraw(); },
    60000);

    this.dataIntervalAgentWithdraw = setInterval(() => {
      this.getNotiAgenWithdraw(); },
    60000);
    // this.$nextTick(() => {
    //   console.log(this.$refs)
    //   console.log(this.$refs['menu-1'])
    // })
  },
  destroyed() {
    clearInterval(this.dataIntervalUserWithdraw);
    clearInterval(this.dataIntervalAgentWithdraw);
  },
  methods: {
    callToSetMenu() {
      this.$store.dispatch('menu/setMenu')
    },
    sideMenu() {
      return nestedMenu(this.$store.state.menu.menu, this.$router.currentRoute);
    },
    linkTo,
    enter(el, done) {
      return this.$velocity(
        el,
        'slideDown',
        { duration: 300 },
        { complete: done }
      );
    },
    leave(el, done) {
      return this.$velocity(
        el,
        'slideUp',
        { duration: 300 },
        { complete: done }
      );
    },
    router() {
      return this.$nuxt.$router;
    },
    async getNotiUserWithdraw() {
      const url = `admin_dashboard/noti/user/withdraw`;
      try {
        const getUserWithdrawNoti = await this.$axios.get(url);
        // console.log('getUserWithdrawNoti',getUserWithdrawNoti);
        this.notiUserWithdraw = getUserWithdrawNoti.data.data;
        // console.log(this.notiUserWithdraw);
      } catch(err) {
        console.log(err);
      }
    },
    async getNotiAgenWithdraw() {
      const url = `admin_dashboard/noti/agent/withdraw`;
      try {
        const getAgentWithdrawNoti = await this.$axios.get(url);
        this.notiAgentWithdraw = getAgentWithdrawNoti.data.data;
        // console.log('notiAgentWithdraw',this.notiAgentWithdraw);
        // console.log(this.notiUserWithdraw);
      } catch(err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
