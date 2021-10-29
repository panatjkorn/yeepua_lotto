<template>
    <div>
        <client-only>
            <table class="table mt-5 mb-5">
                <thead>
                  <tr>
                    <th v-for="(col,index) in tbPosition.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap" :class="col.color">
                      <b>{{ col.label }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="tbPosition.rows.length > 0">
                  <tr v-for="(data,index) in tbPosition.rows" :key="index">
                    <td>{{ index+1 }}</td>
                    <td>{{ data.position_name }}</td>
                    <td>
                      <button class="btn bg-yellow-500 text-white" @click="modalEditPosition(data)">แก้ไข</button>
                    </td>
                  </tr>
                </tbody>
            </table>
        </client-only>
    </div>
</template>
<script>
export default {
    props : ['dataPosition'],
    data() {
        return {
            tbPosition: {
                page: 1,
                columns: [
                    { label: "#"},
                    { label: "ตำแหน่ง"},
                    // { label: "สถานะ"},
                    { label: "ตัวเลือก"},
                ],
                rows: [],
            },
        }
    },
    watch : {
        dataPosition : 'setDataPosition'
    },
    methods : {
        setDataPosition(data) {
            // console.log('data',data);
            this.tbPosition.rows = data.positions.map((item) => {
                // console.log(item);
                return {
                    id : item ? item.id : '',
                    position_name : item ? item.name : ''
                }
            })
        },

        modalEditPosition(data) {
            this.$emit('modalEditPosition',data.id)
        }
    }
}
</script>