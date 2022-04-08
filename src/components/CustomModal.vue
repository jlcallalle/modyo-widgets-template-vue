<template>
  <transition
    name="fade">
    <div
      :class="open ? 'modal-mask' : ''">
      <div
        class="modal-wrapper"
        :class="open ? 'slide': ''">
        <div
          class="modal-dialog modal-dialog-centered"
          role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="$emit('close')">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body d-flex flex-column text-center">
              <div class="box-icon-check">
                <svg
                  v-if="type === 'warning'"
                  width="70"
                  height="60"
                  viewBox="0 0 70 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.263184 60H69.7369L35 0L0.263184 60ZM38.1579 50.5263H31.8421V44.2105H38.1579V50.5263ZM38.1579 37.8947H31.8421V25.2632H38.1579V37.8947Z"
                    fill="#B98C00" />
                </svg>
                <svg
                  v-if="type === 'confirm'"
                  width="54"
                  height="53"
                  viewBox="0 0 54 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M27 0.25C12.51 0.25 0.75 12.01 0.75 26.5C0.75 40.99 12.51 52.75 27 52.75C41.49 52.75 53.25 40.99 53.25 26.5C53.25 12.01 41.49 0.25 27 0.25ZM21.75 39.625L8.625 26.5L12.3263 22.7987L21.75 32.1963L41.6738 12.2725L45.375 16L21.75 39.625Z"
                    fill="#269926" />
                </svg>
              </div>
              <h5
                class="modal-title">
                {{ title }}
              </h5>
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-close-white"
                @click="btnCloseFunc">
                {{ btnCloseText }}
              </button>
              <button
                type="button"
                class="btn btn-solicita"
                @click="btnAcceptFunc">
                {{ btnAcceptText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CustomModal',
  props: {
    open: Boolean,
    type: {
      type: String,
      default: 'warning',
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    btnAcceptText: {
      type: String,
      default: 'Aceptar',
    },
    btnCloseText: {
      type: String,
      default: 'Cerrar',
    },
    btnAcceptFunc: {
      type: Function,
      default: () => {},
    },
    btnCloseFunc: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {

    };
  },
};
</script>

<style scoped lang="scss">

</style>
