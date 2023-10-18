import { httpClient } from '../http/httpClient.js';

function getAll() {
  return httpClient.get('/post/all')
}

function addPost({ userId, title, body }) {
  return httpClient.post('/post', { userId, title, body });
}

export const postService = { getAll, addPost };