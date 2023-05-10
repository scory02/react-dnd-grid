import React from 'react';
import { useDrag } from 'react-dnd';
import styles from '../styles/Draggable.module.css';

function Draggable({ children, type, item, text, style, hideWhenDrag, state }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [state]
  );

  if (isDragging && hideWhenDrag) {
    return <div ref={drag}></div>;
  }

  return (
    <span
      className={`${styles.draggable} ${isDragging && styles.dragging} ${item.disable && styles.disable}`}
      style={style}
      ref={drag}
    >
      <span>{text}</span>
      <img src={item.url} className={styles.img} />
      {children}
    </span>
  );
}

export default Draggable;
