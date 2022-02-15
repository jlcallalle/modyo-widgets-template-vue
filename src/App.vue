<template>
  <div
    id="app"
    class="wrapper-widget">
    <div class="pt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <form action="">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label for="tipoOperacionlSelect">Operación:</label>
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
                      class="btn btn-primary btn-block btn-operacion">Vender USD</a>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label for="tipoDivisasSelect">Par de divisas:</label>
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
                      class="btn btn-primary btn-block btn-operacion">Comprar USD</a>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="col-md-3 offset-md-1">
            <p>FX Spot de noviembre</p>
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
