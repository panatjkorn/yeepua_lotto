<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed -mt-7 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-2"
  >
    <div class="h-full flex items-center">
      <!-- BEGIN: Logo -->
      <a href="" class="-intro-x hidden md:flex">
        <img
          alt="Icewall Tailwind HTML Admin Template"
          class="w-6"
          src="@/assets/images/blueswan.png"
        />
        <span class="text-white text-lg ml-3">
          blue<span class="font-medium">swan</span>
        </span>
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <div class="-intro-x breadcrumb mr-auto">
        <a href="">Application</a>
        <ChevronRightIcon class="breadcrumb__icon" />
        <a href="" class="breadcrumb--active">{{ currentRouteName }}</a>
      </div>
      <!-- <div class="-intro-x breadcrumb mr-auto">
        <div v-for="(item, index) in crumbs" :key="item.id" class="inline-block">
          <a href="" class="inline-block">{{ item.path }}</a>
          <ChevronRightIcon v-if="index != crumbs.length - 1" class="breadcrumb__icon inline-block" />
        </div>
      </div> -->

      <!-- END: Breadcrumb -->
      <!-- BEGIN: Search -->
      <!-- <div class="intro-x relative mr-3 sm:mr-6">
        <div class="search hidden sm:block">
          <input
            type="text"
            class="search__input form-control dark:bg-dark-1 border-transparent placeholder-theme-8"
            placeholder="Search..."
            @focus="showSearchDropdown"
            @blur="hideSearchDropdown"
          />
          <SearchIcon class="search__icon dark:text-gray-300" />
        </div>
        <a class="notification sm:hidden" href="#">
          <SearchIcon
            class="notification__icon dark:text-gray-300"
            @click="showSearchDropdown"
            @blur="hideSearchDropdown"
          />
        </a>
        <div class="search-result" :class="{ show: searchDropdown }">
          <div class="search-result__content">
            <div class="search-result__content__title">Pages</div>
            <div class="mb-5">
              <a href="" class="flex items-center">
                <div
                  class="w-8 h-8 bg-theme-29 text-theme-10 flex items-center justify-center rounded-full"
                >
                  <InboxIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Mail Settings</div>
              </a>
              <a href="" class="flex items-center mt-2">
                <div
                  class="w-8 h-8 bg-theme-30 text-theme-24 flex items-center justify-center rounded-full"
                >
                  <UsersIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Users & Permissions</div>
              </a>
              <a href="" class="flex items-center mt-2">
                <div
                  class="w-8 h-8 bg-theme-31 text-theme-26 flex items-center justify-center rounded-full"
                >
                  <CreditCardIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Transactions Report</div>
              </a>
            </div>
            <div class="search-result__content__title">Users</div>
            <div class="mb-5">
              <a
                v-for="(faker, fakerKey) in $_.take($f(), 4)"
                :key="fakerKey"
                href
                class="flex items-center mt-2"
              >
                <div class="w-8 h-8 image-fit">
                  <img
                    alt="Icewall Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="require(`@/assets/images/${faker.photos[0]}`)"
                  />
                </div>
                <div class="ml-3">{{ faker.users[0].name }}</div>
                <div
                  class="ml-auto w-48 truncate text-gray-600 text-xs text-right"
                >
                  {{ faker.users[0].email }}
                </div>
              </a>
            </div>
            <div class="search-result__content__title">Products</div>
            <a
              v-for="(faker, fakerKey) in $_.take($f(), 4)"
              :key="fakerKey"
              href
              class="flex items-center mt-2"
            >
              <div class="w-8 h-8 image-fit">
                <img
                  alt="Icewall Tailwind HTML Admin Template"
                  class="rounded-full"
                  :src="require(`@/assets/images/${faker.images[0]}`)"
                />
              </div>
              <div class="ml-3">{{ faker.products[0].name }}</div>
              <div
                class="ml-auto w-48 truncate text-gray-600 text-xs text-right"
              >
                {{ faker.products[0].category }}
              </div>
            </a>
          </div>
        </div>
      </div> -->
      <!-- END: Search -->
      <!-- BEGIN: Notifications -->
      <div class="intro-x dropdown mr-4 sm:mr-6">
        <div
          class="dropdown-toggle notification notification--bullet cursor-pointer"
          role="button"
          aria-expanded="false"
        >
          <BellIcon class="notification__icon dark:text-gray-300" />
        </div>
        <div class="notification-content pt-2 dropdown-menu">
          <div
            class="notification-content__box dropdown-menu__content box dark:bg-dark-6"
          >
            <div class="notification-content__title">Notifications</div>
            <!-- <div
              v-for="(faker, fakerKey) in $_.take($f(), 5)"
              :key="fakerKey"
              class="cursor-pointer relative flex items-center"
              :class="{ 'mt-5': fakerKey }"
            >
              <div class="w-12 h-12 flex-none image-fit mr-1">
                <img
                  alt="Icewall Tailwind HTML Admin Template"
                  class="rounded-full"
                  :src="require(`@/assets/images/${faker.photos[0]}`)"
                />
                <div
                  class="w-3 h-3 bg-theme-10 absolute right-0 bottom-0 rounded-full border-2 border-white"
                ></div>
              </div>
              <div class="ml-2 overflow-hidden">
                <div class="flex items-center">
                  <a href="javascript:;" class="font-medium truncate mr-5">{{
                    faker.users[0].name
                  }}</a>
                  <div class="text-xs text-gray-500 ml-auto whitespace-nowrap">
                    {{ faker.times[0] }}
                  </div>
                </div>
                <div class="w-full truncate text-gray-600 mt-0.5">
                  {{ faker.news[0].shortContent }}
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <!-- END: Notifications -->
      <!-- BEGIN: Account Menu -->
      <div class="intro-x dropdown w-8 h-8">
        <div
          class="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
          role="button"
          aria-expanded="true"
        >
          <img
            alt="Icewall Tailwind HTML Admin Template"
            :src="require(`@/assets/images/profile-10.jpg`)"
          />
        </div>
        <div class="dropdown-menu w-56">
          <div
            class="dropdown-menu__content box bg-theme-11 dark:bg-dark-6 text-white"
          >
            <div class="p-4 border-b border-theme-12 dark:border-dark-3">
              <div class="font-medium">Admin</div>
              <div class="text-xs text-theme-13 mt-0.5 dark:text-gray-600">
                {{ $auth.loggedIn ? 'สถานะ Login' : 'สถานะไม่ได้ Login' }}
              </div>
            </div>
            <div class="p-2">
              <a
                href="#"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-2 dark:hover:bg-dark-3 rounded-md"
                @click="getDataProfileAdmin"
              >
                <UserIcon class="w-4 h-4 mr-2" /> Profile
              </a>
              <!-- <a
                href=""
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-2 dark:hover:bg-dark-3 rounded-md"
              >
                <EditIcon class="w-4 h-4 mr-2" /> Add Account
              </a>
              <a
                href=""
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-2 dark:hover:bg-dark-3 rounded-md"
              >
                <LockIcon class="w-4 h-4 mr-2" /> Reset Password
              </a>
              <a
                href=""
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-2 dark:hover:bg-dark-3 rounded-md"
              >
                <HelpCircleIcon class="w-4 h-4 mr-2" /> Help
              </a> -->
            </div>
            <div class="p-2 border-t border-theme-12 dark:border-dark-3">
              <button
                @click="logout"
                class="flex items-center p-2 transition duration-300 ease-in-out hover:bg-theme-2 dark:hover:bg-dark-3 rounded-md w-full"
              >
                <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <client-only>

        <ModalEditProfile
          :data-profile-admin="dataProfileAdmin"
          :gender-admin="genderAdmin"
          @modalConfirmEditProfileAdmin="editProfileAdmin"
        />

      </client-only>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>

