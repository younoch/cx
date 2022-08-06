const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const isUnset = (o) => typeof o === 'undefined' || o === null;

export function parseQuery(queryString) {
  const query = {};
  const pairs = queryString.split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

export function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&');
}

export function encodeValue(val) {
  if (typeof val === 'string') {
    return val;
  }
  return JSON.stringify(val);
}

export function decodeValue(val) {
  // Try to parse as json
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (_) {}
  }

  // Return as is
  return val;
}

export function generateRandomString() {
  const array = new Uint32Array(28); // this is of minimum required length for servers with PKCE-enabled
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join(
    ''
  );
}

export function _sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

export function _base64UrlEncode(str) {
  // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
  // btoa accepts chars only within ascii 0-255 and base64 encodes them.
  // Then convert the base64 encoded to base64url encoded
  //   (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
