import { format, formatDistanceToNowStrict, isToday, parseISO } from 'date-fns';
import Vue from 'vue';

export function avatar(name) {
  let TextAvatar = '';
  const array = name.split(' ');
  array.forEach((item) => {
    TextAvatar += item.substring(0, 1);
  });
  return TextAvatar;
}

export function toDayDateTimeString(value) {
  if (value) {
    return format(new Date(value), 'E, MMM dd, yyyy - hh:mm:ss a');
  } else {
    return null;
  }
}

export function toFormattedDateString(value) {
  return format(new Date(value), 'dd MMM, yyyy');
}

export function formattedDateTime(value) {
  return format(parseISO(value), 'dd MMM, yyyy hh:mm:ss');
}

export function pureDateFormat(value) {
  const date = parseISO(value);
  const today = isToday(date);

  if (today) {
    return format(date, 'h:mm a');
  } else {
    return format(date, 'MMM dd');
  }
}

export function humanReadable(value) {
  return formatDistanceToNowStrict(new Date(value), {
    includeSeconds: true,
    addSuffix: true,
  });
}

export function humanDateTime(value) {
  let date = formatDistanceToNowStrict(new Date(value), {
    includeSeconds: true,
    addSuffix: false,
  });
  if (date.includes('month')) {
    date = formatDistanceToNowStrict(new Date(value), {
      includeSeconds: true,
      addSuffix: false,
      unit: 'day',
    });
  }
  date = date.replace('seconds', 's');
  date = date.replace('second', 's');
  date = date.replace('minutes', 'm');
  date = date.replace('minute', 'm');
  date = date.replace('hours', 'h');
  date = date.replace('hour', 'h');
  date = date.replace('days', 'd');
  date = date.replace('day', 'd');
  date = date.replace('years', 'y');
  date = date.replace('year', 'y');
  date = date.replace(' ', '');
  return date;
}

export function formattedMonthDay(value) {
  return format(parseISO(value), 'MMM dd');
}

export function formattedDay(value) {
  return format(parseISO(value), 'd');
}

export function formattedTime(value) {
  return format(parseISO(value), 'h:mm a');
}

export function formattedLongMonthDayYear(value) {
  return format(parseISO(value), 'LLL dd, yyyy');
}

export function datetime(value) {
  const diff = formatDistanceToNowStrict(new Date(value));
  const diffArray = diff.split(' ');
  const singleC = diffArray[1];
  return `${diffArray[0]} ${singleC}`;
}

const filters = {
  toDayDateTimeString,
  formattedDateTime,
  toFormattedDateString,
  avatar,
  datetime,
  humanDateTime,
  formattedMonthDay,
  formattedTime,
  formattedDay,
  formattedLongMonthDayYear,
  pureDateFormat,
  humanReadable,
};

export default filters;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
