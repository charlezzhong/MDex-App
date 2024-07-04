import axios from 'axios';
import { encryptPayload, decryptResponse } from './encryption';
import { event } from './eventEmitter';

// import { baseUrl } from "./Constant";

// axios.defaults.baseURL = baseUrl

// interceptors
axios.interceptors.request.use(
    async (config) => {
    if (config.data) {
      // if route is /upload skip encryption
      if (config.url && config.url.includes('upload')) {
        return config;
      }
      config.data = await encryptPayload(config.data);
    }
    return config;
  },
  error => {
    console.log('rinterceptor error', error)
    return Promise.reject(error);
  },
);
axios.interceptors.response.use(
  async (response) => {
    if (response.data && response.data.iv) {
      response.data = await decryptResponse(response.data);
    }
    // console.log('returning response', response.data)
    return response;
  },
  async(error) => {
    // if status is 400 logout the context
    console.log('rinterceptor error', error?.response?.status, error?.response?.status == 401)
    if(error?.response?.status == 401) {
      event.emit('logout')
    }
     
    return Promise.reject(error);
  },
);

export default axios;
