import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';


export const NewCommentForm = ({ onSubmit }) => {
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    body: false,
  });

  const [{ body }, setValues] = useState({
    body: '',
  });

  const { user } = useContext(AuthContext);

  const clearForm = () => {
    setValues({
      body: '',
    });

    setErrors({
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
    });

    if (!body) {
      return;
    }

    setSubmitting(true);

    await onSubmit({ email: user.email, body });

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
