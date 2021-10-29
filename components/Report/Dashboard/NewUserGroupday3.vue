<template>
    <div class="mt-5">
        <p><b>กราฟแสดงจำนวน user ย้อนหลัง 30 วัน</b></p>
        <!-- style="max-height:450px;" -->
        <div>
            <MyLine 
                :style="myStyles"
                :chartData="chartData"
            />
        </div>
    </div>
</template>
<script>
export default {
    props : ['chartData'],
    data() {
        return {
            // height: 550,
            // width : 300
        }
    },
    computed: {
        myStyles () {
            return {
                height: `${this.height}px`,
                width: `${this.height}px`,
                // position: 'relative',
                overflow : 'auto'
            }
        }
    }
}
</script>
