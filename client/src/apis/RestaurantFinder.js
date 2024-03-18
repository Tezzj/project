import axios from 'axios';

//NODE_ENV = 'development'
//NODE_ENV = 'production'

// if we are in production, baseurl = /api/v1/restaurants
// else baseurl = http://localhost:3001/api/v1/restaurants

//const baseURL = "http://localhost:3001/api/v1/restaurants"

const baseURL = process.env.NODE_ENV === 'production' ? "api/v1/restaurants" : "http://localhost:3001/api/v1/restaurants"

export default axios.create({
   // baseURL: baseURL           // if the key and the value are sme in js, we can remove either one of them, it will not change anything
   baseURL,
});