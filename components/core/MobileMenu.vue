<template>
  <!-- BEGIN: Mobile Menu -->
  <div class="mobile-menu md:hidden">
    <div class="mobile-menu-bar">
      <a href class="flex mr-auto">
        <img
          alt="Midone Tailwind HTML Admin Template"
          class="w-6"
          src="@/assets/images/logo.svg"
        />
      </a>
      <BarChart2Icon
        class="w-8 h-8 text-white transform -rotate-90"
        @click="toggleMobileMenu"
      />
    </div>
    <transition @enter="enter" @leave="leave">
      <ul v-if="activeMobileMenu" class="border-t border-theme-29 py-5">
        <!-- BEGIN: First Child -->
        <template v-for="(menu, menuKey) in formattedMenu">
          <li
            v-if="menu == 'devider'"
            :key="menu + menuKey"
            class="menu__devider my-6"
          ></li>
          <li v-else :key="menu + menuKey">
            <a
              href="javascript:;"
              class="menu"
              :class="{
                'menu--active ': menu.active,
                'menu--open': menu.activeDropdown,
              }"
              @click="linkTo(menu)"
            >
              <div class="menu__icon">
                <IconMenu :icon-id="menu.iconId" />
                <!-- <component :is="menu.icon" /> -->
              </div>
              <div class="menu__title">
                {{ menu.title }}
                <div
                  v-if="menu.subMenu"
                  class="menu__sub-icon"
                  :class="{ 'transform rotate-180': menu.activeDropdown }"
                >
                  <ChevronDownIcon />
                </div>
              </div>
            </a>
            <!-- BEGIN: Second Child -->
            <transition @enter="enter" @leave="leave">
              <ul
                v-if="menu.subMenu && menu.activeDropdown"
                class="menu__sub-open"
              >
                <li
                  v-for="(subMenu, subMenuKey) in menu.subMenu"
                  :key="subMenuKey"
                >
                  <a
                    href="javascript:;"
                    class="menu"
                    :class="{ 'menu--active': subMenu.active }"
                    @click="linkTo(subMenu)"
                  >
                    <div class="menu__icon">
                      <!-- <ActivityIcon /> -->
                      <IconMenu :icon-id="'subMenu'" />
                    </div>
                    <div class="menu__title">
                      {{ subMenu.title }}
                      <div
                        v-if="subMenu.subMenu"
                        class="menu__sub-icon"
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
                      class="menu__sub-open"
                    >
                      <li
                        v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                        :key="lastSubMenuKey"
                      >
                        <a
                          href="javascript:;"
                          class="menu"
                          :class="{ 'menu--active': lastSubMenu.active }"
                          @click="linkTo(lastSubMenu)"
                        >
                          <div class="menu__icon">
                            <ZapIcon />
                          </div>
                          <div class="menu__title">
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
    </transition>
  </div>
  <!-- END: Mobile Menu -->
</template>

<script>
import { nestedMenu } from '@/utils/layout'
import { helper as $h } from '@/utils/helper'
import IconMenu from '~/components/core/IconMenuAdmin';

export default {
  components : {
    IconMenu
  },
  data() {
    return { formattedMenu: '', activeMobileMenu: false }
  },
  watch: {
    $route() {
      this.formattedMenu = $h.toRaw(this.sideMenu())
    },
  },
  mounted() {
    this.formattedMenu = $h.toRaw(this.sideMenu())
  },
  methods: {
    sideMenu() {
      return nestedMenu(this.$store.state.menu.menu, this.$router.currentRoute)
    },
    enter(el, done) {
      return this.$velocity(
        el,
        'slideDown',
        { duration: 300 },
        { complete: done }
      )
    },
    leave(el, done) {
      return this.$velocity(
        el,
        'slideUp',
        { duration: 300 },
        { complete: done }
      )
    },
    toggleMobileMenu() {
      this.activeMobileMenu = !this.activeMobileMenu
    },
    linkTo(menu) {
      if (menu.subMenu) {
        menu.activeDropdown = !menu.activeDropdown
      } else {
        this.activeMobileMenu = false
        this.$nuxt.$router.push(menu.path)
      }
    },
  },
}
</script>

<style></style>
