<template>
  <div class="widget-operacion-concertada">
    <div
      v-if="loading"
      class="invex-loader">
      <div class="invex-loader_spinner" />
    </div>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-xl-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <h2 class="subtitle mb-4">
                Operación Concertada
              </h2>
              <p style="display:none">
                crearOperacionConcertada {{ crearOperacionConcertada }}
              </p>
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-wrap">
                    <tbody>
                      <tr>
                        <td># Reference</td>
                        <td>{{ crearOperacionConcertada.OrderID }}</td>
                      </tr>
                      <tr>
                        <td>Trade Date</td>
                        <td>{{ getTimeZoneDate(crearOperacionConcertada.TransactTime, true) }}</td>
                      </tr>
                      <tr>
                        <td>Local Date</td>
                        <td>{{ getTimeZoneDate(crearOperacionConcertada.TransactTime, false) }}</td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="row-swap">
                        <td>Near Leg UTI</td>
                        <td>{{ crearOperacionConcertada.UTI }}</td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="row-swap">
                        <td>Far Leg UTI</td>
                        <td>{{ crearOperacionConcertada.UTI2 }}</td>
                      </tr>
                      <tr>
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr>
                        <td>Requester / Trader</td>
                        <td>{{ crearOperacionConcertada.Account }} </td>
                      </tr>
                      <tr>
                        <td>Provider / Trader</td>
                        <td>{{ crearOperacionConcertada.SecurityID }} </td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>{{ crearOperacionConcertada.OrdStatus }} </td>
                      </tr>
                      <tr>
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr class="texto-color">
                        <td>Product</td>
                        <td>{{ getProductTxt() }}</td>
                      </tr>
                      <tr v-if="operacionSeleccionada == 'SWAP'">
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr
                        class="texto-color">
                        <td>
                          <span v-if="operacionSeleccionada == 'SWAP'">Near Leg</span>
                          <span v-else> Requester Action</span>
                        </td>
                        <td>
                          {{ returnTxtOperacionFarLeg() }}
                        </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Notional Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(formatMonto) }}  {{ currencyDivisa }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Opposite Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(calculoOpposite()) }} {{ oppositiveDivisa }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Effective Date</td>
                        <td>
                          <span
                            v-if="operacionSeleccionada == 'SWAP'"
                            class="capitalize">{{ getOperacionPataCorta }}</span>
                          <span
                            v-else
                            class="capitalize">{{ getFechaSeleccionada() }}</span>
                          {{ getFechaSeleccionada() && '//' }}
                          {{ getLocalDate(crearOperacionConcertada.SettlDate, true) }}
                        </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Near Points</td>
                        <td>
                          {{ calcNearPoints }}
                        </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada !== 'SWAP'"
                        class="texto-color">
                        <td>{{ getProductTypeTxt() }} Rate</td>
                        <td>{{ crearOperacionConcertada.LastPx }}</td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Rate</td>
                        <td>{{ crearOperacionConcertada.LastPx }}</td>
                      </tr>
                      <!-- pata larga -->
                      <tr v-if="operacionSeleccionada == 'SWAP'">
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>
                          Far Leg
                        </td>
                        <td>
                          {{ returnTxtOperacion() }}
                        </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Notional Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(formatMontoFarLeg) }}  {{ currencyDivisa }} </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Opposite Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ).format(calculoOppositeFarLeg()) }} {{ oppositiveDivisa }} </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Effective Date</td>
                        <td>
                          <span
                            v-if="operacionSeleccionada == 'SWAP'"
                            class="capitalize">{{ getOperacionPataLarga }}</span>
                          <span
                            v-else
                            class="capitalize">{{ getFechaSeleccionada() }}</span>
                          {{ getFechaSeleccionada() && '//' }}
                          {{ getLocalDate(crearOperacionConcertada.SettlDate2, true) }}
                        </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Far Points</td>
                        <td>
                          {{ calcFaroints }}
                        </td>
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Rate</td>
                        <td>{{ crearOperacionConcertada.LastPx2 }}</td>
                      </tr>
                      <tr v-if="operacionSeleccionada == 'SWAP'">
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Swap PointsSell</td>
                        <td>
                          {{ calcSwapPointsSell }}
                        </td>
                      </tr><tr
                        v-if="operacionSeleccionada == 'SWAP'"
                        class="texto-color">
                        <td>Swap PointsBuy</td>
                        <td>
                          {{ calcSwapPointsBuy }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              class="box-two-btn d-flex justify-content-around">
              <a
                href="#;"
                class="btn btn-outline-primary btn-cancelar"
                @click="goToOperaciones">Realizar otra operación</a>
              <button
                v-if="!mostrarInstrucciones"
                type="submit"
                class="btn btn-primary btn-solicita"
                @click="goToLiquidacion">
                Asignar Instrucciones
              </button>
            </div>
          </form>
        </div>
        <div
          v-if="mostrarInstrucciones"
          class="col-md-12 col-xl-4 box-sidebar-spot">
          <div class="box-cuentas-liquidacion">
            <h2 class="mb-4">
              Instrucciones de liquidacion
            </h2>
            <p>Seleccionar cuentas</p>
            <form @submit.prevent="onSubmit">
              <div class="box-cuenta">
                <div class="form-group">
                  <label
                    for="tipoCuentalSelect">Cuenta de Origen:</label>
                  <select
                    id="tipoCuentalSelect"
                    class="form-control"
                    @change="setOrigen($event)">
                    <template v-for="(origen, index) in listadoOrigen">
                      <option
                        :id="index"
                        :key="index"
                        :selected="origenSelected === origen.customerAccount"
                        :value="origen.customerAccount">
                        {{ origenTxt(origen) }}
                      </option>
                    </template>
                  </select>
                </div>
                <a
                  class="box-alta"
                  @click="getListadoOrigen()">
                  <i class="icon-cruz">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 8.57143H8.57143V15H6.42857V8.57143H0V6.42857H6.42857V0H8.57143V6.42857H15V8.57143Z"
                        fill="#A41D36" />
                    </svg>
                  </i>
                  <span>Dar de alta nueva cuenta origen</span>
                </a>
              </div>
              <div class="box-cuenta">
                <div class="form-group">
                  <label
                    for="tipoCuentalSelect">Cuenta de Destino:</label>
                  <select
                    id="tipoCuentalSelect"
                    class="form-control"
                    :disabled="origenSelected === null"
                    @change="setDestino($event)">
                    <template v-for="(destino, index) in listadoDestino">
                      <option
                        :id="index"
                        :key="index"
                        :selected="destinoSelected === destino.BeneficiaryAccount"
                        :value="destino.BeneficiaryAccount">
                        {{ destinoTxt(destino) }}
                      </option>
                    </template>
                  </select>
                </div>
                <div
                  v-for="(destino, index) in listadoDestino"
                  :key="index">
                  <div
                    v-if="listadoDestino.length === 0 || allListadoDestino.length === 0"
                    class="mensaje-cuenta alert alert-warning d-flex align-items-center">
                    <div class="small in-normal">
                      No hay cuentas asignadas, por favor seleccionar otra Cuenta  Origen
                    </div>
                  </div>
                </div>
                <a
                  class="box-alta"
                  @click="getListadoDestino()">
                  <i class="icon-cruz">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15 8.57143H8.57143V15H6.42857V8.57143H0V6.42857H6.42857V0H8.57143V6.42857H15V8.57143Z"
                        fill="#A41D36" />
                    </svg>
                  </i>
                  <span>Dar de alta nueva cuenta destino</span>
                </a>
              </div>
              <div class="box-btn text-center">
                <button
                  type="submit"
                  :disabled="destinoSelected === null || destinoSelected === ''"
                  class="btn btn-primary btn-solicita"
                  @click.prevent="evenInstrucciones">
                  Asignar Instrucciones
                </button>
              </div>
            </form>
          </div>
        </div>
        <sidebar v-if="!mostrarInstrucciones" />
      </div>
      <modal-confirma
        v-if="showModal"
        :open="showModal"
        @close="handleClose" />
      <custom-modal
        v-if="customModalProps.open"
        :open="customModalProps.open"
        :type="customModalProps.type"
        :title="customModalProps.title"
        :message="customModalProps.message"
        :btn-accept-text="customModalProps.btnAcceptText"
        :btn-close-text="customModalProps.btnCancelText"
        :btn-accept-func="customModalProps.btnAcceptFunc"
        :btn-close-func="customModalProps.btnCancelFunc"
        :btn-close-hide="customModalProps.btnCloseHide"
        @close="closeModal" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment-timezone';
import Sidebar from './Sidebar.vue';
import ModalConfirma from './ModalConfirma.vue';
import CustomModal from './CustomModal.vue';

export default {
  name: 'OperacionConcertada',
  components: { Sidebar, ModalConfirma, CustomModal },
  data() {
    return {
      mostrarInstrucciones: false,
      destinoCurrency: '',
      allListadoDestino: [],
      listadoOrigen: [],
      listadoDestino: [],
      origenSelected: null,
      destinoSelected: null,
      cuentaOrigen: null,
      cuentaDestino: null,
      showModal: false,
      customModalProps: {
        title: 'No se han asignado instrucciones',
        message: '¿Deseas salir sin asignar instrucciones de liquidación a tus operaciones?',
        type: 'warning',
        open: false,
        btnAcceptText: 'Asignar ahora',
        btnCancelText: 'Asignar despues',
        btnCloseHide: false,
      },
    };
  },
  computed: {
    ...mapState(['currentView', 'loading']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['crearOperacionConcertada']),
    ...mapState(['listarOperacionConcertada']),
    ...mapState(['listarOperacion']),
    ...mapState(['listaOrigen']),
    ...mapState(['listaDestino']),
    ...mapState(['operacionSeleccionada']),
    ...mapState(['operacionPataCorta']),
    ...mapState(['operacionPataLarga']),
    ...mapState(['fechaCatalogoSeleccionada']),
    tipoOperacion() {
      return this.$store.state.crearOperacionConcertada.Side;
    },
    currencyDivisa() {
      return this.$store.state.crearOperacionConcertada.Currency;
    },
    oppositiveDivisa() {
      const actual = this.$store.state.crearOperacionConcertada.Currency;
      const valor = this.$store.state.crearOperacionConcertada.Symbol;
      const separa = valor.split('/');
      // eslint-disable-next-line
      const filtrado = separa.filter((separa) => separa !== actual);
      const resultado = filtrado.toString();
      return resultado;
    },
    formatMonto() {
      // return this.$store.state.crearOperacionConcertada.OrderQty.toLocaleString('en-US');
      return this.$store.state.crearOperacionConcertada.OrderQty;
    },
    formatMontoFarLeg() {
      // return this.$store.state.crearOperacionConcertada.OrderQty.toLocaleString('en-US');
      return this.$store.state.crearOperacionConcertada.OrderQty2;
    },
    formatMontoOppositive() {
      // return this.$store.state.crearOperacionConcertada.OrderQty.toLocaleString('en-US');
      return this.$store.state.crearOperacionConcertada.OrderQty * this.$store.state.crearOperacionConcertada.Price;
    },
    calcNearPoints() {
      const rate = this.$store.state.crearOperacionConcertada.LastPx;
      const spotRate = this.$store.state.crearOperacionConcertada.LastSpotRate;
      const total = (rate - spotRate) * 10000;
      const totalFixed = total.toFixed(3);
      return totalFixed;
    },
    calcFaroints() {
      const rate2 = this.$store.state.crearOperacionConcertada.LastPx2;
      const spotRate = this.$store.state.crearOperacionConcertada.LastSpotRate;
      const total = (rate2 - spotRate) * 10000;
      const totalFixed = total.toFixed(3);
      return totalFixed;
    },
    calcSwapPointsSell() {
      const nearPoint = this.calcNearPoints;
      const farPoint = this.calcFaroints;
      const total = farPoint - nearPoint;
      const totalFixed = total.toFixed(3);
      return totalFixed;
    },
    calcSwapPointsBuy() {
      const nearPoint = this.calcNearPoints;
      const farPoint = this.calcFaroints;
      const total = farPoint - nearPoint;
      const totalFixed = total.toFixed(3);
      return totalFixed;
    },
    getOperacionPataCorta() {
      return this.operacionPataCorta.toLowerCase();
    },
    getOperacionPataLarga() {
      return this.operacionPataLarga.toLowerCase();
    },
  },
  methods: {
    getFechaSeleccionada() {
      if (this.fechaCatalogoSeleccionada) return this.fechaCatalogoSeleccionada.toLowerCase();
      return '';
    },
    getProductTxt() {
      const tiposProductos = {
        SPOT: 'FX Spot',
        FORWARD: 'FX Forward',
        SWAP: 'FX Swap',
      };
      if (tiposProductos[this.operacionSeleccionada]) return tiposProductos[this.operacionSeleccionada];
      return tiposProductos.SPOT;
    },
    getProductTypeTxt() {
      const tiposProductos = {
        SPOT: 'Spot',
        FORWARD: 'Forward',
        SWAP: 'Swap',
      };
      if (tiposProductos[this.operacionSeleccionada]) return tiposProductos[this.operacionSeleccionada];
      return tiposProductos.SPOT;
    },
    destinoTxt(destino) {
      if (!destino) return '';
      const destinoAux = JSON.parse(JSON.stringify(destino));
      if (!destinoAux.BeneficiaryAccount) return '';
      return `${this.destinoCurrency} ${destinoAux.BeneficiaryBank} - **********${destinoAux.BeneficiaryAccount.toString()
        .slice(destinoAux.BeneficiaryAccount.toString().length - 4)}`;
    },
    origenTxt(origen) {
      if (!origen) return '';
      return `${origen.currency}
                        ${origen.type} - **********${origen.customerAccount.slice(origen.customerAccount.length - 4)}`;
    },
    closeModal() {
      this.customModalProps.open = false;
    },
    abrirModal() {
      // eslint-disable-next-line no-return-assign
      this.customModalProps.btnAcceptFunc = () => this.mostrarInstrucciones = true;
      this.customModalProps.btnCancelFunc = () => this.$store.dispatch('updatePage', 'operacionesFx');
      this.customModalProps.title = 'No se han asignado instrucciones';
      this.customModalProps.message = '¿Deseas salir sin asignar instrucciones de liquidación a tus operaciones?';
      this.customModalProps.btnAcceptText = 'Asignar ahora';
      this.customModalProps.btnCloseHide = false;
      this.customModalProps.open = true;
    },
    calculoOpposite() {
      // return this.$store.state.crearOperacionConcertada.OrderQty * this.$store.state.crearOperacionConcertada.Price;
      const actual = this.$store.state.crearOperacionConcertada.Currency;
      const valor = this.$store.state.crearOperacionConcertada.Symbol;
      const separa = valor.split('/');
      let total;
      // eslint-disable-next-line
      if (separa[0] === actual) {
        // eslint-disable-next-line
        total = this.$store.state.crearOperacionConcertada.OrderQty * this.$store.state.crearOperacionConcertada.LastPx;
      } else {
        // eslint-disable-next-line
        total = this.$store.state.crearOperacionConcertada.OrderQty / this.$store.state.crearOperacionConcertada.LastPx;
      }
      return total;
    },
    calculoOppositeFarLeg() {
      // return this.$store.state.crearOperacionConcertada.OrderQty * this.$store.state.crearOperacionConcertada.Price;
      const actual = this.$store.state.crearOperacionConcertada.Currency;
      const valor = this.$store.state.crearOperacionConcertada.Symbol;
      const separa = valor.split('/');
      let total;
      // eslint-disable-next-line
      if (separa[0] === actual) {
        // eslint-disable-next-line
        total = this.$store.state.crearOperacionConcertada.OrderQty2 * this.$store.state.crearOperacionConcertada.LastPx2;
      } else {
        // eslint-disable-next-line
        total = this.$store.state.crearOperacionConcertada.OrderQty2 / this.$store.state.crearOperacionConcertada.LastPx2;
      }
      return total;
    },
    async onSubmit() {
      // console.log(this.crearOperacionConcertada);
    },
    goToOperaciones() {
      // eslint-disable-next-line no-return-assign
      this.customModalProps.btnAcceptFunc = () => {
        this.customModalProps.open = false;
        if (!this.mostrarInstrucciones) {
          this.goToLiquidacion();
        }
      };
      this.customModalProps.btnCancelFunc = () => this.$store.dispatch('updatePage', 'operacionesFx');
      this.customModalProps.title = 'No se han asignado instrucciones';
      this.customModalProps.message = '¿Deseas salir sin asignar instrucciones de liquidación a tus operaciones?';
      this.customModalProps.btnAcceptText = 'Asignar ahora';
      this.customModalProps.btnCloseHide = false;
      this.customModalProps.open = true;
    },
    async evenInstrucciones() {
      try {
        const concretadaData = this.$store.state.crearOperacionConcertada;
        const body = {
          transactionId: concretadaData.ClOrdID,
          requestSystem: 'FX',
          orderID: concretadaData.OrderID,
          debitAccount: this.origenSelected,
          creditAccount: '',
          settlAccount: this.destinoSelected,
        };
        this.listadoDestino.forEach((destino) => {
          if (destino.BeneficiaryAccount === this.destinoSelected) {
            body.creditAccount = `${destino.customerAccount}`;
          }
        });
        await this.$store.dispatch('actualizarOperacion', body);
        this.showModal = true;
      } catch (err) {
        this.showModal = true;
      }
    },
    handleClose() {
      this.showModal = false;
    },
    async goToLiquidacion() {
      if (this.mostrarInstrucciones) {
        this.mostrarInstrucciones = false;
      } else {
        const rsp = await this.getListadoOrigen();
        if (rsp) {
          this.mostrarInstrucciones = true;
          this.getListadoDestino();
        } else {
          this.customModalProps.title = 'No se encontraron cuentas origen';
          this.customModalProps.message = `No existen cuentas origen registradas para la divisa ${await this.getLogicCurrencies()} para poder realizar la asignación de las cuentas a la operación`;
          this.customModalProps.btnAcceptText = 'Aceptar';
          this.customModalProps.btnCloseHide = true;
          this.customModalProps.btnAcceptFunc = this.closeModal;
          this.customModalProps.open = true;
        }
      }
    },
    getTimeZoneDate(str, isGMT = false) {
      const strDateFormat = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(9)}`;
      if (isGMT) {
        return `${moment(strDateFormat, 'YYYY-MM-DD HH:mm:ss').format('ddd, DD. MMM YYYY HH:mm:ss')} GMT`;
      }
      const cloneDate = moment(strDateFormat, 'YYYY-MM-DD HH:mm:ss').tz('Atlantic/Reykjavik', true);
      const dateMexico = cloneDate.clone().tz('America/Mexico_City').format('ddd, DD. MMM YYYY HH:mm:ss');
      return `${dateMexico} CDT`;
    },
    getLocalDate(str, onlyDate = false) {
      const strDateFormat = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)} ${str.slice(9)}`;
      const date = new Date(strDateFormat).toGMTString();
      if (onlyDate) {
        return `${date.slice(0, 16)}`;
      }
      return date;
    },
    setOrigen(event) {
      this.origenSelected = event.target.value;
      this.cuentaOrigen = this.listadoOrigen.find((item) => item.customerAccount === this.origenSelected);
    },
    setDestino(event) {
      this.destinoSelected = event.target.value;
      this.cuentaDestino = this.listadoDestino.find((item) => item.BeneficiaryAccount === this.destinoSelected);
    },
    async getLogicCurrencies(destino) {
      const concretadaData = await this.$store.state.crearOperacionConcertada;
      const currencyData = concretadaData.Currency;
      const separa = concretadaData.Symbol.split('/');
      const opcion = concretadaData.Side; // SELL = "2" / BUY = "1"
      const segundaMoneda = currencyData === separa[1];
      const contrario = currencyData === separa[0] ? separa[1] : separa[0];
      if (segundaMoneda) {
        if (destino) {
          this.destinoCurrency = opcion === '2' ? currencyData : contrario;
          return opcion === '2' ? currencyData : contrario;
        }
        return opcion === '2' ? contrario : currencyData;
      }
      if (destino) {
        this.destinoCurrency = opcion === '1' ? currencyData : contrario;
        return opcion === '1' ? currencyData : contrario;
      }
      return opcion === '1' ? contrario : currencyData;
    },
    async getListadoOrigen() {
      try {
        const concretadaData = this.$store.state.crearOperacionConcertada;
        const body = {
          transactionId: concretadaData.ClOrdID,
          requestSystem: 'PORTAL',
          source: 'PORTALSYS',
          userId: 'PORTALUSR',
          branch: '001',
          sourceUserId: 'PORTALUSR',
          CustomerNumber: '00004635',
          Type: 'CE',
          InternetFolio: '3853',
          AllowOperate: 'T',
          Currency: await this.getLogicCurrencies(),
        };
        const response = await this.$store.dispatch('getListaOrigen', body);
        if (!response) return false;
        if (Array.isArray(response.cuentas)) {
          this.listadoOrigen = response.cuentas;
        } else {
          this.listadoOrigen = [response.cuentas];
        }
        if (this.listadoOrigen.length > 0) {
          this.setOrigen({ target: { value: this.listadoOrigen[0].customerAccount } });
        }
        return this.listadoOrigen.length > 0;
      } catch (e) {
        return false;
      }
    },
    async getListadoDestino() {
      try {
        const concretadaData = this.$store.state.crearOperacionConcertada;
        const body = {
          transactionId: concretadaData.ClOrdID,
          requestSystem: 'PORTALFX',
          source: 'FXSYS',
          userId: 'FXUSR',
          branch: '001',
          sourceUserId: 'FXUSR',
          CustomerNumber: '00004635',
          Type: 'CE',
          InternetFolio: '3853',
          AllowOperate: 'S',
          Currency: await this.getLogicCurrencies(true),
          SameBank: false,
          IsBeneficiaryCreditCard: false,
        };
        const response = await this.$store.dispatch('getListaDestino', body);
        const respAux = JSON.parse(JSON.stringify(response));
        if (response) {
          if (Array.isArray(respAux)) {
            this.$set(this, 'allListadoDestino', respAux);
          } else {
            this.$set(this, 'allListadoDestino', [respAux]);
          }
          if (this.allListadoDestino.length > 0) {
            this.listadoDestino = [];
            this.destinoSelected = '';
            this.cuentaDestino = null;
            const listadoAux = JSON.parse(JSON.stringify(this.allListadoDestino));
            if (Array.isArray(listadoAux)) {
              listadoAux.forEach((item) => {
                if (item.cuentas.beneficiaryData) {
                  if (Array.isArray(item.cuentas.beneficiaryData.beneficiaryAccount)) {
                    item.cuentas.beneficiaryData.beneficiaryAccount.forEach((item2) => {
                      const auxPush = { ...item2, customerAccount: item.cuentas.customerAccount };
                      this.listadoDestino.push(auxPush);
                    });
                  } else {
                    this.listadoDestino.push({
                      ...item.cuentas.beneficiaryData.beneficiaryAccount,
                      customerAccount: item.cuentas.customerAccount,
                    });
                  }
                }
              });
            }
            this.setDestino({ target: { value: this.listadoDestino[0].BeneficiaryAccount } });
          }
        } else {
          this.returnMsgDestino();
        }
      } catch (e) {
        this.returnMsgDestino();
      }
    },
    async returnMsgDestino() {
      this.customModalProps.title = 'No se encontraron cuentas destino';
      this.customModalProps.message = `No existen cuentas destino registradas para la divisa ${this.currencyDivisa} para poder realizar la asignación de las cuentas a la operación`;
      this.customModalProps.btnAcceptText = 'Aceptar';
      this.customModalProps.btnCloseHide = true;
      this.customModalProps.btnAcceptFunc = () => {
        this.mostrarInstrucciones = false;
        this.closeModal();
      };
      this.customModalProps.open = true;
    },
    returnTxtOperacion() {
      const actual = this.$store.state.crearOperacionConcertada.Currency;
      const valor = this.$store.state.crearOperacionConcertada.Symbol;
      const opcion = this.$store.state.crearOperacionConcertada.Side; // SELL = "2" / BUY = "1"
      const separa = valor.split('/');
      let str = `I ${opcion === '2' ? 'Sell' : 'Buy'} ${separa[0]} // ${opcion === '2' ? 'Buy' : 'Sell'} ${separa[1]}`;
      if (separa[0] === actual) {
        str = `I ${opcion === '2' ? 'Sell' : 'Buy'} ${separa[0]} // ${opcion === '2' ? 'Buy' : 'Sell'} ${separa[1]}`;
      }
      return str;
    },
    returnTxtOperacionFarLeg() {
      const actual = this.$store.state.crearOperacionConcertada.Currency;
      const valor = this.$store.state.crearOperacionConcertada.Symbol;
      const opcion = this.$store.state.crearOperacionConcertada.Side; // SELL = "2" / BUY = "1"
      const separa = valor.split('/');
      let str = `I ${opcion === '2' ? 'Buy' : 'Sell'} ${separa[0]} // ${opcion === '2' ? 'Sell' : 'Buy'} ${separa[1]}`;
      if (separa[0] === actual) {
        str = `I ${opcion === '2' ? 'Buy' : 'Sell'} ${separa[0]} // ${opcion === '2' ? 'Sell' : 'Buy'} ${separa[1]}`;
      }
      return str;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .table td {
      width: 50%;
      &:first-child {
        font-weight: bold;
        color: #424242;
      }
  }
  .spaceTd {
    height: 49px;
  }
  .capitalize {
    text-transform: capitalize;
  }
</style>
