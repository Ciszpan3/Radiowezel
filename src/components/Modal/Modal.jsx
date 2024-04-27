import React, { useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';
import { SongsContext } from '../../context/SongsProvider';

import './Modal.css'

const Modal = ({children, isOpen, handleClose, isLoginModal}) => {

  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)
  const {setIsRefreshVisible, setRefreshCountdown} = useContext(SongsContext)

  useEffect(() => {
    if(!modalRef.current) {
      return;
    };

    const { current: modal } = modalRef

    if(isOpen) {
      previousActiveElement.current = document.activeElement
      modal.showModal()
    } else if(previousActiveElement.current) {
      modal.close()
      previousActiveElement.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const { current: modal } = modalRef

    const handleCancel = (e) => {
      e.preventDefault()
      handleClose()
    }

    modal.addEventListener('cancel', handleCancel)

    return () => {
      modal.removeEventListener('cancel', handleCancel)
    }
  }, [handleClose])


  useEffect(() => {
    if (isLoginModal) {
        setTimeout(() => {
            setIsRefreshVisible(true);
        }, 90000);
    }
  }, [isLoginModal, setIsRefreshVisible]);

  return ReactDOM.createPortal(( 
    <dialog className='app__modal' ref={modalRef}>
      {children}
    </dialog>
  ), document.body);
}
 
export default Modal;