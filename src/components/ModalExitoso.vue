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
                Operación exitosa
              </h5>
              <p>La operación fue realizada correctamente.</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-solicita"
                @click="goToOperacionConcertada">
                Aceptar
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
  name: 'ModalExitoso',
  props: ['open'],
  data() {
    return {

    };
  },
  methods: {
    goToOperacionConcertada() {
      this.$store.dispatch('updatePage', 'operacionConcertada');
    },
  },
};
</script>

<style scoped lang="scss">

</style>
