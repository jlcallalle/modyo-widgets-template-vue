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
    modelValue: Number, // Vue 2: value
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
      () => props.modelValue, // Vue 2: props.value
      (value) => {
        setValue(value);
      },
    );
    return { inputRef };
  },
};
</script>
