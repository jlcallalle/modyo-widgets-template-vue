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
                        <!-- <td>113456032</td> -->
                        <td>{{ crearOperacionConcertada.OrderID }}</td>
                      </tr>
                      <tr>
                        <td>Local Date</td>
                        <!-- <td>Thu, 02. Dec 2021 15:38:45.968  CDT</td> -->
                        <td>{{ getLocalDate(crearOperacionConcertada.TransactTime) }}</td>
                      </tr>
                      <tr>
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr>
                        <td>Requester / Trader</td>
                        <!-- <td>INVEXCOMP.TEST / INVEXCOMP.Treasurer 1</td> -->
                        <td>{{ crearOperacionConcertada.Account }} </td>
                      </tr>
                      <tr>
                        <td>Provider / Trader</td>
                        <!-- <td>INVEX.TEST / INVEXMM.AutoDealer</td> -->
                        <td>{{ crearOperacionConcertada.SecurityID }} </td>
                      </tr>
                      <tr>
                        <td class="spaceTd" />
                        <td class="spaceTd" />
                      </tr>
                      <tr>
                        <td>Status</td>
                        <!-- <td>Executed</td> -->
                        <td>{{ crearOperacionConcertada.OrdStatus }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Product</td>
                        <!-- <td>FX Spot</td> -->
                        <td> <span v-if="listarOperacion.productCode == 'SPOT'"> FX Spot</span></td>
                      </tr>
                      <tr class="texto-color">
                        <td>Requester Action</td>
                        <td>
                          I
                          <span v-if="crearOperacionConcertada.Side== '1'"> Buy </span>
                          <span v-else-if="crearOperacionConcertada.Side == '2'"> Sell</span>
                          {{ crearOperacionConcertada.Currency }} //
                          <span v-if="crearOperacionConcertada.Side== '1'"> Sell </span>
                          <span v-else-if="crearOperacionConcertada.Side == '2'"> Buy</span>
                          {{ formatOpositive }}
                        </td>
                        <!-- <td>I Buy USD / Sell MXN</td> -->
                      </tr>
                      <tr class="texto-color">
                        <td>Notional Amount</td>
                        <!-- <td>1, 212.00 USD</td> -->
                         <!-- eslint-disable-next-line max-len -->
                        <td> {{ new Intl.NumberFormat('en-US').format(parseInt(formatMonto)) }} {{ crearOperacionConcertada.Currency }}</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Opposite Amount</td>
                        <!-- <td>25, 808.19 MXN</td> -->
                        <!-- eslint-disable-next-line max-len -->
                        <td>{{ new Intl.NumberFormat('en-US').format(parseInt(formatMontoOppositive)) }} {{ formatOpositive }} </td>
                      </tr>
                      <tr class="texto-color">
                        <td>Effective Date</td>
                        <!-- <td>Spot // Mon, 06 Dec 2021</td> -->
                        <td>Spot // {{ getLocalDate(crearOperacionConcertada.SettlDate, true) }}</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Spot Rate</td>
                        <!-- <td>21.29389</td> -->
                        <td>{{ crearOperacionConcertada.LastPx }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="box-two-btn d-flex justify-content-around">
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
                        :selected="destinoSelected === destino.BeneficiaryAccount"
                        :value="destino.BeneficiaryAccount">
                        {{ `${destino.BeneficiaryBank}-**********
                        ${destino.BeneficiaryAccount.toString()
                        .slice(destino.BeneficiaryAccount.toString().length - 4)}` }}
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
                  class="btn btn-primary btn-solicita">
                  Asignar Instrucciones
                </button>
              </div>
            </form>
          </div>
        </div>
        <sidebar v-if="!mostrarInstrucciones" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from './Sidebar.vue';

export default {
  name: 'OperacionConcertada',
  components: { Sidebar },
  data() {
    return {
      mostrarInstrucciones: false,
      listadoOrigen: [],
      listadoDestino: [],
      origenSelected: null,
      destinoSelected: null,
      cuentaOrigen: null,
      cuentaDestino: null,
    };
  },
  computed: {
    ...mapState(['currentView', 'loading']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['crearOperacionConcertada']),
    ...mapState(['listarOperacionConcertada']),
    ...mapState(['listarOperacion']),
    formatOpositive() {
      return this.$store.state.crearOperacionConcertada.Symbol.split('/')[1];
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
    async onSubmit() {
      // console.log(this.crearOperacionConcertada);
    },
    goToOperaciones() {
      this.$store.dispatch('updatePage', 'operacionesFx');
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
    async getListadoDestino() {
      const body = {
        transactionId: '13 - 00003749 - 20210218 11:57:00',
        requestSystem: 'PORTAL',
        source: 'PORTALSYS',
        userId: 'PORTALUSR',
        branch: '001',
        sourceUserId: 'PORTALUSR',
        CustomerAccount: '00101011551',
        SameBank: false,
        IsBeneficiaryCreditCard: false,
      };
      const response = await this.$store.dispatch('getListaDestino', body);
      const respAux = JSON.parse(JSON.stringify(response));
      if (response) {
        if (Array.isArray(respAux.cuentas)) {
          this.$set(this, 'listadoDestino', respAux.cuentas);
        } else {
          this.$set(this, 'listadoDestino', [respAux.cuentas]);
        }
        if (this.listadoDestino.length > 0) {
          this.setDestino({ target: { value: this.listadoDestino[0].BeneficiaryAccount } });
        }
      }
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
