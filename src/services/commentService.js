import { httpClient } from '../http/httpClient.js';

function getPostComments(postId) {
  return httpClient.get(`/comment/post/${postId}`);
}

function addComment({ postId, email, body }) {
  return httpClient.post('/comment', { postId, email, body });
}

function deleteComment(commentId) {
  return httpClient.delete(`/comment/${commentId}`);
}

export const commentService = { getPostComments, addComment, deleteComment };
