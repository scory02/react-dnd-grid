import React from "react";
import styles from "../styles/DragGroup.module.css";

function DragGroup({ title, children }) {
  return (
    <div className={styles.group}>
      <h5 className={styles.text}>{title}</h5>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default DragGroup;
