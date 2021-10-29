<template>
    <div>
        <client-only>
            <!-- <pre>{{adminUsePermission}}</pre> -->
            <table class="table mt-5 mb-5">
                <thead>
                  <tr>
                    <th v-for="(col,index) in tbAdminPermission.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                      <b>{{ col.label }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="tbAdminPermission.rows.length > 0">
                  <tr v-for="(data,index) in tbAdminPermission.rows" :key="index">
                    <td>{{ index+1 }}</td>
                    <td>{{ data.admin }}</td>
                    <td>{{ data.admin_position }}</td>
                    <td
                      :class="{'text-green-500' : data.admin_status == true, 'text-red-500' : data.admin_status == false}"
                    >
                        <span>{{data.admin_status == true ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}}</span>
                    </td>
                    <td>
                      <MazSwitch v-model="tbAdminPermission.rows[index].admin_status" color="secondary" class="mt-2" 
                          @input="confirmBanAdmin(tbAdminPermission.rows[index])"/>
                    </td>
                    <td>
                      <button class="btn bg-blue-500 text-white" @click="modalManagePermission(data)">จัดการสิทธิ์การใช้งาน</button>
                      <button class="btn bg-green-500 text-white" @click="modalManagePosition(data)">จัดการตำแหน่ง</button>
                      <!-- <button class="btn bg-yellow-500 text-white" @click="modalChangePassword(data)">เปลี่ยนรหัสผ่าน</button> -->
                    </td>
                  </tr>
                </tbody>
            </table>
        </client-only>
    </div>
</template>
<script>
export default {
    props : ['adminUsePermission'],
    data() {
        return {
            tbAdminPermission: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "ผู้ดูแลระบบ"},
                    { label: "ตำแหน่ง"},
                    { label: "สถานะการใช้งาน"},
                    { label: "จัดการสถานะการใช้งาน"},
                    { label: "ตัวเลือก"},
                ],
                rows: [],
            },
        }
    },
    watch : {
        adminUsePermission : 'setDataAdminUsePermission'
    },
    methods : {
        setDataAdminUsePermission(data) {
            // console.log(data);
            this.tbAdminPermission.rows = data.admins.map((item) => {
                // console.log(item);
                return {
                  admin : item ? item.name_profile : '',
                  admin_id : item ? item.id : '',
                  admin_position : item.admin_position ? item.admin_position.name : '',
                  admin_status : item ? item.status : false
                }
            })
        },
        modalManagePermission(data) {
          this.$emit('ManagePermissionAdmin',data)
        },

        modalManagePosition(data) {
          this.$emit('modalManagePositionAdmin',data)
        },

        modalChangePassword(data) {
          this.$emit('modalChangePassword',data)
        },

        confirmBanAdmin(data) {
          this.$emit('banAdmin',data);
        }
    }
}
</script>