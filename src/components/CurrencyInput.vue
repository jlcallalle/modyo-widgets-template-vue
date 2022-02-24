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
    // eslint-disable-next-line vue/require-default-prop
    value: Number, // Vue 2: value
    // eslint-disable-next-line vue/require-default-prop
    options: Object,
  },
  setup(props) {
    const { inputRef, setOptions, setValue } = useCurrencyInput(props.options);
    watch(
      () => props.options,
      (options) => {
        setOptions(options);
      },
    );
    watch(
      () => props.value, // Vue 2: props.value
      (value) => {
        console.log('value', value);
        setValue(value);
      },
    );
    return { inputRef };
  },
};
</script>
