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
                        <template v-for="(currency, index) in currenciesSelected">
                          <option
                            :id="index"
                            :key="index"
                            :value="currency">
                            {{ currency }}
                          </option>
                        </template>
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
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label for="tipoDivisasSelect">Par de divisas:</label>
                    <select
                      id="tipoDivisasSelect"
                      class="form-control"
                      @change="setCurrenciesOptions($event)">
                      <template v-for="(currency, index) in currenciesOptions">
                        <option
                          :id="index"
                          :key="index"
                          :value="currency.id">
                          {{ currency.firstValue }}\{{ currency.secondValue }}
                        </option>
                      </template>
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
                  <div class="box-monto input-group">
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
import RepositoryFactory from './repositories/RepositoryFactory';

const invexRepository = RepositoryFactory.get('invex');
export default {
  name: 'App',
  data() {
    return {
      year: new Date().getFullYear(),
      currenciesOptions: [],
      currenciesSelected: [],
    };
  },
  computed: {
    ...mapState(['posts']),
  },
  created() {
    this.getPosts();
  },
  mounted() {
    this.getCurrencies();
  },
  methods: {
    ...mapActions(['getPosts']),
    async getCurrencies() {
      try {
        const currencies = await invexRepository.getCurrencies();
        this.currenciesOptions = currencies;
        this.currenciesSelected = [currencies[0].firstValue, currencies[0].secondValue];
      } catch (e) {
        console.log('error:', e);
      }
    },
    setCurrenciesOptions(ev) {
      const currencyS = this.currenciesOptions.find((currency) => currency.id === ev.target.value);
      this.currenciesSelected = [currencyS.firstValue, currencyS.secondValue];
    },
  },
};
</script>

<style lang="scss">
img {
  max-width: 100%;
}

</style>
