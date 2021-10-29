<template>
    <div>
        <client-only>
            <table class="table mt-5 mb-5">
                <thead>
                  <tr>
                    <th v-for="(col,index) in tbPermission.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                      <b>{{ col.label }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="tbPermission.rows.length > 0">
                  <tr v-for="(data,index) in tbPermission.rows" :key="index">
                    <td>{{ index+1 }}</td>
                    <td>{{ data.permission_name }}</td>
                    <td>
                      <p
                        :class="{
                          'text-green-500' : data.permission_status == true,
                          'text-red-500' : data.permission_status != true,
                        }" 
                        >{{ data.permission_status == true ? 'เปิดใช้งาน' : 'ปิดการใช้งาน' }}</p>
                    </td>
                    <!-- <td>
                      <button class="btn bg-blue-500 text-white" @click="modalEditPermission(data)">แก้ไข</button>
                    </td> -->
                  </tr>
                </tbody>
            </table>
        </client-only>
    </div>
</template>
<script>
export default {
    props : ['dataPermission'],
    data() {
        return {
            tbPermission: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "สิทธิ์การใช้งานระบบ"},
                    { label: "สถานะ"},
                    // { label: "ตัวเลือก"},
                ],
                rows: [],
            },
        }
    },
    watch : {
        dataPermission : 'setDataPermission'
    },
    methods : {
        setDataPermission(data) {
            // console.log(data);
            if(data) {
                this.tbPermission.rows = data.map((item) => {
                    // console.log(item);
                    return {
                      permission_name : item ? item.detail : '',
                      permission_id : item ? item.id : '',
                      permission_status : item ? item.status : ''
                        // permission_name : item.admin ? item.admin.name_profile : '',

                    }
                })
            }
            
        },
        modalEditPermission(data) {
          // console.log(data.permission_id);
          this.$emit('modalEditPermission',data.permission_id);
        }
    }
}
</script>