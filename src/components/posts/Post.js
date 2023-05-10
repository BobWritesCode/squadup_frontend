import React from 'react'
import postStyles from '../../styles/Posts.module.css'
import Image from 'react-bootstrap/Image'
import ReactTimeago from 'react-timeago'

const Post = (props) => {
  const {
    created_at,
    updated_at,
    content,
    image,
  } = props

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

export default Post
