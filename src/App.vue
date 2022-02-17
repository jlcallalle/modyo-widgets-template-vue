<template>
  <div
    id="app"
    class="wrapper-widget">
    <operaciones-fx v-if="currentView === 'operacionesFx'" />
    <operacion-vender v-if="currentView === 'operacionVender'" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import OperacionesFx from './components/OperacionesFx.vue';
import OperacionVender from './components/OperacionVender.vue';

export default {
  name: 'App',
  components: {
    OperacionesFx,
    OperacionVender,
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
img {
  max-width: 100%;
}

</style>
