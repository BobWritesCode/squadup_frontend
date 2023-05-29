import React, { useState } from 'react';
import postStyles from '../../styles/Posts.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import appStyles from '../../App.module.css';
import Image from 'react-bootstrap/Image';
import ReactTimeago from 'react-timeago';
import PostEdit from './PostEdit';
import PostDelete from './PostDelete';
import PropTypes from 'prop-types';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

const Post = (props) => {
  const { id, created_at, updated_at, content, image, owner } = props;
  // Get current logged in user.
  const currentUser = useCurrentUser();
  // Check to see if viewing user is profile owner.
  const is_owner = currentUser?.username === owner;

  const [post, setPost] = useState({
    id: id,
    updated_at: updated_at,
    content: content,
    image: image,
  });

  // update target post in dom
  const handleEditPost = (editedPost) => {
    setPost({
      id: editedPost.id,
      updated_at: editedPost.updated_at,
      content: editedPost.content,
      image: editedPost.image,
    });
  };

  // remove target post from dom
  const handleDeletePost = () => {
    document.getElementById(`post-${id}`).style.display = 'none';
  };

  const postButtons = (
    <div className={'d-flex flex-row-reverse'}>
      <div className={`d-inline-flex mb-2 w-0 ${btnStyles.Panel}`}>
        <PostEdit onEditPost={handleEditPost} post={post} />
        <PostDelete onDeletePost={handleDeletePost} post={post} />
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`${postStyles.Container} position-relative`}
        id={`post-${id}`}
      >
        <div>
          <p className={`${postStyles.Created}`}>
            <span className={appStyles.SecondaryText}>Posted: </span>
            <ReactTimeago
              date={created_at}
              minPeriod={10}
              className={appStyles.SecondaryText}
            />

            {created_at !== updated_at ? (
              <>
                <span className={appStyles.SecondaryText}> - Edited: </span>
                <ReactTimeago
                  date={post.updated_at}
                  minPeriod={10}
                  className={appStyles.SecondaryText}
                />
              </>
            ) : (
              ''
            )}
          </p>
        </div>
        <div>
          <p className="text-break">{post.content}</p>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <Image src={post.image} fluid rounded />
        </div>
        {is_owner && postButtons}
      </div>
    </>
  );
};

// Props validation
Post.propTypes = {
  id: PropTypes.number.isRequired,
  created_at: PropTypes.string.isRequired,
  owner: PropTypes.string,
  updated_at: PropTypes.string,
  content: PropTypes.string,
  image: PropTypes.string,
};

export default Post;
