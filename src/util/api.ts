import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  //baseURL: 'http://192.168.10.227:8080',
  //baseURL: 'https://buzucamacariapi-buzucamacari.koyeb.app'
})
