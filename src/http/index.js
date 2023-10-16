import axios from 'axios';

export function createClient() {
  return axios.create({
    baseURL: "https://user-posts-api.onrender.com",
    withCredentials: true,
  });
}
