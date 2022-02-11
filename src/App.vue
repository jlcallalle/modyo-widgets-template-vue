<template>
  <div id="app">
    <div class="pt-5">
      <div class="container">
        <div class="row">
          <div class="col-md-2" />
          <div class="col-md-8 text-center">
            <h1 class="mb-3 font-weight-bold">
              {{ title }}
            </h1>
            <h1 class="mb-3">
              {{ siteName }}
            </h1>
            <h2 class="h4 mb-4">
              Welcome to the Minimal theme.
              This is an HTML widget that you can modify in the Page Builder section.
              You can also modify the style in the Template Builder section.
            </h2>
            <a
              class="btn btn-primary btn-lg"
              href="https://www.modyo.com">Go to Modyo</a>
            <a
              class="btn btn-outline-primary ml-2 btn-lg"
              href="https://docs.modyo.com">Read the docs</a>
          </div>
        </div>
        <div class="mt-2">
          <img
            src="https://cloud.modyocdn.com/uploads/2addb891-7316-4cfb-882a-f0fd9745bf3a/original/homeMinimal.png"
            alt="modyo">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import liquidParser from './liquid/liquidParser';

export default {
  name: 'App',
  data() {
    return {
      year: new Date().getFullYear(),
      siteName: liquidParser.parse('{{site.name | replace: "my", "your" | upcase}}'),
      title: 'Modyo Vue Invex',
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
