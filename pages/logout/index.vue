<template>
    <div>

    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    created() {
        this.logOut();
    },
    methods : {
        async logOut() {
            await this.$auth.logout();
            // this.$cookies.remove('isMaintenance');
            // await this.$router.push('/login')
            setTimeout(() => {
                this.$router.push('/login')
            },500)
        }
    }
}
</script>