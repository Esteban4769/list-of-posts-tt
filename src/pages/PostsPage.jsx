import { useContext, useEffect, useState } from "react";

import { PostsList } from "../components/PostsList.jsx"
import { postService } from "../services/postService.js";
import { Loader } from "../components/Loader.jsx";
import { PostDetails } from "../components/PostDetails.jsx"
import classNames from "classnames";
import { NewPostForm } from "../components/NewPostForm.jsx";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [hasError, setError]  = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleNewPostAdd = ({ title, body}) => {
    postService.addPost({ userId: user.id, title, body })

    setIsAddingPost(false);

    loadPosts();
  };

  const handlePostSelection = (post) => {
    if (isAddingPost) {
      setIsAddingPost(false);
    }

    if (post) {
      setSelectedPostId(post.id);
    } else {
      setSelectedPostId(null);
    }
  };

  const getSelectedPost = () => {
    return posts.find(post => post.id === selectedPostId);
  };

  const togglPostForm = () => {
    if (selectedPostId) {
      setSelectedPostId(null);
    }

    if (!user) {
      navigate('/login');

      return;
    }
    setIsAddingPost(!isAddingPost);
  };

  const loadPosts = async() => {
    setLoading(true);

    try {
      const postsFromApi = await postService.getAll();

      setPosts(postsFromApi);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [])

  return (
   
    <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                {loading && (
                  <Loader />
                )}

                {!loading && hasError && (
                  <div
                    className="notification is-danger"
                  >
                    Something went wrong!
                  </div>
                )}

                {!loading && !hasError && posts.length === 0 && (
                  <div className="notification is-warning">
                    No posts yet
                  </div>
                )}
                

                <div className="columns is-centered">
                  <div className="column is-half has-text-centered">
                    <button
                      type="button"
                      className="button is-link"
                      onClick={togglPostForm}
                    >     
                     {isAddingPost? "Close": "Add a post"}
                    </button>
                  </div>
                </div>
               
                {!loading && !hasError && posts.length > 0 && (
                  <PostsList 
                    posts={posts} 
                    selectedPostId={selectedPostId} 
                    onPostSelected={handlePostSelection}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPostId && !isAddingPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {(selectedPostId && !isAddingPost) && (
                <PostDetails post={getSelectedPost()} />
              )}
            </div>
          </div>

          <div
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': !selectedPostId && isAddingPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {(!selectedPostId && isAddingPost) && (
                <NewPostForm onSubmit={handleNewPostAdd}/>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}