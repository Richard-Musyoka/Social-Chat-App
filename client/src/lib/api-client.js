
import axios from "axios";

 export const apiClient= axios.create({
    // Make sure this matches your API server URL
    baseURL: 'http://localhost:3001',  // Make sure this matches your API server URL
  headers: {
    'Content-Type': 'application/json',
  },
});