import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, width = '100%', text = '' }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src}
        width={width}
        alt="Avatar"
      />
      {text}
    </span>
  );
};

export default Avatar;
