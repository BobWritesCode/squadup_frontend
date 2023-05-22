import React from 'react';
import styles from '../styles/Avatar.module.css';

const Avatar = ({ src, maxWidth = '100%', maxHeight = '400px', text = '' }) => {
  return (
    <span>
      <img
        className={`${styles.Avatar} m-0`}
        src={src}
        style={{ maxWidth: maxWidth, maxHeight: '400px' }}
        alt="Avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;
