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
                  width="70"
                  height="60"
                  viewBox="0 0 70 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.263184 60H69.7369L35 0L0.263184 60ZM38.1579 50.5263H31.8421V44.2105H38.1579V50.5263ZM38.1579 37.8947H31.8421V25.2632H38.1579V37.8947Z"
                    fill="#ED002F" />
                </svg>
              </div>
              <h5
                class="modal-title">
                Error
              </h5>
              <p>Por el momento no es posible realizar la operación solicitada.</p>
              <p>Por favor inténtalo más tarde.</p>
            </div>
            <div class="modal-footer justify-content-center">
              <button
                type="button"
                class="btn btn-solicita"
                @click="$emit('close')">
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
  name: 'ModalError',
  props: ['open'],
  data() {
    return {

    };
  },
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
