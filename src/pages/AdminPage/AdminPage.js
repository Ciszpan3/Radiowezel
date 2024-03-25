import React, { useState } from 'react';

import { AdminSong, Modal } from '../../components';

import './AdminPage.css'
import axios from 'axios';

const AdminPage = () => {

  const [isOpen, setIsOpen] = useState(true)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginned, setIsLoggined] = useState(false)
  const [validateMessage, setValidateMessage] = useState('')
  const [songsToCheck, setSongsToCheck] = useState([])

  const handleClose = () => {
    setIsOpen(false)
  }

  const fetchSongsToCheck = async (adminCode) => {
    try {
      const response = axios.get(`https://localhost:7087/songstocheck?adminCode=${adminCode}`)

      return response
    } catch(err) {
      return err
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = {
      login: login,
      password: password
    }
    console.log(data)
    try {
      const response = await axios.post('https://localhost:7087/adminlogin', JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      localStorage.setItem('adminId', response.data.code)
      localStorage.setItem('hangfireCode', response.data.hangfireDashboardHeaderCode)
      console.log(localStorage)
      if(response.status === 200) {
        setIsLoggined(true)
        setIsOpen(false)
        fetchSongsToCheck(response.data.code)
          .then(res => {
            console.log(res)
            setSongsToCheck(res.data)
          })
          .catch(err => {
            console.log(err)
          })
      }
      // localStorage.setItem('userId', response.data.id)
    } catch(err) {
      setValidateMessage('Login lub hasło jest niepoprawne')
      console.log(err)
    }
  }

  // const hangfireLogin = () => {
  //   const hangfireCode = localStorage.getItem('hangfireCode')

  //   try {
  //     const response = axios.get('https://localhost:7087/hangfire', {
  //       headers: {
  //         'Authorization': `${hangfireCode}`
  //       }
  //     })

  //     console.log(response)
  //   } catch(err) {
  //     console.log(err)
  //   }
      // const requestOptions = {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authentication': `${hangfireCode}`
      //   }
      // };
      
      // const testowyLink = 'https://loclahost:7087/hangfire';

      // fetch(testowyLink, requestOptions)
      // .then(response => {
      //   console.log(response);
      // })
      // .catch(error => {
      //   console.error('Błąd:', error);
      // });
      // Tutaj zastąp 'testowy_link' właściwym adresem URL
  
      // Otwiera link w nowym oknie
      // window.open(testowyLink, '_blank');

  //}

  return ( 
    <>
      <Modal isOpen={isOpen} handleClose={handleClose}>
        <form className='app__admin-login' onSubmit={handleSubmit}>
          <p>Zaloguj się do panelu admina</p>

          <div className='app__admin-login_inputBoxes'>
            {validateMessage && <p className='app__admin-valmsg'>{validateMessage}</p>}
            <div className='app__admin-login_inputBox'>
              <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder='Login'/>
            </div>
            <div className='app__admin-login_inputBox'>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
            </div>
          </div>

          <button type='submit'>Zaloguj się</button>
        </form>
      </Modal>
      {isLoginned && 
        <div className='app__admin'>
          <h1>AdminPage</h1>
          {/* <button onClick={hangfireLogin}>cos</button> */}

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