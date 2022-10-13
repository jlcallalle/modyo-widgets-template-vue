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
                <svg
                  v-if="type === 'error'"
                  width="60"
                  height="54"
                  viewBox="0 0 60 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 26.6667C0 34.0333 3.03333 40.6667 7.86667 45.4667L0 53.3333H20V33.3333L12.5333 40.8C8.93333 37.1667 6.66667 32.2 6.66667 26.6667C6.66667 17.9667 12.2333 10.5667 20 7.83333V0.866667C8.5 3.83333 0 14.2333 0 26.6667ZM26.6667 43.3333H33.3333V36.6667H26.6667V43.3333ZM60 0H40V20L47.4667 12.5333C51.0667 16.1667 53.3333 21.1333 53.3333 26.6667C53.3333 35.3667 47.7667 42.7667 40 45.5V52.4667C51.5 49.5 60 39.1 60 26.6667C60 19.3 56.9667 12.6667 52.1333 7.86667L60 0ZM26.6667 30H33.3333V10H26.6667V30Z"
                    fill="#ED002F" />
                </svg>
              </div>
              <h5
                class="modal-title">
                {{ title }}
              </h5>
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer justify-content-center">
              <span v-show="!btnCloseHide">
                <button
                  type="button"
                  class="btn btn-close-white"
                  @click="btnCloseFunc">
                  {{ btnCloseText }}
                </button>
              </span>
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
    btnCloseHide: {
      type: Boolean,
      default: false,
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
