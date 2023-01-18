import axios from 'axios'// ** Store & Actions
const qs = require('qs')
import { SSO_CLIENT_ID } from "../../configs/browser"
import jwtDecode from 'jwt-decode'

//import { useDispatch } from 'react-redux'

import jwtDefaultConfig from '@src/@core/auth/jwt/jwtDefaultConfig'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    //const dispatch = useDispatch()
    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        if (config.login) {
          return config
        }

        // ** Get token from localStorage
        const accessToken = this.getToken()
        const tenant = this.getTenant()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }

        if (tenant) {
          config.headers['X-Tenant-Id'] = tenant
        }

        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        if (config.login) {
          return
        }

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axios(originalRequest))
            })
            window.location.replace("/login")
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getTenant() {
    return localStorage.getItem(this.jwtConfig.storageTenantName)
  }

  setTenant(value) {
    return localStorage.setItem(this.jwtConfig.storageTenantName, value)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  decodeToken (token) {
    const decoded = jwtDecode(token)
    return {
      email:decoded.email,
      lastName:decoded.family_name,
      firstName:decoded.given_name,
      fullName:decoded.name,
      id:decoded.sub,
      username:decoded.email,
      tenants:decoded.app_metadata?.tenants
    }
  }

  async login({email, password}) {
    const postData = {
      username:email,
      password,
      client_id:SSO_CLIENT_ID,
      grant_type:'password'
    }

    const res = await axios.post(this.jwtConfig.loginEndpoint, qs.stringify(postData), {login:true})

    const token = this.decodeToken(res.data.access_token)
    const userData = {
      ...token,
      role: 'admin',
      ability: [
        {
            action: 'manage',
            subject: 'all'
        }
      ]
    }

    const tenant = Object.keys(token.tenants)[0]

    return {
      data: {
        userData,
        tenant,
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token
      }
    }
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }
}
