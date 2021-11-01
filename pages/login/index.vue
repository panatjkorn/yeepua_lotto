<template>
  <div>
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <span class="text-white text-lg ml-3">
              Blue<span class="font-medium">Swan.</span>
            </span>
          <!-- <a href="" class="-intro-x flex items-center pt-5">
            <img
              alt="Icewall Tailwind HTML Admin Template"
              class="w-6"
              :src="require(`@/assets/images/logo.svg`)"
            />
            <span class="text-white text-lg ml-3">
              Ru<span class="font-medium">bick.</span>
            </span>
          </a> -->
          <div class="my-auto">
            <!-- <img
              alt="Icewall Tailwind HTML Admin Template"
              class="-intro-x w-1/2 -mt-16"
              :src="require(`@/assets/images/illustration.svg`)"
            /> -->
            <div
              class="-intro-x text-white font-medium text-4xl leading-tight mt-10 grid"
            >
            <img class="justify-self-center" :src="require(`@/assets/images/blueswan.png`)" alt="">
              <span class="flex justify-center">ยี่ปั๊ว</span> <br />
              <!-- sign in to your account. -->
            </div>
            <div
              class="-intro-x text-lg text-white text-opacity-70 dark:text-gray-500 flex justify-center"
            >
              โปรแกรมการจัดการยี่ปั๊ว
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2
              class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
            >
              เข้าสู่ระบบ
            </h2>
            <!-- <div class="intro-x mt-2 text-gray-500 xl:hidden text-center">
              A few more clicks to sign in to your account. Manage all your
              e-commerce accounts in one place
            </div> -->
            <div class="intro-x mt-8">
              <input
                v-model="username"
                type="text"
                class="intro-x login__input form-control py-3 px-4 border-gray-300 block"
                placeholder="Username"
              />
              <input
                v-model="password"
                type="password"
                class="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4"
                placeholder="paasword"
              />
            </div>
            <!-- <div
              class="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4"
            >
              <div class="flex items-center mr-auto">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="form-check-input border mr-2"
                />
                <label class="cursor-pointer select-none" for="remember-me"
                  >Remember me</label
                >
              </div>
              <a href="">Forgot Password?</a>
            </div> -->
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left w-auto lg:w-72">
              <button
                class="btn py-3 px-4 w-full xl:w-32 xl:mr-3 align-top text-white" style="background:#2F2F2F;"
                @click="onLogin()"
              >
                เข้าสู่ระบบ
              </button>
              <!-- <button
                class="btn py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top text-white"
              >
                Sign up
              </button> -->
            </div>
            <!-- <div
              class="intro-x mt-10 xl:mt-24 text-gray-700 dark:text-gray-600 text-center xl:text-left"
            >
              By signin up, you agree to our <br />
              <a class="text-theme-17 dark:text-gray-300" href=""
                >Terms and Conditions</a
              >
              &
              <a class="text-theme-17 dark:text-gray-300" href=""
                >Privacy Policy</a
              >
            </div> -->
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      username : null,
      password : null
    }
  },
  created() {

  },
  methods : {
    async onLogin() {
      const body = {
        username: this.username,
        password: this.password,
      };

      // await this.$auth
      //   .loginWith('local', { data: params })
      //   .then(async (res) => {
      //     if (res) {
      //       console.log('res: ', res);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log('error: ', error.response);
      //     // const errorMsg = error.response.data.error_message
      //     // console.log('errorMsg: ', errorMsg);
      //     // this.$swal.fire(`${errorMsg}`,'','error')
      //   })



      await this.$auth.loginWith('local', { data: body }).then(async (res) => {
        // console.log('resss',res.data);
        if(res) {
          await this.checkPermission(res.data.accessToken);
        }
        // this.checkPermission(res.data.accessToken);
      }).catch(async (err) => {
        if(err.response.status == 401 || err.response.status == 400 || err.response.status == 403) {
          this.$toast.error(err.response.data.errors);
        } else {
          this.$toast.error(err);
        }
      })
      // try {
      //   const body = {
      //     username: this.username,
      //     password: this.password,
      //   };

      //   await this.$auth.loginWith('local', { data: body });
      // } catch (error) {
      //   console.log('xxxxxxxxxx',error.response);
      // }
    },
    async checkPermission(token) {
      await this.$store.dispatch('menu/setMenu', true)
      let page = null;
      if(this.$store.state.menu.menu[0].isHaveSubmenu == true) {
        page = await this.$store.state.menu.menu[0].subMenu[0].path
      } else {
        page = await this.$store.state.menu.menu[0].path
      }
      
      this.$router.push(page);
    },

    // async getMaintenance() {
    //   const url = 'admin/maintenance'

    //   try {
    //     const getMaintenance = await this.$axios.get(url);
    //     this.$cookies.set('isMaintenance',getMaintenance.data.data.status)
    //     // console.log('getMaintenance',getMaintenance);
    //     // await this.$store.dispatch('maintenance/setMaintenance', getMaintenance.data.data.status)
    //   } catch(err) {
    //     console.log(err);
    //   }
    // }
  }
}
</script>
