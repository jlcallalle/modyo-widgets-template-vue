<template>
  <div
    class="widget-operaciones-fx"
    :class="[solicitarPrecio == false ? 'widget-operaciones-fx' : 'widget-operacion-comprar-vender' ]">
    <h1
      class="mb-4 title-widget">
      Operaciones <span @click="changeTwoway">
        FX
      </span>
    </h1>
    <div
      v-if="loading"
      class="invex-loader">
      <div class="invex-loader_spinner" />
    </div>
    <p style="display:none">
      a {{ listarOperacion }}
    </p>
    <p style="display:none">
      b: {{ operationsOptions }}
    </p>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-xl-8 box-operaciones">
          <form @submit.prevent="enterForm">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label
                    for="tipoOperacionlSelect"
                    class="title-group">Operación:</label>
                  <select
                    id="tipoOperacionlSelect"
                    class="form-control"
                    :disabled="solicitarPrecio">
                    <template v-for="(value, key, index) in listarOperacion">
                      <option
                        v-if="index === 0"
                        :key="index"
                        :value="value"
                        :selected="index === 0">
                        {{ value }}
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
                        {{ currency.Ccy1 }} / {{ currency.Ccy2 }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div
              class="row">
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio ||
                    ( optionSelected !== 'Vender' && optionSelected !== 'Twoway' ||
                      !solicitarPrecio && mostrarTwoWay)"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && (optionSelected === 'Vender' || optionSelected === 'Twoway')"
                  class="box-vender">
                  <div class="title-operacion">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      :class="{greenValue: isBuy ? valueComparationBuy === '+' : valueComparationSell === '+',
                               redValue: isBuy ? valueComparationBuy === '-' : valueComparationSell === '-'}">
                      {{ isBuy ? currencyValueBuy : currencyValueSell }}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="eventOperation">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </button>
                </div>
              </div>
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio || (solicitarPrecio && optionSelected === 'Vender'
                    || !solicitarPrecio && mostrarTwoWay)"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && (optionSelected === 'Comprar' || optionSelected === 'Twoway')"
                  class="box-vender">
                  <div class="title-operacion">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      :class="{greenValue: isBuy ? valueComparationSell === '+' : valueComparationBuy === '+',
                               redValue: isBuy ? valueComparationSell === '-' : valueComparationBuy === '-'}">
                      {{ isBuy ? currencyValueSell : currencyValueBuy }}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="eventOperation">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
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
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </button>

                  <button
                    v-if="mostrarTwoWay && !solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': mostrarTwoWay == true && optionSelected === 'Twoway'}"
                    @click="clickOption('Twoway')">
                    Two Way
                  </button>

                  <button
                    v-if="!solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Comprar' }"
                    @click="clickOption('Comprar')">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
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
                        currency: 'USD',
                        currencyDisplay: 'hidden',
                        locale: 'en-US',
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
                      disabled
                      @change="setCalendar($event)">
                      <template v-for="(calendarOp, index) in calendarOptions">
                        <option
                          :id="index"
                          :key="index"
                          :selected="calendarSelected === calendarOp.date"
                          :value="calendarOp.date">
                          {{ calendarOp.Description }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <input
                      disabled
                      type="text"
                      :value="dateFormat()"
                      class="form-control input-fecha">
                    <i class="icon-calendar">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 13.5H13C12.45 13.5 12 13.95 12 14.5V17.5C12 18.05 12.45 18.5 13 18.5H16C16.55 18.5 17 18.05 17 17.5V14.5C17 13.95 16.55 13.5 16 13.5ZM16 3.5V4.5H8V3.5C8 2.95 7.55 2.5 7 2.5C6.45 2.5 6 2.95 6 3.5V4.5H5C3.89 4.5 3.01 5.4 3.01 6.5L3 20.5C3 21.6 3.89 22.5 5 22.5H19C20.1 22.5 21 21.6 21 20.5V6.5C21 5.4 20.1 4.5 19 4.5H18V3.5C18 2.95 17.55 2.5 17 2.5C16.45 2.5 16 2.95 16 3.5ZM18 20.5H6C5.45 20.5 5 20.05 5 19.5V9.5H19V19.5C19 20.05 18.55 20.5 18 20.5Z"
                          fill="#424242" />
                      </svg>
                    </i>
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
                type="button"
                :disabled="monto === 0 || monto === '0' || monto === null || calendarOptions.length === 0 || horario.status === 'offline'"
                class="btn btn-primary btn-solicita"
                @click="onSubmit()">
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
    <modal-horario
      v-if="showModalHorario"
      :open="showModalHorario"
      @close="handleCloseHorario" />
    <modal-tiempo
      v-if="showModalTiempo"
      :open="showModalTiempo"
      @close="handleCloseTiempo" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueEllipseProgress } from 'vue-ellipse-progress';
import CurrencyInput from './CurrencyInput.vue';
import Sidebar from './Sidebar.vue';
import ModalExitoso from './ModalExitoso.vue';
import ModalError from './ModalError.vue';
import ModalTiempo from './ModaTiempo.vue';
import ModalHorario from './ModalHorario.vue';