<script>
import ModalEditProfile from '@/components/Modal/Admin/ModalEditProfile';
import alertMixins from '~/mixins/alertMixin'

export default {
  components : {
    ModalEditProfile,
  },
  mixins : [alertMixins],
  data() {
    return {
      searchDropdown: false,
      genderAdmin : '',
      dataProfileAdmin : '',
      dataPositionAdmin : '',
      formEditAdmin : ''
    }
  },

  created() {
    this.getGenderAdmin();
    // this.getPositionAdmin();
  },
  methods: {
    showSearchDropdown() {
      this.searchDropdown = true
    },
    hideSearchDropdown() {
      this.searchDropdown = false
    },
    wowowo() {
      // console.log('1')
    },
    async getGenderAdmin() {
      const url = `data/genders`;

      try {
        const getGender = await this.$axios.get(url);
        this.genderAdmin = getGender.data.data;
      } catch(err) {
        console.log(err);
      }

    }, 

    async getPositionAdmin() {
      const url = `data/admin_positions`;

      try {
        const getPositionAdmin = await this.$axios.get(url);
        // console.log('getPositionAdmin',getPositionAdmin);
        this.dataPositionAdmin = getPositionAdmin.data.data;
      } catch(err) {
        console.log(err);
      }
    },

    async getDataProfileAdmin() {
      // console.log('get data profile admin');
      // this.formAdmin = {
      //   username : '',
      //   password1 : '',
      //   password2 : '',
      //   arrayPermission : [],
      //   position : '',
      //   name_profile : '',
      //   phone_number : '',
      //   email : '',
      //   gender_id : '',
      // }

      const url = `admin/me` //GetMe

      try {
        const getProfile = await this.$axios.get(url);
        this.dataProfileAdmin = getProfile.data.data;
        this.$cash('#modal-edit-profile').modal('show');
      } catch(err) {
        console.log(err);
      }
    },

    async editProfileAdmin(data) {

      const url = `admin/me` //EditAdminDetail

      try {
        const editProfile = await this.$axios.put(url,data);
        // console.log('editProfile',editProfile);
        if(editProfile.status == 200) {
          this.$cash('#modal-edit-profile').modal('hide');
          this.successAlertWord(editProfile.data.message);
        }
      } catch(err) {
        console.log(err);
        if(err.response.status == 400) {
          this.$cash('#modal-edit-profile').modal('hide');
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          console.log(err.response);
          this.$cash('#modal-edit-profile').modal('hide');
          this.errorAlertStatusCode(err.response.data.message);
        }
      }
    },

    async logout() {
      await this.$auth.logout();
      // await this.$router.push('/login')
      setTimeout(() => {
        this.$router.go()
      },500)
    }
  },
  computed: {
    crumbs() {
      console.log('this.$route.path: ', this.$route.path);
      let pathArray = this.$route.path.split('/');
      console.log('let pathArray: ', pathArray);
      pathArray.shift();
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        try {
          breadcrumbArray.push({
            path: path,
            to: breadcrumbArray[idx - 1]
              ? '/' + breadcrumbArray[idx - 1].path + '/' + path
              : '/' + path,
            text: this.$route.matched[idx].name || path,
          });
        } catch (error) {
          breadcrumbArray.push({
            path: path,
            to: breadcrumbArray[idx - 1]
              ? '/' + breadcrumbArray[idx - 1].path + '/' + path
              : '/' + path,
            text: 'NA',
          });
        }
        return breadcrumbArray;
      }, []);
      return breadcrumbs;
    },
    currentRouteName: function () {
      return this.$route.name;
    }
  },
}
</script>
