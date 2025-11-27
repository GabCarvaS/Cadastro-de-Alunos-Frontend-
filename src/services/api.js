import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://localhost:7085",
});

export default apiClient;