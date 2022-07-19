<template>
  <div
    id="app"
    class="wrapper-widget">
    <operaciones-fx v-if="currentView === 'operacionesFx'" />
    <operacion-concertada v-if="currentView === 'operacionConcertada'" />
    <instrucciones-liquidacion v-if="currentView === 'instruccionesLiquidacion'" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import OperacionesFx from './components/OperacionesFx.vue';
import OperacionConcertada from './components/OperacionConcertada.vue';
import InstruccionesLiquidacion from './components/InstruccionesLiquidacion.vue';

export default {
  name: 'App',
  components: {
    OperacionesFx,
    OperacionConcertada,
    InstruccionesLiquidacion,
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  computed: {
    ...mapState(['currentView']),
  },
};
</script>

<style lang="scss">
</style>
