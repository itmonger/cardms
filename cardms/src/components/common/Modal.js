import React from 'react';
import { styles } from '../../styles/styles';

const Modal = ({ children, onClose }) => {
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;