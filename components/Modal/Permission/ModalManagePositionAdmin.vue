<template>
    <div>
        <div
        id="modal-manage-admin-position"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header text-xl">
                        <b>จัดการตำแหน่ง</b>
                    </div>
                    <!-- <pre>{{dataAdminUsePosition}}</pre> -->
                <div class="modal-body p-8 w-1/3">
                    <label for=""><b>ตำแหน่ง</b></label>
                    <select v-model="position" name="position_admin" id="position_admin" class="form-select">
                        <option value="">ตำแหน่ง</option>
                        <option v-for="(position,index) in ddPosition" :key="index" :value="position.id">
                            {{position.name}}
                        </option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">
                        ยกเลิก
                    </button>
                    <button class="btn btn bg-blue-500 text-white" @click="modalConfirmManagemanagePositionAdmin()">บันทึก</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['ddPosition','dataAdminUsePosition'],
    data() {
        return {
            position : ''
        }
    },
    watch : {
        dataAdminUsePosition : 'setPositionAdmin'
    },
    methods : {
        setPositionAdmin(data) {
            // console.log(data);
            this.position = data.admin_position ? data.admin_position.id : ''
        },

        modalConfirmManagemanagePositionAdmin() {
            this.$emit('modalConfirmManagemanagePositionAdmin',this.position)
        }
    }
}
</script>