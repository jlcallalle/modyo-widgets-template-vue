<template>
  <div
    class="widget-operaciones-fx"
    :class="[solicitarPrecio == false ? 'widget-operaciones-fx' : 'widget-operacion-comprar-vender' ]">
    <h1
      class="mb-4 title-widget">
      Operaciones FX
    </h1>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-xl-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label
                    for="tipoOperacionlSelect"
                    class="title-group">Operación:</label>
                  <select
                    id="tipoOperacionlSelect"
                    :disabled="solicitarPrecio"
                    class="form-control">
                    <option value="fx-spot">
                      FX Spot
                    </option>
                    <option value="fx-forward">
                      FX Forward
                    </option>
                    <option value="fx-block-trade">
                      FX Block Trade
                    </option>
                    <option value="fx-swap">
                      FX Swap
                    </option>
                    <option value="limit-order">
                      Limit Order
                    </option>
                    <option value="market-order">
                      Market Order
                    </option>
                  </select>
                </div>
                <div
                  v-if="!solicitarPrecio || optionSelected !== 'Vender'"
                  class="box-rfs">
                  <span>RFS</span>
                </div>
                <div
                  v-if="!solicitarPrecio"
                  class="title-actions">
                  Selecciona una acción
                </div>
                <div
                  v-if="!solicitarPrecio"
                  class="box-btn">
                  <button
                    type="button"
                    class="btn btn-block btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Vender' }"
                    @click="clickOption('Vender')">
                    Vender {{ currencySelected }}
                  </button>
                </div>
                <div
                  v-if="solicitarPrecio && optionSelected === 'Vender'"
                  class="box-vender">
                  <div class="title-operacion">
                    Vender {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span>22.749</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="handleOpen">
                    Vender {{ currencySelected }}
                  </button>
                </div>
                <div
                  v-if="solicitarPrecio"
                  class="box-tiempo mt-4">
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
                      class="select-precio"
                      :disabled="solicitarPrecio"
                      @change="setCurrencySelected($event)">
                      <template v-for="(currency, index) in currenciesSelected">
                        <option
                          :id="index"
                          :key="index"
                          :selected="currencySelected === currency"
                          :value="currency">
                          {{ currency }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto <span class="hidden-xs"> en {{ labels[currencySelected] }} </span>
                    </div>
                    <currency-input
                      id="currencyInput"
                      class="form-control input-precio"
                      :value="monto"
                      :disabled="solicitarPrecio"
                      :options="{
                        currency: currencySelected,
                        currencyDisplay: 'narrowSymbol',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }"
                      @input="cambiarEstado()"
                      @change="monto = $event" />
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
                    class="form-control"
                    :disabled="solicitarPrecio"
                    :value="currencySelectedId"
                    @change="setCurrenciesOptions($event)">
                    <template v-for="(currency, index) in currenciesOptions">
                      <option
                        :id="index"
                        :key="index"
                        :value="currency.id">
                        {{ currency.firstValue }} \ {{ currency.secondValue }}
                      </option>
                    </template>
                  </select>
                </div>
                <div
                  v-if="!solicitarPrecio || solicitarPrecio && optionSelected === 'Vender'"
                  class="box-rfs">
                  <span>RFS</span>
                </div>
                <div
                  v-if="!solicitarPrecio"
                  class="title-actions invisible">
                  Selecciona una acción
                </div>
                <div
                  v-if="!solicitarPrecio"
                  class="box-btn">
                  <button
                    type="button"
                    class="btn btn-block btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Comprar' }"
                    @click="clickOption('Comprar')">
                    Comprar {{ currencySelected }}
                  </button>
                </div>
                <div
                  v-if="solicitarPrecio && optionSelected === 'Comprar'"
                  class="box-vender">
                  <div class="title-operacion">
                    Comprar {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span>22.749</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="handleOpen">
                    Comprar {{ currencySelected }}
                  </button>
                </div>
                <div
                  v-if="solicitarPrecio"
                  class="box-tiempo box-clear mt-4">
                  2
                </div>
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de Liquidación
                    </div>
                    <select
                      name="select"
                      :disabled="solicitarPrecio"
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
                      :disabled="solicitarPrecio"
                      type="date"
                      value="2022-01-10"
                      class="form-control input-fecha">
                  </div>
                </div>
              </div>
            </div>
            <div class="box-two-btn d-flex justify-content-around">
              <button
                type="button"
                class="btn btn-outline-primary btn-cancelar"
                @click="cancelClick()">
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isDisabled"
                class="btn btn-primary btn-solicita">
                {{ solicitarPrecio ? 'Modificar' : 'Solicitar Precio' }}
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
    <modal-error
      v-if="showModalError"
      :open="showModalError"
      @close="handleCloseError" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import RepositoryFactory from '../repositories/RepositoryFactory';
// const invexRepository = RepositoryFactory.get('invex');
import { VueEllipseProgress } from 'vue-ellipse-progress';
// eslint-disable-next-line
import CurrencyInput from './CurrencyInput.vue';
import Sidebar from './Sidebar.vue';
import ModalExitoso from './ModalExitoso.vue';
import ModalError from './ModalError.vue';

export default {
  name: 'OperacionesFx',
  components: {
    CurrencyInput, VueEllipseProgress, Sidebar, ModalExitoso, ModalError,
  },
  data() {
    return {
      progress: 100,
      timeLeft: '00:60',
      solicitarPrecio: false,
      optionSelected: 'Comprar',
      monto: 0,
      timmerId: null,
      currencySelected: 'USD',
      labels: {
        USD: 'Dolares',
        EUR: 'Euros',
        MXN: 'Pesos Mexicanos',
        JPY: 'Yenes',
      },
      currenciesOptions: [
        {
          id: '1',
          firstValue: 'USD',
          secondValue: 'MXN',
        },
        {
          id: '2',
          firstValue: 'EUR',
          secondValue: 'USD',
        },
        {
          id: '3',
          firstValue: 'EUR',
          secondValue: 'MXN',
        },
        {
          id: '4',
          firstValue: 'USD',
          secondValue: 'JPY',
        },
      ],
      currenciesSelected: ['USD', 'MXN'],
      currencySelectedId: '1',
      showModal: false,
      showModalError: false,
      isDisabled: true,
    };
  },
  computed: {
    ...mapState(['currentView']),
  },
  mounted() {
    this.setCurrency('4');
  },
  async created() {
    const responseApiServicio = await this.$store.dispatch('updateServicio');
    if (responseApiServicio.status === 200 || responseApiServicio.status === 201) {
      console.log('servicio ok');
    } else {
      console.log('servicio error');
      this.showModalError = true;
    }
  },
  methods: {
    async onSubmit() {
      if (this.solicitarPrecio) {
        this.solicitarPrecio = false;
        clearInterval(this.timmerId);
      } else {
        const getHours = new Date().getHours();
        if (getHours >= 9 && getHours < 18) {
          if (getHours === 16) {
            alert('Servicio temporalmente fuera de servicio, intentar a las 5pm por favor');
          } else {
            // alert('Aceptado');
          }
        } else {
          alert('Fuera de horario');
        }
        this.solicitarPrecio = true;
        this.startTimer();
      }
    },
    setMonto(ev) {
      this.monto = ev;
    },
    setCurrenciesOptions(ev) {
      const auxSelected = this.currenciesOptions.find((currency) => currency.id === ev.target.value);
      if (auxSelected) {
        this.currencySelectedId = ev.target.value;
        this.currenciesSelected = [auxSelected.firstValue, auxSelected.secondValue];
        this.currencySelected = auxSelected.firstValue;
      }
    },
    setCurrencySelected(ev) {
      this.currencySelected = ev.target.value;
    },
    setCurrency(id) {
      const findId = this.currenciesOptions.find((currency) => currency.id === id);
      if (findId) {
        this.currencySelectedId = id;
        this.setCurrenciesOptions({ target: { value: id } });
      }
    },
    clickOption(txt) {
      if (this.solicitarPrecio) {
        // Se tiene que redireccionar
      } else {
        this.optionSelected = txt;
      }
    },
    startTimer() {
      let sec = 60;
      this.progress = 100;
      this.timeLeft = '00:60';
      const timer = setInterval(() => {
        this.timeLeft = `00:${sec < 10 ? '0' : ''}${sec}`;
        let progressAux = sec * 100;
        progressAux /= 60;
        this.progress = progressAux;
        sec -= 1;
        if (sec < 0) {
          clearInterval(timer);
          if (this.solicitarPrecio) {
            this.solicitarPrecio = false;
          }
        }
      }, 1000);
      this.timmerId = timer;
    },
    cancelClick() {
      if (this.solicitarPrecio) {
        this.progress = 100;
        this.timeLeft = '00:60';
        this.setCurrency('4');
        this.optionSelected = 'Comprar';
        this.monto = '0';
        this.solicitarPrecio = false;
        clearInterval(this.timmerId);
      }
    },
    handleOpen() {
      this.showModal = true;
    },
    handleClose() {
      this.showModal = false;
    },
    handleOpenError() {
      this.showModalError = true;
    },
    handleCloseError() {
      this.showModalError = false;
    },
    cambiarEstado() {
      if (this.monto === 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$brand-invex: #A41D36;
.btn-outline-operacion {
  &.active {
    border-color: $brand-invex;
    color:white;
    background-color: $brand-invex;
    &:hover {
          color: rgba(255, 255, 255, 1);
          background-color: $brand-invex;
          border-color: $brand-invex;
      }
  }
}
</style>
