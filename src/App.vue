<template>
  <div
    id="app"
    class="wrapper-widget">
    <div class="widget-operaciones-fx">
      <div class="container">
        <div class="row">
          <div class="col-md-8 box-operaciones">
            <form action="">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label
                      for="tipoOperacionlSelect"
                      class="title-group">Operación:</label>
                    <select
                      id="tipoOperacionlSelect"
                      class="form-control">
                      <option>FX Spot</option>
                      <option>2</option>
                      <option>3</option>
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
                  <div class="box-divisas">
                    <div class="input-group">
                      <div class="input-group-prepend group-select">
                        <button
                          class="btn dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          USD
                        </button>
                        <div class="dropdown-menu">
                          <a
                            class="dropdown-item"
                            href="#">USD</a>
                          <a
                            class="dropdown-item"
                            href="#">MXN</a>
                          <a
                            class="dropdown-item"
                            href="#">EUR</a>
                        </div>
                        <div class="title-group">
                          Divisa
                        </div>
                      </div>
                      <div class="box-input-row">
                        <div class="title-group">
                          Monto en dólares
                        </div>
                        <input
                          type="text"
                          class="form-control input-divisa"
                          aria-label="Text input with dropdown button">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
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
                  <div class="box-divisas">
                    <div class="input-group">
                      <div class="input-group-prepend group-select">
                        <button
                          class="btn dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false">
                          Today
                        </button>
                        <div class="dropdown-menu">
                          <a
                            class="dropdown-item"
                            href="#">Today</a>
                          <a
                            class="dropdown-item"
                            href="#">Tomorrow</a>
                          <a
                            class="dropdown-item"
                            href="#">SpotNext</a>
                        </div>
                        <div class="title-group title-fecha">
                          Fecha de Liquidación
                        </div>
                      </div>
                      <div class="box-input-row">
                        <input
                          type="date"
                          value="2022-01-10"
                          class="form-control input-fecha"
                          aria-label="Text input with dropdown button">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-two-btn d-flex justify-content-around">
                <a
                  href=""
                  class="btn btn-outline-primary btn-cancelar">Cancelar</a>
                <a
                  href=""
                  class="btn btn-primary btn-solicita">Solicitar Precio</a>
              </div>
            </form>
          </div>
          <div class="col-md-4 box-sidebar-spot mt-4 mt-md-0">
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  computed: {
    ...mapState(['posts']),
  },
  created() {
    this.getPosts();
  },
  methods: {
    ...mapActions(['getPosts']),
  },
};
</script>

<style lang="scss">
img {
  max-width: 100%;
}

</style>
