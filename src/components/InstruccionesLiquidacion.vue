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
              <label for="inputProducto">Cuenta Origen</label>
              <select class="form-control">
                <option> MXN INVEX - 1254483 </option>
              </select>
            </div>
            <div class="form-group col-12 col-md-4">
              <label for="inputFecha">Cuenta Destino</label>
              <select class="form-control">
                <option> MXN INVEX - 1254483 </option>
              </select>
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
          <div class="subtitle-sec test-small mb-4 ml-5 ">
            <span class="font-weight-bold">Spot Rate:</span>
            <span>21,50000</span>
          </div>
          <vue-good-table
            :columns="columns"
            :rows="rows"
            :select-options="{
              enabled: true,
              selectOnCheckboxOnly: true,
              selectionInfoClass: 'custom-class',
              selectionText: 'rows selected',
              clearSelectionText: 'clear',
              disableSelectInfo: true,
              selectAllByGroup: true,
            }" />
          <div class="subtitle-sec test-small mt-4">
            <span class="sub-with">Avg. Rate:</span>
            <span>21, 4960333</span>
          </div>
          <div class="subtitle-sec test-small mt-2">
            <span class="sub-with">P&amp;L:</span>
            <span>0.003</span>
          </div>
          <div class="box-two-btn d-flex justify-content-around">
            <a
              href="#;"
              class="btn btn-outline-primary btn-cancelar">Realizar otra operación</a>
            <button
              type="submit"
              class="btn btn-primary btn-solicita">
              Asignar Instrucciones
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InstruccionesLiquidacion',
  data() {
    return {
      loading: false,
      columns: [
        {
          label: 'Date',
          field: 'date',
        },
        {
          label: 'Maturity Date',
          field: 'maturity',
        },
        {
          label: 'Notional',
          field: 'notional',
        },
        {
          label: 'Points',
          field: 'points',
        },
        {
          label: 'Rate',
          field: 'rate',
        },
        {
          label: 'PTMMM Points',
          field: 'PTMMM',
        },
      ],
      rows: [
        {
          id: 1, date: 'Today', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
        {
          id: 2, date: 'Tomorrow', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
        {
          id: 3, date: 'Susan', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
        {
          id: 4, date: 'SpotNext', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
        {
          id: 5, date: 'SpotNext', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
        {
          id: 6, date: 'Tomorrow', maturity: 'mar, 20-11-2021', notional: '1.00', points: 85.000, rate: 21.4915000, PTMMM: 115.100,
        },
      ],
    };
  },
  computed: {
    ...mapState(['currentView', 'loading']),
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
