<template>
  <div class="widget-operaciones-fx">
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-lg-8 box-operaciones">
          <form @submit.prevent="onSubmit">
            <div v-if="currentView === 'login'">
              <p>Store CurrentView {{ $store.state.currentView }}</p>
            </div>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label
                    for="tipoOperacionlSelect"
                    class="title-group">Operación:</label>
                  <select
                    id="tipoOperacionlSelect"
                    class="form-control">
                    <option value="fx-spot">
                      FX Spot
                    </option>
                    <option value="USD">
                      FX Forward
                    </option>
                    <option value="USD">
                      FX Block Trade
                    </option>
                    <option value="USD">
                      FX Swap
                    </option>
                    <option value="USD">
                      Limit
                    </option>
                    <option value="USD">
                      Market
                    </option>
                  </select>
                </div>
                <div class="box-rfs">
                  <span>RFS</span>
                </div>
                <div class="box-btn">
                  <a
                    href=""
                    class="btn btn-outline-success btn-block btn-operacion">Vender USD</a>
                </div>
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio">
                      <option value="USD">
                        USD
                      </option>
                      <option
                        value="MXN"
                        selected>
                        MXN
                      </option>
                      <option value="EUR">
                        EUR
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto en dólares
                    </div>
                    <input
                      type="text"
                      class="form-control input-precio">
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
                    class="form-control">
                    <option>USD / MXN</option>
                    <option>MXN / USD</option>
                  </select>
                </div>
                <div class="box-rfs">
                  <span>RFS</span>
                </div>
                <div class="box-btn">
                  <a
                    href=""
                    class="btn btn-outline-success btn-block btn-operacion">Comprar USD</a>
                </div>
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de Liquidación
                    </div>
                    <select
                      name="select"
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
                      type="date"
                      value="2022-01-10"
                      class="form-control input-fecha">
                  </div>
                </div>
              </div>
            </div>
            <div class="box-two-btn d-flex justify-content-around">
              <button
                class="btn btn-outline-primary btn-cancelar">
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-solicita">
                Solicitar Precio
              </button>
            </div>
          </form>
        </div>
        <div class="col-md-12 col-lg-4 box-sidebar-spot mt-4 mt-lg-0">
          <div class="box-spot-mes">
            <details open>
              <summary>FX Spot de noviembre</summary>
              <ol>
                <li><span>USD</span> $$3,000,000.00 </li>
                <li><span>MXN</span> $3,000,000.00</li>
              </ol>
            </details>
          </div>
          <div class="box-spot-mes">
            <details>
              <summary>Línea de pago anticipado</summary>
              <ol>
                <li>Lorem ipsum dolor sit amet.</li>
              </ol>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OperacionesFx',
  methods: {
    async onSubmit() {
      this.$store.dispatch('updatePage', 'operacionVender');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
img {
  display: block;

  max-width: 100%;
  height: 300px;
}

h3 {
  height: 2em;
}

p {
  height: 300px;
  overflow: hidden;
}
</style>
