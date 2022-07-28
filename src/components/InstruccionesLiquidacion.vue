<template>
  <div class="widget-operacion-concertada">
    <div
      v-if="loading"
      class="invex-loader">
      <div class="invex-loader_spinner" />
    </div>
    <h1 class="mb-4 title-widget">
      Operaciones <span> FX </span>
    </h1>
    <div class="container container-widget">
      <div class="row">
        <div class="box-consultar">
          <div class="title-sec">
            <h2 class="mb-4 title-widget text-center">
              Asignación de instrucciones de liquidación
            </h2>
          </div>
          <div class="subtitle-sec pd-10">
            Seleccionar cuentas
          </div>
          <div class="form-row mt-2 row-instrucciones">
            <div class="form-group col-12 col-md-4 ">
              <label for="inputProducto">Cuenta Origen:</label>
              <select
                id="tipoCuentalSelect"
                class="form-control"
                @change="setOrigen($event)">
                <option
                  v-for="(origen, index) in listadoOrigen"
                  :id="index"
                  :key="index"
                  :selected="origen ? origenSelected === origen.customerAccount : false"
                  :value="origen ? origen.customerAccount: ''">
                  {{ origenTxt(origen) }}
                </option>
              </select>
            </div>
            <div class="form-group col-12 col-md-4">
              <label for="inputFecha">Cuenta Destino</label>
              <select
                id="tipoCuentalSelect"
                class="form-control"
                :disabled="origenSelected === null"
                @change="setDestino($event)">
                <option
                  v-for="(destino, index) in listadoDestino"
                  :id="index"
                  :key="index"
                  :selected="destinoSelected === destino.BeneficiaryAccount"
                  :value="destino.BeneficiaryAccount">
                  {{ destinoTxt(destino) }}
                </option>
              </select>
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
            </div>
            <div class="form-group col-12 col-md-4 col-alta-cuenta">
              <select class="form-control">
                <option selected="selected">
                  Alta de cuenta Nueva
                </option>
                <option value="destino">
                  Destino
                </option>
                <option value="origen">
                  Origen
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="box-consultar mt-4">
          <div class="title-sec">
            <h2 class="mb-4 title-widget text-center">
              Operaciones
            </h2>
          </div>
          <vue-good-table
            ref="liquidacion"
            :columns="columns"
            :rows="blockTradeRows"
            :select-options="{
              enabled: true,
              selectOnCheckboxOnly: true,
              disableSelectInfo: true,
            }" />
          <!-- <vue-good-table
            :columns="columns"
            :rows="blockTradeRows"
            :select-options="{
              enabled: true,
              selectOnCheckboxOnly: true,
              selectionInfoClass: 'custom-class',
              selectionText: 'rows selected',
              clearSelectionText: 'clear',
              disableSelectInfo: true,
              selectAllByGroup: true,
            }"
            @on-selected-rows-change="selectionChanged" /> -->
          <div class="subtitle-sec test-small mt-4">
            <span class="monto-title">Precio Promedio:</span>
            <span class="monto-cantidad">{{ precioPromedio }}</span>
          </div>
          <div class="box-two-btn d-flex justify-content-around">
            <a
              href="#;"
              class="btn btn-outline-primary btn-cancelar"
              @click.prevent="otraOperacion">Realizar otra operación</a>
            <button
              type="submit"
              :disabled="destinoSelected === null || destinoSelected === ''"
              class="btn btn-primary btn-solicita"
              @click.prevent="evenInstrucciones">
              Asignar Instrucciones
            </button>
          </div>
        </div>
      </div>
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
import CustomModal from './CustomModal.vue';

