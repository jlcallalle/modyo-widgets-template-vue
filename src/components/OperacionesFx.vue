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
                    class="form-control"
                    :disabled="solicitarPrecio"
                    @change="setOperation($event)">
                    <template v-for="(operation, index) in operationsOptions">
                      <option
                        :id="index"
                        :key="index"
                        :selected="operationsSelected === operation.product_code"
                        :value="operation.product_code">
                        {{ operation.product_description }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="col-12 col-md-6">
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
                        :value="index">
                        {{ currency.ccy1 }} \ {{ currency.ccy2 }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio || optionSelected !== 'Vender'"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && optionSelected === 'Vender'"
                  class="box-vender">
                  <div class="title-operacion">
                    Vender {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span>{{ currencyValue }} {{ valueComparation }}</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="handleOpen">
                    Vender {{ currencySelected }}
                  </button>
                </div>
              </div>
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio || solicitarPrecio && optionSelected === 'Vender'"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && optionSelected === 'Comprar'"
                  class="box-vender">
                  <div class="title-operacion">
                    Comprar {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span>{{ currencyValue }} {{ valueComparation }}</span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="handleOpen">
                    Comprar {{ currencySelected }}
                  </button>
                </div>
              </div>
            </div>
            <div
              class="row">
              <div class="col-12">
                <div
                  v-if="!solicitarPrecio"
                  class="title-actions">
                  Selecciona una acción
                </div>

                <div
                  class="box-btn-operacion">
                  <button
                    v-if="!solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Vender' }"
                    @click="clickOption('Vender')">
                    Vender {{ currencySelected }}
                  </button>

                  <button
                    v-if="!solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Comprar' }"
                    @click="clickOption('Comprar')">
                    Comprar {{ currencySelected }}
                  </button>
                </div>

                <div
                  v-if="solicitarPrecio"
                  class="box-tiempo">
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
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-6">
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
                      Monto <span class="hidden-xs"> en {{ currencySelected }} </span>
                    </div>
                    <currency-input
                      id="currencyInput"
                      class="form-control input-precio"
                      :value="monto"
                      :disabled="solicitarPrecio"
                      :options="{
                        // eslint-disable-next-line no-irregular-whitespace
                        currency: currencySelected || 'USD',
                        currencyDisplay: 'narrowSymbol',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }"
                      @change="monto = $event" />
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de liquidación
                    </div>
                    <select
                      name="select"
                      class="select-fecha"
                      :disabled="solicitarPrecio"
                      @change="setCalendar($event)">
                      <template v-for="(calendarOp, index) in calendarOptions">
                        <option
                          :id="index"
                          :key="index"
                          :value="calendarOp.date">
                          {{ calendarOp.Description }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <input
                      disabled
                      type="date"
                      :value="calendarSelected"
                      class="form-control input-fecha">
                  </div>
                </div>
              </div>
            </div>
            <div class="row box-two-btn d-flex justify-content-around">
              <button
                type="button"
                class="btn btn-outline-primary btn-cancelar"
                @click="cancelClick()">
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="monto === 0 || monto === '0' || monto === null"
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
    <modal-tiempo
      v-if="showModalTiempo"
      :open="showModalTiempo"
      @close="handleCloseTiempo" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueEllipseProgress } from 'vue-ellipse-progress';
import RepositoryFactory from '../repositories/RepositoryFactory';
import CurrencyInput from './CurrencyInput.vue';
import Sidebar from './Sidebar.vue';
import ModalExitoso from './ModalExitoso.vue';
import ModalError from './ModalError.vue';
import ModalTiempo from './ModaTiempo.vue';

const invexRepository = RepositoryFactory.get('invex');

export default {
  name: 'OperacionesFx',
  components: {
    CurrencyInput, VueEllipseProgress, Sidebar, ModalExitoso, ModalError, ModalTiempo,
  },
  data() {
    return {
      progress: 100,
      timeLeft: '00:60',
      solicitarPrecio: false,
      optionSelected: 'Comprar',
      monto: 0,
      timmerId: null,
      currencySelected: '',
      currenciesOptions: [],
      operationsOptions: [],
      currenciesSelected: [],
      calendarOptions: [],
      calendarSelected: null,
      operationsSelected: '',
      currencySelectedId: 1,
      showModal: false,
      showModalError: false,
      showModalTiempo: false,
      isDisabled: true,
      currencyValue: 22.749,
      initCurrencyValue: 22.749,
      valueComparation: '',
    };
  },
  computed: {
    ...mapState(['currentView']),
  },
  mounted() {
    this.getCurrencies();
    this.getOperations();
    this.getCalendar();
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
    async getOperations() {
      try {
        const options = await invexRepository.getOperations();
        this.operationsOptions = options;
        if (this.operationsOptions.length > 0) {
          this.operationsSelected = this.operationsOptions[0].product_code;
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCurrencies() {
      try {
        const divisas = await invexRepository.getCurrencies('1', '2');
        this.currenciesOptions = divisas.catalogList;
        this.setCurrenciesOptions({ target: { value: 0 } });
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCalendar() {
      try {
        const calendar = await invexRepository.getCalendar();
        this.calendarOptions = calendar.Message.map((e) => ({
          ...e,
          date: `${e.DateValue.slice(0, 4)}-${e.DateValue.slice(4, 6)}-${e.DateValue.slice(6)}`,
        }));
        if (this.calendarOptions.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          this.calendarSelected = this.calendarOptions[0].date;
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    setMonto(ev) {
      this.monto = ev;
    },
    setCurrenciesOptions(ev) {
      if (this.currenciesOptions.length > ev.target.value) {
        const auxSelected = this.currenciesOptions[ev.target.value];
        this.currencySelectedId = ev.target.value;
        this.currenciesSelected = [auxSelected.ccy1, auxSelected.ccy2];
        this.currencySelected = auxSelected.ccy1;
      }
    },
    setCurrencySelected(ev) {
      this.currencySelected = ev.target.value;
    },
    setOperation(ev) {
      this.operationsSelected = ev.target.value;
    },
    setCalendar(ev) {
      this.calendarSelected = ev.target.value;
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
        if (sec < 58) {
          const newCurrencyValue = (Math.random() * 4) + 20;
          this.currencyValue = newCurrencyValue.toFixed(3);
          if (newCurrencyValue > this.initCurrencyValue) {
            this.valueComparation = '+';
          }
          if (newCurrencyValue < this.initCurrencyValue) {
            this.valueComparation = '-';
          }
          if (newCurrencyValue === this.initCurrencyValue) {
            this.valueComparation = '';
          }
        }
        if (sec < 0) {
          clearInterval(timer);
          if (this.solicitarPrecio) {
            this.showModalTiempo = true;
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
    handleCloseTiempo() {
      this.solicitarPrecio = false;
      this.showModalTiempo = false;
      this.monto = '0';
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
