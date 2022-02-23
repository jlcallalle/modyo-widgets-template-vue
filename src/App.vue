<template>
  <div
    id="app"
    class="wrapper-widget">
    <operaciones-fx v-if="currentView === 'operacionesFx'" />
    <operacion-vender v-if="currentView === 'operacionVender'" />
    <operacion-concertada v-if="currentView === 'operacionConcertada'" />
    <operacion-liquidacion v-if="currentView === 'operacionLiquidacion'" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import OperacionesFx from './components/OperacionesFx.vue';
import OperacionVender from './components/OperacionVender.vue';
import OperacionConcertada from './components/OperacionConcertada.vue';
import OperacionLiquidacion from './components/OperacionLiquidacion.vue';

export default {
  name: 'App',
  components: {
    OperacionesFx,
    OperacionVender,
    OperacionConcertada,
    OperacionLiquidacion,
  },
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  computed: {
    // ...mapState(['posts']),
    ...mapState(['currentView']),
  },
  created() {
    // this.getPosts();
  },
  methods: {
    ...mapActions(['getPosts']),
  },
};
</script>

<style lang="scss">
</style>