export default {
  name: 'InstruccionesLiquidacion',
  components: { CustomModal },
  data() {
    return {
      columns: [
        {
          label: 'Fecha',
          field: 'fechaSeleccionada',
          sortable: false,
        },
        {
          label: 'Notional',
          field: 'nocional',
          sortable: false,
        },
        {
          label: 'Tipo de Cambio',
          field: 'price',
          sortable: false,
        },
      ],
      blockTradeRows: null,
      customModalProps: {
        title: 'No se han asignado instrucciones',
        message: '¿Deseas salir sin asignar instrucciones de liquidación a tus operaciones?',
        type: 'warning',
        open: false,
        btnAcceptText: 'Asignar ahora',
        btnCancelText: 'Asignar despues',
        btnCloseHide: false,
      },
      allListadoDestino: [],
      destinoCurrency: '',
      origenCurrency: '',
      listadoOrigen: [],
      listadoDestino: [],
      origenSelected: null,
      destinoSelected: null,
      precioPromedio: 982.4512,
      asignados: [],
      // selectedRowsLength: 0,
      // selectedRows: [],
      // responsesAssingAccounts: [],
    };
  },
  computed: {
    ...mapState(['currentView', 'loading']),
    ...mapState(['userData']),
  },
  async mounted() {
    this.getDataTable();
    await this.getListadoOrigen();
    await this.getListadoDestino();
    // await this.$store.dispatch('generarTokenSeguridad', {
    //   CUI: this.mapClientLogeo.CUI,
    //   internetFolio: this.mapClientLogeo.internetFolio,
    // });
  },
  methods: {
    otraOperacion() {
      this.$store.dispatch('updatePage', 'operacionesFx');
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
      const concretadaData = await this.$store.state.cerrarOperacion.data;
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
        const current = new Date();
        const body = {
          transactionId: `${this.userData.data.user360T}-${current.getFullYear()}${current.getMonth() + 1}${current.getDate()}${current.getHours()}${current.getMinutes()}${current.getSeconds()}`,
          requestSystem: 'PORTAL',
          source: 'PORTALSYS',
          userId: 'PORTALUSR',
          branch: '001',
          sourceUserId: 'PORTALUSR',
          CustomerNumber: this.userData.data.CUI,
          Type: 'CE',
          InternetFolio: this.userData.data.internetFolio,
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
        if (this.listadoOrigen.length === 0) this.returnMsgOrigen();
        return this.listadoOrigen.length > 0;
      } catch (e) {
        this.returnMsgOrigen();
        return false;
      }
    },
    async getListadoDestino() {
      try {
        const current = new Date();
        const body = {
          transactionId: `${this.userData.data.user360T}-${current.getFullYear()}${current.getMonth() + 1}${current.getDate()}${current.getHours()}${current.getMinutes()}${current.getSeconds()}`,
          requestSystem: 'PORTALFX',
          source: 'FXSYS',
          userId: 'FXUSR',
          branch: '001',
          sourceUserId: 'FXUSR',
          CustomerNumber: this.userData.data.CUI,
          Type: 'CE',
          InternetFolio: this.userData.data.internetFolio,
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
      const currencyDivisa = await this.getLogicCurrencies(true);
      this.customModalProps.title = 'No se encontraron cuentas destino';
      this.customModalProps.message = `No existen cuentas destino registradas para la divisa ${currencyDivisa} para poder realizar la asignación de las cuentas a la operación`;
      this.customModalProps.btnAcceptText = 'Aceptar';
      this.customModalProps.btnCloseHide = true;
      this.customModalProps.btnAcceptFunc = () => {
        this.mostrarInstrucciones = false;
        this.closeModal();
      };
      this.customModalProps.open = true;
    },
    async returnMsgOrigen() {
      const currencyDivisa = await this.getLogicCurrencies();
      this.customModalProps.title = 'No se encontraron cuentas origen';
      this.customModalProps.message = `No existen cuentas origen registradas para la divisa ${currencyDivisa} para poder realizar la asignación de las cuentas a la operación`;
      this.customModalProps.btnAcceptText = 'Aceptar';
      this.customModalProps.btnCloseHide = true;
      this.customModalProps.btnAcceptFunc = () => {
        this.mostrarInstrucciones = false;
        this.closeModal();
      };
      this.customModalProps.open = true;
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
    async evenInstrucciones() {
      const concretadaData = this.$store.state.cerrarOperacion.data;
      const current = new Date();
      this.asignados = this.arrayWithNoDuplicates([...this.$refs.liquidacion.selectedRows, ...this.asignados], 'originalIndex');
      this.asignados.forEach((row) => this.assingAccounts(row, concretadaData, current));
      this.showModalAssing();
    },
    arrayWithNoDuplicates(array, field) {
      const arrayWithoutNoDuplicates = array.filter((value, index, self) => index === self.findIndex((t) => (
        t[field] === value[field]
      )));
      return arrayWithoutNoDuplicates;
    },
    async showModalAssing() {
      const assigned = this.asignados.length;
      this.customModalProps.title = 'Confirmación de instrucciones';
      this.customModalProps.message = assigned > 1 ? 'Se han asignado cuentas a estas operaciones.' : 'Se han asignado cuentas a esta operación.';
      this.customModalProps.btnAcceptText = 'Aceptar';
      this.customModalProps.type = 'confirm';
      this.customModalProps.btnCloseHide = true;
      this.customModalProps.btnAcceptFunc = () => {
        this.asignados.forEach((asignado) => {
          this.$set(this.blockTradeRows[asignado.originalIndex], 'vgtDisabled', true);
          this.$set(this.blockTradeRows[asignado.originalIndex], 'vgtSelected', false);
        });
        if (this.asignados.length === this.blockTradeRows.length) {
          this.closeModal();
          this.$store.dispatch('updatePage', 'operacionesFx');
        }
        this.closeModal();
        // this.blockTradeRows = null;
        // localStorage.removeItem('subOps');
        // localStorage.removeItem('finalPrice');
        // this.$store.dispatch('updatePage', 'operacionesFx');
      };
      this.customModalProps.open = true;
    },
    async assingAccounts(row, concretadaData, current) {
      const findIndexAssign = this.asignados.findIndex((asignado) => asignado.originalIndex === row.originalIndex);
      if (!this.asignados[findIndexAssign].completado) {
        try {
          const body = {
            transactionId: `${this.userData.data.user360T}-${current.getFullYear()}${current.getMonth() + 1}${current.getDate()}${current.getHours()}${current.getMinutes()}${current.getSeconds()}`,
            requestSystem: 'FX',
            orderID: concretadaData.OrderID,
            debitAccount: this.origenSelected,
            creditAccount: '',
            settlAccount: this.destinoSelected,
            blockid: parseInt(row.LegRefID.split('-')[1], 10),
          };
          this.listadoDestino.forEach((destino) => {
            if (destino.BeneficiaryAccount === this.destinoSelected) {
              body.creditAccount = `${destino.customerAccount}`;
            }
          });
          await this.$store.dispatch('actualizarOperacion', body);
          this.asignados[findIndexAssign].completado = true;
        } catch (err) {
          this.showModal = true;
          // Ocurrio un error, se debe manejar
        }
      }
    },
    getDataTable() {
      const blockTradeRows = JSON.parse(localStorage.getItem('subOps'));
      this.blockTradeRows = blockTradeRows.map((blockTradeRow) => {
        const fechaSeleccionada = this.dateFormat(blockTradeRow.LegSettlDate);
        return {
          nocional: blockTradeRow.LegQty,
          fechaSeleccionada,
          price: blockTradeRow.LegPrice,
          LegRefID: blockTradeRow.LegRefID,
        };
      });
      this.precioPromedio = localStorage.getItem('finalPrice');
    },
    dateFormat(date) {
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    },
    // selectionChanged(event) {
    //   this.selectedRowsLength = event.selectedRows.length;
    //   this.selectedRows = event.selectedRows;
    // },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
