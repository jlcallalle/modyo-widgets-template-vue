<template>
  <div class="widget-operacion-liquidación">
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
                        <td>113456032</td>
                      </tr>
                      <tr>
                        <td>Local Date</td>
                        <td>Thu, 02. Dec 2021 15:38:45.968  CDT</td>
                      </tr>
                      <tr>
                        <td>Requester / Trader</td>
                        <td>INVEXCOMP.TEST / INVEXCOMP.Treasurer 1</td>
                      </tr>
                      <tr>
                        <td>Provider / Trader</td>
                        <td>INVEX.TEST / INVEXMM.AutoDealer</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>Executed</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Product</td>
                        <td>FX Spot</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Requester Action</td>
                        <td>I Buy USD / Sell MXN</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Notional Amount</td>
                        <td>1, 212.00 USD</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Opposite Amount</td>
                        <td>25, 808.19 MXN</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Effective Date</td>
                        <td>Spot // Mon, 06 Dec 2021</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Spot Rate</td>
                        <td>21.29389</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="col-md-12 col-lg-4 box-sidebar-spot">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OperacionLiquidacion',
  data() {
    return {
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
  },
  mounted() {
    this.getListadoOrigen();
  },
  methods: {
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
      console.log('response ->', respAux);
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
</style>
