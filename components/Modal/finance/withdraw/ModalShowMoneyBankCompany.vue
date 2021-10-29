<template>
    <div>
        <div
        id="modal-show-money-bank-company"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
        data-backdrop="static"
      >
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-body p-8 text-center">
                        <div class="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                            class="feather feather-check-circle block mx-auto block mx-auto h-16 w-16 text-green-500">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        </div>
                        <h2 class="text-2xl maz-text-bold">โอนเงินสำเร็จ</h2>
                        <p class="mt-3 mb-2 text-lg"><b>บัญชี {{dataBalance ? dataBalance.bank_account_name : ''}}</b></p>
                        <p class="mt-3 mb-2 text-lg"><b>[ {{ dataBalance ? 
                            dataBalance.bank_name : ''}} {{dataBalance ? dataBalance.bank_account_number : ''}} ]</b></p>
                        <p class="mt-3 text-lg"><b>คงเหลือ {{dataBalance ? dataBalance.balance : ''}} บาท</b></p>

                    </div>
                    <div class="modal-footer text-center">
                        <button class="btn btn-secondary w-24 mr-1 mb-2" data-dismiss="modal">ปิด</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['dataBalance'],
    data() {
        return {

        }
    },
}
</script>