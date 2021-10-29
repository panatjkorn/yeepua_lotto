<template>
    <div>
        <!-- modal ดู slip -->
        <div
        id="modal-show-slip-withdraw"
        class="modal"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body p-0 flex justify-center">
                    <img class="max-h-screen" :src="slipImageWithdraw" alt="image slip">
                </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['slipImageWithdraw'],
}
</script>