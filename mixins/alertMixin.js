export default {
  methods: {
    successAlert() {
      this.$swal({
        icon: "success",
        text: "บันทึกสำเร็จ",
        showConfirmButton: false,
        timer: 1500
      });
    },
    successAlertWord(word) {
      this.$swal({
        icon: "success",
        text: word,
        showConfirmButton: false,
        timer: 1500
      });
    },
    errorAlert() {
      this.$swal({
        icon: "error",
        text: "ผิดพลาด",
        showConfirmButton: false,
        location: "/",
        timer: 1500
      });
    },
    errorAlertStatusCode(word) {
      this.$swal({
        icon: "error",
        text: word,
        showConfirmButton: false,
        location: "/",
        timer: 1500
      });
    },
  }
}
