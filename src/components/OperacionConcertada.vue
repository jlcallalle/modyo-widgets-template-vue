<template>
  <div class="widget-operacion-concertada">
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-lg-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div class="row">
              <h2 class="subtitle mb-4">
                Operación Concertada
              </h2>
              <code style="display:none"> macpdeClientLogeo {{ mapClientLogeo }} </code>
              <code style="display:none"> {{ crearOperacionConcertada }} </code>
              <code style="display:none">{{ listarOperacionConcertada }}</code>
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
                        <td>{{ crearOperacionConcertada.TransactTime }}</td>
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
                          {{ crearOperacionConcertada.Currency }}
                        </td>
                        <!-- <td>I Buy USD / Sell MXN</td> -->
                      </tr>
                      <tr class="texto-color">
                        <td>Notional Amount</td>
                        <!-- <td>1, 212.00 USD</td> -->
                        <td>{{ crearOperacionConcertada.OrderQty }} {{ crearOperacionConcertada.Currency }}</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Opposite Amount</td>
                        <!-- <td>25, 808.19 MXN</td> -->
                        <td>{{ crearOperacionConcertada.Price }}</td>
                      </tr>
                      <tr class="texto-color">
                        <td>Effective Date</td>
                        <!-- <td>Spot // Mon, 06 Dec 2021</td> -->
                        <td>{{ crearOperacionConcertada.SettlDate }}</td>
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
        <sidebar />
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
    };
  },
  computed: {
    ...mapState(['currentView']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['crearOperacionConcertada']),
    ...mapState(['listarOperacionConcertada']),
    ...mapState(['listarOperacion']),
  },
  methods: {
    /* async onSubmit() {
      this.$store.dispatch('updatePage', 'operacionVender');
    }, */
    goToOperaciones() {
      this.$store.dispatch('updatePage', 'operacionesFx');
    },
    goToLiquidacion() {
      this.$store.dispatch('updatePage', 'operacionLiquidacion');
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
