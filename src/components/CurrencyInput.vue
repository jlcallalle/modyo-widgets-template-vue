<template>
  <input
    ref="inputRef"
    type="text">
</template>
<script>
import { useCurrencyInput } from 'vue-currency-input';
import { watch } from '@vue/composition-api';

export default {
  name: 'CurrencyInput',
  props: {
    value: Number, // Vue 2: value
    options: Object,
  },
  setup(props) {
    const { inputRef, setOptions } = useCurrencyInput(props.options);
    watch(
      () => props.options,
      (options) => {
        console.log('entre a watch', options);
        setOptions(options);
      },
    );
    return { inputRef };
  },
};
</script>