export default {
  name: 'OperacionesFx',
  components: {
    CurrencyInput,
    VueEllipseProgress,
    Sidebar,
    ModalExitoso,
    ModalError,
    ModalTiempo,
    ModalHorario,
  },
  data() {
    return {
      progress: 100,
      timeLeft: '00:60',
      solicitarPrecio: false,
      isTwoway: false,
      // mostrarTwoWay: false,
      optionSelected: 'Comprar',
      monto: 0,
      timmerId: null,
      currencySelected: '',
      currenciesOptions: [],
      operationsOptions: [{
        productCode: 'SPOT',
        productDescription: 'SPOT',
      }],
      currenciesSelected: [],
      calendarOptions: [],
      calendarSelected: null,
      operationsSelected: '',
      currencySelectedId: 1,
      showModal: false,
      showModalError: false,
      showModalTiempo: false,
      showModalHorario: false,
      isDisabled: true,
      // loading: true,
      currencyValueBuy: 22.749,
      currencyValueSell: 22.749,
      valueComparationBuy: '',
      valueComparationSell: '',
      isBuy: false,
      wsAccount: 'INVEXCOMP.TEST',
      // qrCLOrdID: 'INVEXCOMP.TEST-00020220209124801190',
      orderType: 'Previously',
      qPrice: 20.9294,
      qQuoteID: '',
      qQuoteReqID: '',
      opSide: 'Buy',
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState(['currentView']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['servicio']),
    ...mapState(['listarOperacion']),
    ...mapState(['listaOperaciones']),
    ...mapState(['horario']),
    ...mapState([
      'listaDivisas',
      'calendario',
      'quoteRequest',
    ]),
    mostrarTwoWay() {
      return this.isTwoway;
      // return this.$store.state.mapClientLogeo.twoWay;
    },
  },
  async mounted() {
    await this.getCurrencies();
    await this.getOperations();
    this.getValueTwoWay();
    await this.getHoraRestriccion();
  },
  async created() {
    const getHours = new Date().getHours();
    if (getHours >= 9 && getHours < 18) {
      if (getHours === 16) {
        this.showModalHorario = true;
      }
    }
    const responseApiServicio = await this.$store.dispatch('updateServicio');
    if (responseApiServicio.status === 200 || responseApiServicio.status === 201) {
      // console.log('servicio ok');
    } else {
      // console.log('servicio error');
      // this.showModalError = true;
    }
    const responseApiOperaciones = await this.$store.dispatch('updateListarOperaciones');
    if (responseApiOperaciones.status === 200 || responseApiOperaciones.status === 201) {
      // console.log('operaciones ok');
    } else {
      // console.log('operaciones error');
      // this.showModalError = true;
    }
  },
  methods: {
    enterForm() {
      // console.log('enterForm');
    },
    getValueTwoWay() {
      if (this.mostrarTwoWay) {
        this.optionSelected = 'Twoway';
      } else {
        // alert('false');
      }
    },
    async onSubmit() {
      if (this.solicitarPrecio) {
        this.solicitarPrecio = false;
        clearInterval(this.timmerId);
      } else {
        try {
          const getHours = new Date().getHours();
          if (getHours >= 9 && getHours < 18) {
            if (getHours === 16) {
              // alert('Servicio temporalmente fuera de servicio, intentar a las 5pm por favor');
            } else {
              // alert('Aceptado');
            }
          } else {
            // alert('Fuera de horario');
          }
          let opSide = this.optionSelected === 'Comprar' ? 'Buy' : 'Sell';
          if (this.isBuy) {
            opSide = this.optionSelected === 'Comprar' ? 'Sell' : 'Buy';
          }
          this.valueComparationSell = '';
          this.valueComparationBuy = '';
          this.opSide = opSide;
          const currenciesSelected = this.currenciesSelected.join('/');
          const tomorrow = this.calendarSelected.replace(/-/g, '');
          const sideValue = this.optionSelected === 'Twoway' ? 'Twoway' : opSide;
          const body = {
            ProductType: 'FX_STD',
            NoRelatedSym: [{
              Symbol: currenciesSelected,
              Side: sideValue,
              OrderQty: this.monto.toString(),
              SettlDate: tomorrow,
              Currency: this.currencySelected,
              Account: 'INVEXCOMP.TEST',
              OperationName: 'SPOT',
            }],
          };
          const rsp = await this.$store.dispatch('getQuoteRequest', body);
          const rspMsg = JSON.parse(rsp.Message);
          this.currencyValueSell = rspMsg.SellPrice;
          this.currencyValueBuy = rspMsg.BuyPrice;
          this.qQuoteID = rspMsg.QuoteID;
          this.qQuoteReqID = rspMsg.QuoteReqID;
          this.solicitarPrecio = true;
          this.startTimer();
        } catch (err) {
          // console.log(err);
        }
      }
    },
    async getOperations() {
      try {
        await this.$store.dispatch('getListaOperaciones');
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCurrencies() {
      try {
        await this.$store.dispatch('getDivisas');
        this.currenciesOptions = this.listaDivisas;
        const findUSD = this.currenciesOptions.findIndex((item) => item.Ccy1 === 'USD' && item.Ccy2 === 'MXN');
        this.setCurrenciesOptions({ target: { value: findUSD || 0 } });
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getHoraRestriccion() {
      try {
        await this.$store.dispatch('updateHorario');
        const valorActual = this.$store.state.horario.status;
        if (valorActual === 'offline') {
          this.showModalHorario = true;
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCalendar() {
      try {
        const currenciesSelected = this.currenciesSelected.join('/');
        // console.log('currenciesSelected', currenciesSelected);
        await this.$store.dispatch('getCalendario', currenciesSelected);
        this.calendarOptions = this.calendario;
        const spot = JSON.parse(JSON.stringify(this.calendario)).find((item) => item.Description === 'SPOT');
        if (spot) {
          this.calendarSelected = spot.date;
        } else if (this.calendarOptions.length > 0) {
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
        this.currenciesSelected = [auxSelected.Ccy1, auxSelected.Ccy2];
        this.currencySelected = auxSelected.Ccy1;
        this.isBuy = false;
        this.getCalendar();
      }
    },
    setCurrencySelected(ev) {
      this.currencySelected = ev.target.value;
      this.isBuy = false;
      this.currenciesSelected.forEach((e, i) => {
        if (e === ev.target.value) {
          this.isBuy = i === 1;
        }
      });
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
    async startTimer() {
      let sec = 60;
      this.progress = 100;
      this.timeLeft = '00:60';
      const timer = setInterval(async () => {
        this.timeLeft = `00:${sec < 10 ? '0' : ''}${sec}`;
        let progressAux = sec * 100;
        progressAux /= 60;
        this.progress = progressAux;
        sec -= 1;
        if (sec % 2 === 0) {
          const opName = this.optionSelected === 'Twoway' ? 'Twoway' : this.opSide;
          const rsp = await this.$store.dispatch('getQuote', { quoteId: this.qQuoteReqID, opSide: opName });
          if (rsp.DataIdentifier === 7) {
            const rspMsg = JSON.parse(rsp.Message);
            this.qQuoteReqID = rspMsg.QuoteReqID;
            this.qQuoteID = rspMsg.QuoteID;
            const newCurrencyValueSell = rspMsg.SellPrice;
            const newCurrencyValueBuy = rspMsg.BuyPrice;
            if (Number(newCurrencyValueSell) > Number(this.currencyValueSell)) {
              this.valueComparationSell = '+';
            } else if (Number(newCurrencyValueSell) < Number(this.currencyValueSell)) {
              this.valueComparationSell = '-';
            } else {
              this.valueComparationSell = '=';
            }
            if (Number(newCurrencyValueBuy) > Number(this.currencyValueBuy)) {
              this.valueComparationBuy = '+';
            } else if (Number(newCurrencyValueBuy) < Number(this.currencyValueBuy)) {
              this.valueComparationBuy = '-';
            } else {
              this.valueComparationBuy = '=';
            }
            this.currencyValueSell = newCurrencyValueSell;
            this.currencyValueBuy = newCurrencyValueBuy;
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
        window.location.reload();
      }
    },
    async eventOperation() {
      const currenciesSelected = this.currenciesSelected.join('/');
      const tomorrow = this.calendarSelected.replace(/-/g, '');
      const bodyConcertacion = {
        Account: this.wsAccount,
        CLOrdID: this.qQuoteReqID,
        Currency: this.currencySelected,
        OrderQty: this.monto.toString(),
        OrderType: this.orderType,
        Price: this.opSide === 'Buy' ? this.currencyValueBuy : this.currencyValueSell,
        QuoteID: this.qQuoteID,
        SettlDate: tomorrow,
        Side: this.opSide,
        Symbol: currenciesSelected,
        Product: 'SPOT',
        TransactionId: this.qQuoteReqID,
        RequestSystem: 'PORTALFX',
      };
      clearInterval(this.timmerId);
      const responseApiConcertacion = await this.$store.dispatch('createConcertacion', bodyConcertacion);
      if (responseApiConcertacion.DataIdentifier === 9) {
        this.showModal = true;
        // console.log('concertacion ok');
      } else {
        this.showModalError = true;
        // console.log('concertacion error');
      }
    },
    handleClose() {
      this.showModal = false;
    },
    handleOpenError() {
      this.showModalError = true;
    },
    handleCloseError() {
      this.showModalError = false;
      this.solicitarPrecio = false;
    },
    handleCloseTiempo() {
      this.solicitarPrecio = false;
      this.showModalTiempo = false;
    },
    dateFormat() {
      if (!this.calendarSelected) return '';
      const dateArr = this.calendarSelected.split('-');
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    },
    handleCloseHorario() {
      this.showModalHorario = false;
    },
    changeTwoway() {
      this.isTwoway = !this.isTwoway;
      if (this.isTwoway) {
        this.clickOption('Twoway');
      } else {
        this.clickOption('Comprar');
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
.greenValue {
  color: green;
}

.redValue {
  color: red;
}
</style>
