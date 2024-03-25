import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
// import { PinInput, PinInputField, HStack, Input } from '@chakra-ui/react'
// import { PinField } from 'react-pin-input';

import { SongsContext } from '../../context/SongsProvider';
import { FaCircleXmark } from "react-icons/fa6";
import { Modal } from '../../components'
import { excl_mark } from '../../assets';
import { parseISO, getTime, formatDuration } from 'date-fns';

import './FirstEntry.css'

const FirstEntry = ({ handleShowToast }) => {

  const {setUserId, setDataSongs, setStartTime, setEndTime, setPlayingSong, setUserLike} = useContext(SongsContext)
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [userPin, setUserPin] = useState('')
  const [validateMessage, setValidateMessage] = useState('')
  const [pin, setPin] = useState(['', '', '', '']);
  // const { setUserId, userId } = useContext(SongsContext)

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false)
    setIsOpen(true)
    const firstInput = document.getElementById('add__pinField-first');
    if(firstInput) {
      firstInput.focus();
    }
  }

  const fetchSongs = async (userId) => {
    try {
        const response = await axios.get('https://localhost:7087/getsongs', {
            params: {
                userId: userId
            }
        });

        await setUserLike(response.data.userLike)
        await localStorage.setItem('userLike', response.data.userLike)
        console.log(response.data.userLike)
        setDataSongs(response.data.dtos)
    } catch(err) {
        console.log(err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('https://localhost:7087/newuser')
        // setUserId(response.data.id)
        localStorage.setItem('userPin', response.data.userCode)
        setUserPin(response.data.userCode)
      } catch(err) {
        console.log(err)
      }
    }
    const isFirstModalDisplayed = localStorage.getItem('firstModalDisplayed');
    if (!isFirstModalDisplayed) {
      localStorage.setItem('firstModalDisplayed', 'true');
      fetchData();
      setIsFirstModalOpen(true); // Ustawiamy isOpen na true, aby pokazać modal
    }
    if (isFirstModalDisplayed) {
      setIsOpen(true)
    }
  }, []);
  
  // const userPin = localStorage.getItem('userPin')
  // console.log(userPin)
  function formatTime(miliseconds) {
    console.log(miliseconds)
    const seconds= Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  

  const getPlayingSong = async (videoId, dur) => {
    console.log(videoId)
    const apiKey = 'AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk'
    const apiUrl =`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    try {
      const response = await axios.get(apiUrl) 
      const duration = formatTime(dur)
      const title = response.data.items[0].snippet.title
      const songObject = {
        title: title,
        id: videoId,
        duration: `00:0${duration}`
      }
      console.log(songObject)
      setPlayingSong(songObject)
    } catch(err) {
      console.log(err)
    }
  }

  const inputs = useRef([]);

    async function handleInputChange(index, event) {
        const value = event.target.value;

        // Sprawdź, czy wartość spełnia wymagania patternu, jeśli nie, zignoruj ją
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
          const element = document.getElementById('app__firstEntry-form');
          if (element) {
            element.style.opacity = '0.8';
          }
          try {
            const userPinJson = JSON.stringify(pinValues.toUpperCase())
            const response = await axios.post(
              'https://localhost:7087/login',
              `${userPinJson}`, // Dane jako string
              {
               headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            if(response.status === 200) {
              handleClose();
              handleShowToast()
              console.log(response)
              localStorage.setItem('userId', response.data.loginModel.userId)
              setUserId(response.data.loginModel.userId)
              const startDate = response.data.loginModel.lastAddedSongDate
              const startISO = parseISO(startDate);
              const startMil = getTime(startISO);
              const endMil = startMil + 7200000;
              setStartTime(startMil)
              setEndTime(endMil)
              await fetchSongs(response.data.loginModel.userId)
              if(response.data.playingSong.includes('SongId')) {
                const playingSongJSON = response.data.playingSong
                console.log(playingSongJSON)
                const playingSong = JSON.parse(playingSongJSON)
                console.log(playingSong)
                await getPlayingSong(playingSong.SongId, playingSong.Duration)
              } else {
                setPlayingSong('Żadna piosenka nie gra')
              }
              element.style.opacity = '1';
            }
          } catch(err) {
            console.log(err)
            setValidateMessage('Pin jest nieprawidłowy')
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
    <Modal isOpen={isFirstModalOpen} handleClose={handleCloseFirstModal}>
      <div className='app__pinModal'>
        <p className='app__pinModal-startText'>Witaj w oficjalnej aplikacji Radiowęzła Zespołu Szkół Zawodowych w Gostyniu.
          Poniżej znajduje się kod dzięki któremu będziesz miał/a dostęp do wszystkich funkcji aplikacji.
        </p>
        <p className='app__pinModal-pin'>{userPin}</p>
        <p className='app__pinModal-startText'>Jeśli masz słabą pamięć zapisz go gdzieś, chociażby w notatniku! 😊</p>
        <FaCircleXmark onClick={handleCloseFirstModal} className='app__firstEntry-closeBtn'/>
      </div>
    </Modal>
    {!isFirstModalOpen && <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className='app__firstEntry-modal'>
        <img src={excl_mark} alt="exclamation_mark" />
        <p>Aplikacja działa na zasadzie głosowań, uczniowie mogą dodawać piosenki poprzez link (youtube)
        Następnie każdy z dostępem do aplikacji może na daną piosenkę zagłosować
        Oczywiście nie jest to nieograniczone tak więc głosujcie na to co faktycznie chcecie usłyszeć z głośników.
        Po dodaniu piosenki występuje czasowy ogranicznik, po jego upłynięciu można ponownie dodać piosenkę i cieszyć się z dobrodziejstw aplikacji.</p>
        <p>Poniżej wpisz wcześniej wyświetlony kod</p>
        <form className='app__firstEntry-modal_inputCont' id='app__firstEntry-form'>
        {validateMessage && <p style={{color: 'red', fontSize: '28px'}}>{validateMessage}</p>}
        <div className='pin_inputs-box'>
          {[0, 1, 2, 3].map((index) => (
            <input
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
        {/* <FaCircleXmark onClick={handleClose} className='app__firstEntry-closeBtn'/> */}
      </div>
    </Modal>}
    </>
  );
};
 
export default FirstEntry;