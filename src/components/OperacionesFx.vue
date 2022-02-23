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
                    <option value="fx-forward">
                      FX Forward
                    </option>
                    <option value="fx-block-trade">
                      FX Block Trade
                    </option>
                    <option value="fx-swap">
                      FX Swap
                    </option>
                    <option value="limit-order">
                      Limit Order
                    </option>
                    <option value="market-order">
                      Market Order
                    </option>
                  </select>
                </div>
                <div class="box-rfs">
                  <span>RFS</span>
                </div>
                <div class="box-btn">
                  <a
                    href=""
                    class="btn btn-block btn-outline-operacion">Vender {{ currencySelected }}</a>
                </div>
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio"
                      @change="setCurrencySelected($event)">
                      <template v-for="(currency, index) in currenciesSelected">
                        <option
                          :id="index"
                          :key="index"
                          :selected="currencySelected === currency"
                          :value="currency">
                          {{ currency }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto en {{ labels[currencySelected] }}
                    </div>
                    <currency-input
                      class="form-control input-precio"
                      :options="{
                        currency: currencySelected,
                        currencyDisplay: 'narrowSymbol',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }" />
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
                    class="form-control"
                    :value="currencySelectedId"
                    @change="setCurrenciesOptions($event)">
                    <template v-for="(currency, index) in currenciesOptions">
                      <option
                        :id="index"
                        :key="index"
                        :value="currency.id">
                        {{ currency.firstValue }} \ {{ currency.secondValue }}
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
                    class="btn btn-block btn-outline-operacion active">Comprar {{ currencySelected }}</a>
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
              <a
                href="#;"
                class="btn btn-outline-primary btn-cancelar">Cancelar</a>
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
import { mapState } from 'vuex';
// import RepositoryFactory from '../repositories/RepositoryFactory';
// const invexRepository = RepositoryFactory.get('invex');
import CurrencyInput from './CurrencyInput.vue';

export default {
  name: 'OperacionesFx',
  components: { CurrencyInput },
  data() {
    return {
      monto: 0,
      currencySelected: 'USD',
      labels: {
        USD: 'Dolares',
        EUR: 'Euros',
        MXN: 'Pesos Mexicanos',
        JPY: 'Yenes',
      },
      currenciesOptions: [
        {
          id: '1',
          firstValue: 'USD',
          secondValue: 'MXN',
        },
        {
          id: '2',
          firstValue: 'EUR',
          secondValue: 'USD',
        },
        {
          id: '3',
          firstValue: 'EUR',
          secondValue: 'MXN',
        },
        {
          id: '4',
          firstValue: 'USD',
          secondValue: 'JPY',
        },
      ],
      currenciesSelected: ['USD', 'MXN'],
      currencySelectedId: '1',
    };
  },
  computed: {
    ...mapState(['currentView']),
  },
  mounted() {
    this.setCurrency('4');
  },
  methods: {
    async onSubmit() {
      const getHours = new Date().getHours();
      if (getHours >= 9 && getHours < 18) {
        if (getHours === 16) {
          alert('Servicio temporalmente fuera de servicio, intentar a las 5pm por favor');
        } else {
          alert('Aceptado');
        }
      } else {
        alert('Fuera de horario');
      }
      this.$store.dispatch('updatePage', 'operacionVender');
    },
    setCurrenciesOptions(ev) {
      const auxSelected = this.currenciesOptions.find((currency) => currency.id === ev.target.value);
      this.currenciesSelected = [auxSelected.firstValue, auxSelected.secondValue];
      this.currencySelected = auxSelected.firstValue;
    },
    setCurrencySelected(ev) {
      this.currencySelected = ev.target.value;
    },
    setCurrency(id) {
      const findId = this.currenciesOptions.find((currency) => currency.id === id);
      if (findId) {
        this.currencySelectedId = id;
        this.setCurrenciesOptions({ target: { value: id } });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$brand-invex: #A41D36;
.btn-outline-operacion {
  &.active {
    border-color: $brand-invex;
    color:white;
    background-color: $brand-invex;
    &:hover {
          color: rgba(255, 255, 255, 1);
          background-color: $brand-invex;
          border-color: $brand-invex;
      }
  }
}
</style>
