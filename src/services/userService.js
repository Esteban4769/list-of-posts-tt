import { httpClient } from '../http/httpClient.js';

function getAll() {
  return httpClient.get('/users')
}

function getById(userId) {
  return httpClient.get(`/users/${userId}`);
}

export const userService = { getAll, getById };
