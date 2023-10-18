import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';


export const NewPostForm = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    title: false,
    body: false,
  });

  const [{ body, title }, setValues] = useState({
    title: '',
    body: '',
  });

  const { user } = useContext(AuthContext);

  if (!user) {
    navigate('/login');
  }

  const clearForm = () => {
    setValues({
      title: '',
      body: '',
    });

    setErrors({
      title: false,
      body: false,
    });
  };

  const handleChange = (event) => {
    const { name: field, value } = event.target;

    setValues(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: false }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrors({
      body: !body,
      title: !title,
    });

    if (!body || !title) {
      return;
    }

    setSubmitting(true);

    await onSubmit({ title, body });

    setSubmitting(false);
    setValues(current => ({ ...current, body: '' }));
  };

  return (
    <form onSubmit={handleSubmit} onReset={clearForm}>
      <div className="field">
        <label className="label" htmlFor="comment-author-email">
          Author Email:&nbsp;
          <span className='has-text-link'>
            {user.email}
          </span>
        </label>
      </div>

      <div className="field">
        <label className="label" htmlFor="post">
          Title
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="title"
            id="post-title"
            placeholder="Post title"
            className={classNames('input', { 'is-danger': errors.title })}
            value={title}
            onChange={handleChange}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {errors.title && (
            <span
              className="icon is-small is-right has-text-danger"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {errors.title && (
          <p className="help is-danger">
            Name is required
          </p>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={classNames('textarea', { 'is-danger': errors.body })}
            value={body}
            onChange={handleChange}
          />
        </div>

        {errors.body && (
          <p
            className="help is-danger"
          >
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={classNames('button', 'is-link', {
              'is-loading': submitting,
            })}
          >
            Add
          </button>
        </div>

        <div className="control">
          <button type="reset" className="button is-link is-light">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
