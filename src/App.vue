<template>
  <div
    id="app"
    class="wrapper-widget">
    <operaciones-fx v-if="currentView === 'operacionesFx'" />
    <operacion-concertada v-if="currentView === 'operacionConcertada'" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import OperacionesFx from './components/OperacionesFx.vue';
import OperacionConcertada from './components/OperacionConcertada.vue';

export default {
  name: 'App',
  components: {
    OperacionesFx,
    OperacionConcertada,
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
