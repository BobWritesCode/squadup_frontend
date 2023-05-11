import React, { useState } from 'react';
import postStyles from '../../styles/Posts.module.css';
import btnStyles from '../../styles/Buttons.module.css';
import appStyles from '../../App.module.css';
import Image from 'react-bootstrap/Image';
import ReactTimeago from 'react-timeago';
import PostEdit from './PostEdit';

const Post = (props) => {
  const { id, created_at, updated_at, content, image } = props;


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
  const handleDeletePost = (editedPost) => {}

  const postButtons = (
    <div
      className={`d-flex flex-row m-2 position-absolute top-0 end-0 ${btnStyles.Panel}`}
    >
      <PostEdit onEditPost={handleEditPost} post={post} />
    </div>
  );

  return (
    <>
      <div className={`${postStyles.Container}`}>
        <div>
        <p className={`${postStyles.Created}`}>
              <span>Posted: </span><ReactTimeago date={created_at} minPeriod={10}/>
              {created_at !== updated_at ? updated_at : ''}
            </p>
        </div>
        <div>
        <p>{content}</p>
        </div>
        <div className='d-flex justify-content-center mb-3'>
          <Image src={image} fluid rounded />
        </div>
      </div>
  </>
  )
}

export default Post;
