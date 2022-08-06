import cookie from 'cookie'
import {
  decodeValue,
  encodeQuery, encodeValue,
  generateRandomString, isUnset,
  parseQuery, _base64UrlEncode,
  _sha256
} from '~/modules/social/utils'

export default function(ctx, inject) {
  const providers = <%= JSON.stringify(options, null, 2) %>

  const social = {
    // redirect to social provider
    redirect: async (name, state = '', params = {}) => {
      const provider = {
        clientId: providers[name].clientId,
        responseType: providers[name].responseType,
        redirectUri: providers[name].redirectUri,
        scope: providers[name].scope,
        authorization: providers[name].authorization,
        codeChallengeMethod: providers[name].codeChallengeMethod
      }

      const scope = Array.isArray(provider.scope) ? provider.scope.join(' ') : provider.scope

      const queryParams = {
        protocol: 'oauth2',
        response_type: provider.responseType,
        client_id: provider.clientId,
        redirect_uri: provider.redirectUri,
        scope,
        state,
        code_challenge_method: provider.codeChallengeMethod,
        ...params
      }

      if (queryParams.code_challenge_method) {
        switch (queryParams.code_challenge_method) {
          case 'plain':
          case 'S256': {
            const state = generateRandomString()
            social.setCookie(name + '.pkce_state', state)
            const codeVerifier = generateRandomString()
            social.setCookie(
              name + '.pkce_code_verifier',
              codeVerifier
            )
            const codeChallenge = await this.pkceChallengeFromVerifier(
              codeVerifier,
              queryParams.code_challenge_method === 'S256'
            )
            queryParams.code_challenge = window.encodeURIComponent(codeChallenge)
          }
            break
          case 'implicit':
          default:
            break
        }
      }

      social.setCookie(name + '.state', queryParams.state)

      const url = provider.authorization + '?' + encodeQuery(queryParams)

      window.location.replace(url)
    },

    // redirect for OAuth 1.0a
    redirectOAuth1: async (name, apiUrl, params = {}) => {
      const provider = {
        clientId: providers[name].clientId,
        redirectUri: providers[name].redirectUri,
        authorization: providers[name].authorization
      }
      try {
        const { data } = await ctx.app.$axios.$get(apiUrl)
        const queryParams = {
          oauth_token: data.oauth_token,
          ...params
        }

        const url = provider.authorization + '?' + encodeQuery(queryParams)

        window.location.replace(url)
      } catch (err) {
        console.log(err)
      }
    },

    // handle redirect
    handleRedirect: (name) => {
      // Callback flow is not supported in server side
      if (process.server) {
        return
      }

      const hash = parseQuery(ctx.route.hash.substr(1))
      const parsedQuery = Object.assign({}, ctx.route.query, hash)
      // Validate state
      const state = social.getCookie(name + '.state')
      social.setCookie(name + '.state', null)
      if (state && parsedQuery.state !== state) {
        return
      }
      let codeVerifier

      const codeChallengeMethod = providers[name].codeChallengeMethod
      if (codeChallengeMethod !== 'implicit') {
        codeVerifier = social.getCookie(
          name + '.pkce_code_verifier'
        )
        social.setCookie(
          name + '.pkce_code_verifier',
          null
        )
      }
      let data = {
        provider: name,
        code: parsedQuery.code,
        code_verifier: codeVerifier,
        state: parsedQuery.state
      }
      if (name === 'twitter') {
        data = {
          provider: name,
          oauth_token: parsedQuery.oauth_token,
          oauth_verifier: parsedQuery.oauth_verifier,
          state: parsedQuery.state
        }
      }

      return data
    },

    async pkceChallengeFromVerifier(v, hashValue) {
      if (hashValue) {
        const hashed = await _sha256(v)
        return _base64UrlEncode(hashed)
      }
      return v // plain is plain - url-encoded by default
    },

    setCookie(
      key,
      value,
      options = {}
    ) {
      const _prefix = 'social'
      const _key = _prefix + key
      const _options = Object.assign({}, options)
      const _value = encodeValue(value)

      // Unset null, undefined
      if (isUnset(value)) {
        _options.maxAge = -1
      }

      // Accept expires as a number for js-cookie compatibility
      if (typeof _options.expires === 'number') {
        _options.expires = new Date(Date.now() + _options.expires * 864e5)
      }

      const serializedCookie = cookie.serialize(_key, _value, _options)

      if (process.client) {
        // Set in browser
        document.cookie = serializedCookie
      } else if (process.server && ctx.res) {
        // Send Set-Cookie header from server side
        const cookies = (ctx.res.getHeader('Set-Cookie')) || []
        cookies.unshift(serializedCookie)
        ctx.res.setHeader(
          'Set-Cookie',
          cookies.filter(
            (v, i, arr) =>
              arr.findIndex((val) =>
                val.startsWith(v.substr(0, v.indexOf('=')))
              ) === i
          )
        )
      }

      return value
    },

    getCookies() {
      const cookieStr = process.client
        ? document.cookie
        : ctx.req.headers.cookie

      return cookie.parse(cookieStr || '') || {}
    },

    getCookie(key) {
      if (process.server && !ctx.req) {
        return
      }

      const _key = 'social' + key

      const cookies = social.getCookies()

      const value = cookies[_key]
        ? decodeURIComponent(cookies[_key])
        : undefined

      return decodeValue(value)
    },

    removeCookie(key, options) {
      social.setCookie(key, undefined, options)
    }
  }
  // Inject social to the context as $social
  ctx.$social = social
  inject('social', social)
}
