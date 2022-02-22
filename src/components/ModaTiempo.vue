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
                  width="64"
                  height="63"
                  viewBox="0 0 64 63"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M58.25 26.25V47.25H53V26.25H58.25ZM53 52.5V57.75H58.25V52.5H53ZM47.75 45.3863C43.8912 49.7438 38.2738 52.5 32 52.5C20.4238 52.5 11 43.0762 11 31.5C11 19.9238 20.4238 10.5 32 10.5V34.125L51.8187 14.3062C47.015 8.7675 39.9275 5.25 32 5.25C17.51 5.25 5.75 17.01 5.75 31.5C5.75 45.99 17.51 57.75 32 57.75C37.9062 57.75 43.3663 55.8075 47.75 52.5V45.3863Z"
                    fill="#BA8D06" />
                </svg>
              </div>
              <h5
                class="modal-title">
                Tiempo Concurrido
              </h5>
              <p>El tiempo  de la operación finalizó.</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-solicita">
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
  name: 'ModalTiempo',
  props: ['open'],
};
</script>

<style scoped lang="scss">
.modal-wrapper {
  height: 100%;
  .modal-dialog {
    max-width: 650px;
    margin: auto;
    transform: translate3d(0%, 0, 0);
    transition: all 0.3s linear, right 0.3s ease-out;
  }
}

.modal-header {
    border-bottom: none;
    padding: 1rem 1rem 0 1rem;
}
.modal-title {
    color: #424242;
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    text-align: center;
    margin:1.5rem 0 2rem 0;
}
.modal-footer {
    border-top: none;
    padding-bottom: 2.5rem;
}
.modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    background-color: rgba(0, 0, 0, .5);
    display: block;
    transition: all .3s ease;
}
button.close {
  display: flex;
  align-items: center;
  opacity: 1;
  font-weight: normal;
  font-size: 30px;
  &:focus {
    outline: none;
  }
}
</style>
