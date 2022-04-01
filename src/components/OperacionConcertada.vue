<template>
  <div class="widget-operacion-concertada">
    <div
      v-if="loading"
      class="invex-loader">
      <div class="invex-loader_spinner" />
    </div>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-lg-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <h2 class="subtitle mb-4">
                Operación Concertada
              </h2>
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-wrap">
                    <tbody>
                      <tr>
                        <td># Reference</td>
                        <td>{{ crearOperacionConcertada.OrderID }}</td>
                      </tr>
                      <tr>
                        <td>Local Date</td>
                        <td>{{ getLocalDate(crearOperacionConcertada.TransactTime) }}</td>
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
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>{{ crearOperacionConcertada.OrdStatus }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Product</td>
                        <td> <span v-if="listarOperacion.productCode == 'SPOT'"> FX Spot</span></td>
                      </tr>
                      <tr class="texto-color">
                        <td>Requester Action</td>
                        <td>
                          {{ returnTxtOperacion() }}
                        </td>
                        <!-- <td>I Buy USD / Sell MXN</td> -->
                      </tr>
                      <tr class="texto-color">
                        <td>Notional Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', {} ).format(formatMonto) }}  {{ currencyDivisa }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Opposite Amount</td>
                        <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US', {} ).format(calculoOpposite()) }} {{ oppositiveDivisa }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Effective Date</td>
                        <td>Spot // {{ getLocalDate(crearOperacionConcertada.SettlDate, true) }}</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Spot Rate</td>
                        <td>{{ crearOperacionConcertada.LastPx }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              v-if="!mostrarInstrucciones"
              class="box-two-btn d-flex justify-content-around">
              <a
                href="#;"
                class="btn btn-outline-primary btn-cancelar"
                @click="goToOperaciones">Realizar otra operación</a>
              <button
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
          class="col-md-12 col-lg-4 box-sidebar-spot">
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
                        {{ `${origen.currency}
                        ${origen.type}-**********${origen.customerAccount.slice(origen.customerAccount.length - 4)}` }}
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
                        :selected="destinoSelected === destino.beneficiaryAccount"
                        :value="destino.beneficiaryAccount">
                        {{ `${destino.beneficiaryBank}-**********
                        ${destino.beneficiaryAccount.toString()
                        .slice(destino.beneficiaryAccount.toString().length - 4)}` }}
                      </option>
                    </template>
                  </select>
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from './Sidebar.vue';
import ModalConfirma from './ModalConfirma.vue';

export default {
  name: 'OperacionConcertada',
  components: { Sidebar, ModalConfirma },
  data() {
    return {
      mostrarInstrucciones: false,
      allListadoDestino: [],
      listadoOrigen: [],
      listadoDestino: [],
      origenSelected: null,
      destinoSelected: null,
      cuentaOrigen: null,
      cuentaDestino: null,
      showModal: false,
    };
  },
  computed: {
    ...mapState(['currentView', 'loading']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['crearOperacionConcertada']),
    ...mapState(['listarOperacionConcertada']),
    ...mapState(['listarOperacion']),
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
    formatMontoOppositive() {
      // return this.$store.state.crearOperacionConcertada.OrderQty.toLocaleString('en-US');
      return this.$store.state.crearOperacionConcertada.OrderQty * this.$store.state.crearOperacionConcertada.Price;
    },
  },
  methods: {
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
    async onSubmit() {
      // console.log(this.crearOperacionConcertada);
    },
    goToOperaciones() {
      this.$store.dispatch('updatePage', 'operacionesFx');
    },
    async evenInstrucciones() {
      try {
        const concretadaData = this.$store.state.crearOperacionConcertada;
        const body = {
          transactionId: concretadaData.TransactTime,
          requestSystem: 'FX',
          orderID: concretadaData.OrderID,
          debitAccount: '00004635',
          creditAccount: this.origenSelected,
          settlAccount: `${this.destinoSelected}`,
        };
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
          if (rsp.cuentas.length > 0) {
            this.mostrarInstrucciones = true;
          }
        }
      }
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
      this.getListadoDestino();
    },
    setDestino(event) {
      this.destinoSelected = event.target.value;
      this.cuentaDestino = this.listadoDestino.find((item) => item.BeneficiaryAccount === this.destinoSelected);
    },
    async getListadoOrigen() {
      const body = {
        transactionId: '3853-02',
        requestSystem: 'PORTAL',
        source: 'PORTALSYS',
        userId: 'PORTALUSR',
        branch: '001',
        sourceUserId: 'PORTALUSR',
        CustomerNumber: '00004635',
        Type: 'CE',
        InternetFolio: '3853',
        AllowOperate: 'T',
      };
      const response = await this.$store.dispatch('getListaOrigen', body);
      if (Array.isArray(response.cuentas)) {
        this.listadoOrigen = response.cuentas;
      } else {
        this.listadoOrigen = [response.cuentas];
      }
      if (this.listadoOrigen.length > 0) {
        this.setOrigen({ target: { value: this.listadoOrigen[0].customerAccount } });
      }
      return response;
    },
    findCuentaDestino() {
      this.listadoDestino = [];
      this.destinoSelected = '';
      this.cuentaDestino = null;
      const listadoAux = JSON.parse(JSON.stringify(this.allListadoDestino));
      const cuentaDestino = listadoAux.find((item) => item.cuentas.customerAccount === this.origenSelected);
      if (cuentaDestino) {
        if (cuentaDestino.cuentas.beneficiaryData) {
          if (Array.isArray(cuentaDestino.cuentas.beneficiaryData.beneficiaryAccount)) {
            this.listadoDestino = cuentaDestino.cuentas.beneficiaryData.beneficiaryAccount;
          } else {
            this.listadoDestino = [cuentaDestino.cuentas.beneficiaryData.beneficiaryAccount];
          }
          this.setDestino({ target: { value: this.listadoDestino[0].beneficiaryAccount } });
        }
      }
    },
    async getListadoDestino() {
      if (this.allListadoDestino.length === 0) {
        const body = {
          transactionId: '3853-02',
          requestSystem: 'PORTALFX',
          source: 'FXSYS',
          userId: 'FXUSR',
          branch: '001',
          sourceUserId: 'FXUSR',
          CustomerNumber: '00004635',
          Type: 'CE',
          InternetFolio: '3853',
          AllowOperate: 'S',
          Currency: 'MXN',
          SameBank: false,
          IsBeneficiaryCreditCard: false,
        };
        const response = await this.$store.dispatch('getListaDestino', body);
        const respAux = JSON.parse(JSON.stringify(response));
        if (response) {
          if (Array.isArray(respAux)) {
            this.$set(this, 'allListadoDestino', respAux);
          } else {
            this.$set(this, 'allListadoDestino', [respAux.cuentas]);
          }
          if (this.allListadoDestino.length > 0) {
            this.findCuentaDestino();
          }
        }
      } else {
        this.findCuentaDestino();
      }
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
</style>
