import axios from "axios";

const instance = axios.create({
  baseURL: "http://3.71.80.89:3000",
});


export default instance;
