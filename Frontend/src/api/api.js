import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6000/api"
});

export default API;