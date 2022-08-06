/* eslint-disable camelcase */
import Vue from 'vue';
import {
  required,
  email,
  max,
  min,
  numeric,
  required_if,
  alpha,
  alpha_dash,
  confirmed,
} from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate';

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

extend('required', {
  ...required,
  message: 'The {_field_} field is required',
});

extend('required_if', {
  ...required_if,
  message: 'The {_field_} field is required',
});

extend('max', {
  ...max,
  message: 'The {_field_} field may not be greater than {length} characters',
});

extend('min', {
  ...min,
  message: 'The {_field_} field must be at least {length} characters',
});

extend('email', {
  ...email,
  message: 'The {_field_} field must be a valid email',
});

extend('numeric', {
  ...numeric,
  message: 'The {_field_} field may only contain numeric characters',
});

extend('alpha', {
  ...alpha,
  message: 'The {_field_} field may only contain alphabetic characters',
});

extend('alpha_dash', {
  ...alpha_dash,
  message:
    'The {_field_} field may contain alpha-numeric characters as well as dashes and underscores',
});

extend('confirmed', {
  ...confirmed,
  message: 'The {_field_} field confirmation does not match',
});

extend('mobile', (value) => {
  const regex = /(^([+]{1}[8]{2}|0088)?(01)(3|7|8|6|9|5)\d{8})$/;
  const result = regex.exec(value);

  if (result != null && result[0] === value) {
    return true;
  }

  return 'The {_field_} field must be a valid mobile number.';
});

extend('url', (value) => {
  let url;

  try {
    url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return 'The {_field_} field must be a valid url.';
  }
});

extend('decimal', {
  validate(value, { decimals = '*', separator = '.' } = {}) {
    // if is 0.
    if (Number(decimals) === 0) {
      return /^-?\d*$/.test(value);
    }

    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    );

    if (!regex.test(value)) {
      return false;
    }

    const parsedValue = parseFloat(value);

    // eslint-disable-next-line
    return parsedValue === parsedValue;
  },
  params: ['decimals', 'separator'],
  message:
    'The {_field_} field must be numeric and may contain {decimals} decimal points.',
});
