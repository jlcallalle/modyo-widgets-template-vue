<template>
  <div class="widget-operacion-vender">
    <h1 class="mb-4 title-widget">
      Operaciones FX
    </h1>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-lg-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label
                    for="tipoOperacionlSelect"
                    class="title-group">Operación:</label>
                  <select
                    id="tipoOperacionlSelect"
                    class="form-control">
                    <option value="fx-spot">
                      FX Spot
                    </option>
                    <option value="USD">
                      FX Forward
                    </option>
                    <option value="USD">
                      FX Block Trade
                    </option>
                    <option value="USD">
                      FX Swap
                    </option>
                    <option value="USD">
                      Limit
                    </option>
                    <option value="USD">
                      Market
                    </option>
                  </select>
                </div>
                <div class="box-vender">
                  <div class="title-operacion">
                    Comprar USD
                  </div>
                  <div class="box-precio">
                    <span>22.749</span>
                  </div>
                  <a
                    href=""
                    class="btn btn-block btn-operacion">Vender USD</a>
                </div>
                <div class="box-tiempo mt-4">
                  <div class="title-tiempo">
                    Tiempo restante para completar tu operación:
                  </div>
                  <div class="box-timer">
                    <vue-ellipse-progress
                      color="#A41D36"
                      :size="90"
                      :progress="progress">
                      <span>{{ timeLeft }}</span>
                    </vue-ellipse-progress>
                  </div>
                </div>
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio">
                      <option value="USD">
                        USD
                      </option>
                      <option
                        value="MXN"
                        selected>
                        MXN
                      </option>
                      <option value="EUR">
                        EUR
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto en dólares
                    </div>
                    <input
                      type="text"
                      class="form-control input-precio">
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 mt-5 mt-md-0">
                <div class="form-group">
                  <label
                    for="tipoDivisasSelect"
                    class="title-group">Par de divisas:</label>
                  <select
                    id="tipoDivisasSelect"
                    class="form-control">
                    <option>USD / MXN</option>
                    <option>MXN / USD</option>
                  </select>
                </div>
                <div class="box-rfs">
                  <span>RFS</span>
                </div>
                <div class="box-tiempo box-clear mt-4">
                  2
                </div>
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de Liquidación
                    </div>
                    <select
                      name="select"
                      class="select-fecha">
                      <option
                        value="Today"
                        selected>
                        Today
                      </option>
                      <option value="Tomorrow">
                        Tomorrow
                      </option>
                      <option value="SpotNext">
                        SpotNext
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <input
                      type="date"
                      value="2022-01-10"
                      class="form-control input-fecha">
                  </div>
                </div>
              </div>
            </div>
            <div class="box-two-btn d-flex justify-content-around">
              <button
                class="btn btn-outline-primary btn-cancelar"
                @click="goBackUrl();">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-solicita"
                data-toggle="modal"
                data-target="#modalExitoso"
                @click.prevent="handleOpen">
                Modificar
              </button>
            </div>
          </form>
        </div>
        <sidebar />
      </div>
    </div>
    <modal-exitoso
      v-if="showModal"
      :open="showModal"
      @close="handleClose" />
    <modal-tiempo
      v-if="showModalTiempo"
      :open="showModalTiempo"
      @close="handleCloseTiempo" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueEllipseProgress } from 'vue-ellipse-progress';
import ModalExitoso from './ModalExitoso.vue';
import ModalTiempo from './ModaTiempo.vue';
import Sidebar from './Sidebar.vue';

export default {
  name: 'OperacionVender',
  components: {
    VueEllipseProgress, ModalExitoso, ModalTiempo, Sidebar,
  },
  data() {
    return {
      progress: 100,
      timeLeft: '00:60',
      showModal: false,
      showModalTiempo: false,
    };
  },
  computed: {
    ...mapState(['currentView']),
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    goBackUrl() {
      this.$store.dispatch('updatePage', 'operacionesFx');
    },
    startTimer() {
      let sec = 60;
      const timer = setInterval(() => {
        this.timeLeft = `00:${sec < 10 ? '0' : ''}${sec}`;
        let progressAux = sec * 100;
        progressAux /= 60;
        this.progress = progressAux;
        sec -= 1;
        if (sec < 0) {
          clearInterval(timer);
          this.goBackUrl();
        }
      }, 1000);
    },
    handleOpen() {
      this.showModal = true;
    },
    handleClose() {
      this.showModal = false;
    },
    handleOpenTiempo() {
      this.showModalTiempo = true;
    },
    handleCloseTiempo() {
      this.showModalTiempo = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
