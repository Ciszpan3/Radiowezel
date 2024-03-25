import React from 'react';

import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = ({ message }) => (
  <div className='toast_box'>
    <p>{message}</p>
  </div>
)

export default ToastComponent;