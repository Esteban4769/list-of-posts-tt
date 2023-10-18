import React, { useContext, useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { commentService } from '../services/commentService';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';


export const PostDetails = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setError] = useState(false);
  const [visible, setVisible] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  function loadComments() {
    setLoaded(false);
    setError(false);
    setVisible(false);

    commentService.getPostComments(post.id)
      .then(setComments) 
      .catch(() => setError(true)) 
      .finally(() => setLoaded(true));
  }

  const handleClick = () => {
    if (!user) {
      navigate('/login'); 
    } else {
      setVisible(true);
    }
  };

  const addComment = async ({ email, body }) => {
    try {
      const newComment = await commentService.addComment({
        email,
        body,
        postId: post.id,
      });

      setComments(
        currentComments => [...currentComments, newComment],
      );

      
    } catch (error) {
      setError(true);
    } finally {
      setVisible(false);
    }
  };

  const deleteComment = async (commentId) => {
    setComments(
      currentComments => currentComments.filter(
        comment => comment.id !== commentId,
      ),
    );

    await commentService.deleteComment(commentId);
  };

  useEffect(loadComments, [post.id]);

  return (
    <div className="content">
      <div className="block">
        <h2>
          {`#${post.id}: ${post.title}`}
        </h2>

        <p>
          {post.body}
        </p>
      </div>

      <div className="block">
        {!loaded && (
          <Loader />
        )}

        {loaded && hasError && (
          <div className="notification is-danger">
            Something went wrong
          </div>
        )}

        {loaded && !hasError && comments.length === 0 && (
          <p className="title is-4">
            No comments yet
          </p>
        )}

        {loaded && !hasError && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`}>
                    {comment.email}
                  </a>

                  <button
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => deleteComment(comment.id)}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {loaded && !hasError && !visible && (
          <button
            type="button"
            className="button is-link"
            onClick={handleClick}
          >
            Write a comment
          </button>
        )}

        {loaded && !hasError && visible && (
          <NewCommentForm onSubmit={addComment} />
        )}
      </div>
    </div>
  );
};
