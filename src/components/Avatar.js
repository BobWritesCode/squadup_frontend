import React from 'react';
import styles from '../styles/Avatar.module.css';
import PropTypes from 'prop-types';



const Avatar = ({ src, maxWidth = '100%', maxHeight = '400px', text = '' }) => {
  return (
    <span>
      <img
        className={`${styles.Avatar} m-0`}
        src={src}
        style={{ maxWidth: maxWidth, maxHeight }}
        alt="Avatar"
      />
      {text}
    </span>
  );
};

// Props validation
Avatar.propTypes = {
  src: PropTypes.string,
  maxWidth: PropTypes.string,
  maxHeight: PropTypes.string,
  text: PropTypes.string,
};

export default Avatar;
