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
            <div class="modal-body d-flex flex-column">
              <div class="box-icon-check text-center">
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
                class="modal-title text-center">
                Disculpas las molestias
              </h5>
              <p>La plataforma se encuentra en mantenimiento.</p>
              <p>A partir de las 5pm nuestros servicios estarán reanudados. Te invitamos a intentar en este horario.</p>
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
  name: 'ModaHorario',
  props: ['open'],
  data() {
    return {

    };
  },
};
</script>

<style scoped lang="scss">
.modal-body {
    max-width: 500px;
    margin: 0 auto;
}
.modal-mask {
    z-index: 9999;
}
</style>
