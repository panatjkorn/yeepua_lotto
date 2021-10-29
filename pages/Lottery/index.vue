<template>
  <div>
    <div class="col-span-12 mt-8">
      <div class="intro-y flex items-center h-10">
        <div>
          <span class="lg:text-lg"><b>รายการหวย</b></span>
        </div>
      </div>
    </div>
    <div class="col-span-12 mt-2">
      <div class="box p-5 relative overflow-y-hidden">
        <div class="py-3">
          <client-only>
            <table class="table">
              <thead>
                <tr>
                  <th v-for="(col,index) in tbLottery.columns" :key="index" class="border-b-2 dark:border-dark-5 whitespace-nowrap">
                      <b>{{ col.label }}</b>
                  </th>
                </tr>
              </thead>
              <tbody v-if="tbLottery.rows.length > 0">
                  <tr v-for="(data,index) in tbLottery.rows" :key="index" :class="{'bg-gray-200 dark:bg-dark-1' : index%2 == 0}">
                      <td>{{ index+1 }}</td>
                      <td><img :src="data ? data.image_url : ''" alt="" class="w-14 h-14"></td>
                      <td>{{ data ? data.name : '' }}</td>
                      <td>{{ data ? data.default_open_time : '' }}</td>
                      <td>{{ data ? data.default_close_time : '' }}</td>
                      <!-- <td>{{ convertTime(data.default_open_time) }}</td>
                      <td>{{ convertTime(data.default_close_time) }}</td> -->
                      <td>
                        <button class="btn bg-yellow-400 w-24 mr-1 mb-2" @click="editTypeLottery(data.id)">แก้ไข</button>
                        <button class="btn bg-blue-500 text-white w-auto mr-1 mb-2" @click="manageLottery(data.id)">จัดการงวดแทงหวย</button>
                      </td>
                  </tr>
              </tbody>
            </table>
          </client-only>

        </div>
      </div>
      <client-only>
        <!-- แก้ไข type lottery -->
        <ModalEditGroupLottery :data-edit="dataEditByID" @editLottoType="modalConfirmEdit" />
        <ModalConfirm
          :HeaderMassage="'ยืนยันแก้ไข'"
          @submitConfirmModal="editTypeLotto"
          @cancelModal="cancleConfirm"
        />
      </client-only>
    </div>
  </div>
</template>
<script>
import ModalEditGroupLottery from '@/components/Modal/Lottery/ModalEditGroupLottery'; //modal แก้ไข type lottery
import ModalConfirm from '@/components/Modal/ModalConfirm';
import moment from 'moment'
import alertMixins from '~/mixins/alertMixin'
export default {
  layout: 'dashboard',
  components : { ModalEditGroupLottery,ModalConfirm },
  mixins : [ alertMixins ],
  middleware : ['permission'],
  data() {
    return {
      tbLottery: {
        page: 1,
        columns: [
          { label: "#"},
          { label: "รูป"},
          { label: "ชื่อหวย"},
          { label: "เวลาเปิดรับแทง"},
          { label: "เวลาปิดรับแทง"},
          { label: "ตัวเลือก"},
        ],
        rows: [],
      },
      modalConfirmType : '',
      dataEditLottoGroup : '',
      dataEditByID : ''
    }
  },
  mounted() {
    this.getDataLotteryType();
  },
  methods : {
    convertTime(datetime) {
      return datetime ? moment(datetime).format("YYYY-MM-DD HH:mm") : ''
    },
    async getDataLotteryType() {
      // this.tbLottery.rows = [];
      const url = 'admin_manage_lotto/'
      try {
        const res = await this.$axios.get(url);
        // console.log('res',res.data.data);
        // for(let i = 0; i < res.data.data.length; i++) {
        //   this.tbLottery.rows.push(res.data.data[i]);
        // }
        this.tbLottery.rows = await res.data.data;
        const dataSplice = this.tbLottery.rows.splice(3,1);
        this.tbLottery.rows.splice(1,0,dataSplice[0]);
      } catch(err) {
        console.log(err);
      }
    },
    async editTypeLottery(id) {
      this.modalConfirmType = 'editTypeLotto'
      const url = `admin_manage_lotto/${id}`
      try {
        const getDataLottoTypeByID = await this.$axios.get(url);
        if(getDataLottoTypeByID.status == 200) {
          this.dataEditByID = getDataLottoTypeByID.data.data;
        }
        this.$cash('#modal-edit-type-lottery').modal('show');
      } catch(err) {
        console.log(err);
      }


    },
    manageLottery(id) {
      this.$router.push(`Lottery/ManageLottery/${id}`)
    },
    modalConfirmEdit(value) {
      this.dataEditLottoGroup = value;
      if(this.modalConfirmType == 'editTypeLotto') {
        this.$cash('#modal-edit-type-lottery').modal('hide');
        this.$cash('#modal-confirm').modal('show');
      }
    },
    //แก้ไข type lottery
    async editTypeLotto() {
      this.$cash('#modal-confirm').modal('hide');
      const loader = this.$loading.show({});
      const url = `admin_manage_lotto/${this.dataEditLottoGroup.id}`
      let formData = new FormData();
      // console.log('dataEditLottoGroup',this.dataEditLottoGroup);
      formData.append('name', this.dataEditLottoGroup ? this.dataEditLottoGroup.lotto_group_name : '');
      formData.append('default_open_time', this.dataEditLottoGroup ? this.dataEditLottoGroup.open_time : '');
      formData.append('default_close_time', this.dataEditLottoGroup ? this.dataEditLottoGroup.closing_time : '');
      formData.append('image', this.dataEditLottoGroup ? this.dataEditLottoGroup.image : '');

      try {
        const editLottoType = await this.$axios.put(url,formData);
        // console.log('editLottoType',editLottoType);
        if(editLottoType.status == 200) {
          this.getDataLotteryType();
          this.$cash('#modal-confirm').modal('hide');
          this.successAlertWord(editLottoType.data.message);
        }
        loader.hide()
      } catch(err) {
        loader.hide()
        console.log(err);
        if(err.response.status == 400) {
          this.errorAlertStatusCode(err.response.data.errors);
        } else {
          this.errorAlertStatusCode(err);
        }
      }
    },
    cancleConfirm() {
      this.dataEditLottoGroup = '';
      this.$cash('#modal-confirm').modal('hide');
    }
  }
}
</script>
