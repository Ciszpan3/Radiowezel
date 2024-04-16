import React, { useState, useRef } from 'react';

import { AdminSong, Modal } from '../../components';

import './AdminPage.css'
import axios from 'axios';

const AdminPage = () => {

  const [isOpen, setIsOpen] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoginned, setIsLoggined] = useState(false)
  const [validateMessage, setValidateMessage] = useState('')
  const [songsToCheck, setSongsToCheck] = useState([])
  const [pin, setPin] = useState('')

  const handleClose = () => {
    setIsOpen(false)
  }
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const fetchSongsToCheck = async (adminCode) => {
    try {
      const response = axios.get(`http://34.116.238.114:8080/songstocheck?adminCode=${adminCode}`)

      return response
    } catch(err) {
      return err
    }
  }

  const handleSendCode = async () => {
    try { 
      const response = await axios.post('http://34.116.238.114:8080/sendadminemail')
      if(response.status === 200) {
        setIsLoginModalOpen(true)
        setIsOpen(false)
      }
    } catch(err) {
      console.error(err)
    }
  }

  const inputs = useRef([]);

  async function handleInputChange(index, event) {
    const value = event.target.value;
    if(validateMessage) {
      setValidateMessage('')
    }

    if (!value.match(/[0-9a-zA-Z]/)) {
      return;
    }
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    const isPinFull = newPin.filter(value => value !== '')
    let pinValues = '';
    newPin.forEach(value => {
      pinValues = pinValues + value
    });
    if(isPinFull.length === 4) {
      const code = pinValues.toUpperCase()
      try {
      const response = await axios.post(`http://34.116.238.114:8080/adminlogin?code=${code}`)
      localStorage.setItem('adminId', response.data)
      if(response.status === 200) {
        setIsLoggined(true)
        setIsLoginModalOpen(false)
        fetchSongsToCheck(response.data)
          .then(res => {
            setSongsToCheck(res.data)
          })
          .catch(err => {
            
          })
      }
    } catch(err) {
      setValidateMessage('Kod jest niepoprawny')
    }
    }

    // Przechodzi do następnego pola, jeśli wprowadzono wartość i nie jest to ostatnie pole
    if (value && index < 3) {
        inputs.current[index + 1].focus();
    }
}

function handleKeyDown(index, event) {
  if (event.key === 'Backspace' && pin[index] !== '') {
    const newPin = [...pin];
    newPin[index] = '';
    setPin(newPin);
  } if (event.key === 'Backspace' && index > 0 && pin[index] === '') {
    inputs.current[index - 1].focus();
    const newPin = [...pin];
    newPin[index - 1] = '';
    setPin(newPin);
  }
}

  return ( 
    <>
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <form className='app__admin-login'>
          <p>Wyślij kod na maila, używając przycisku poniżej</p>
          {validateMessage && <p className='app__admin-valmsg'>{validateMessage}</p>}
          {/* <div className='app__admin-login_inputBoxes'>
            {validateMessage && <p className='app__admin-valmsg'>{validateMessage}</p>}
            <div className='app__admin-login_inputBox'>
              <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Login'/>
            </div>
            <div className='app__admin-login_inputBox'>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
            </div>
          </div>

          <button type='submit'>Zaloguj się</button> */}
          <button type='button' onClick={handleSendCode}>Wyślij kod</button>
        </form>
      </Modal>
      <Modal isOpen={isLoginModalOpen} handleClose={handleCloseLoginModal}>
        <form className='app__admin-login'>
          <p>Zaloguj się do panelu admina</p>
          {validateMessage && <p className='app__admin-valmsg'>{validateMessage}</p>}

          <div className='pin_inputs-box'>
          {[0, 1, 2, 3].map((index) => (
            <input
              style={{backgroundColor: 'lightgray', color: 'black', borderColor: 'black'}}
              key={index}
              ref={(el) => inputs.current[index] = el}
              id={`add__pinField-${index}`}
              className="add__pinField"
              type="text"
              maxLength={1}
              value={pin[index]}
              onChange={(e) => handleInputChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        </form>
      </Modal>
      {isLoginned && 
        <div className='app__admin'>
          <h1>AdminPage</h1>

          <div className='app__admin-songs'>
            {songsToCheck.length > 0 && songsToCheck.map(song => (
              <AdminSong
                setSongsToCheck={setSongsToCheck}
                key={song.id}
                title={song.title}
                url={song.url}
                duration={song.duration}
                id={song.id}
              />
            ))}
          </div>
        </div>
      }
    </>
  );
}
 
export default AdminPage;