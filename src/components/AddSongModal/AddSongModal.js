import React, { useState, useContext } from "react";
import axios from "axios";
import { parse } from 'iso8601-duration';

import { SongsContext } from "../../context/SongsProvider";
import Modal from "../Modal/Modal";
import { RxCross2 } from "react-icons/rx";
import { FaYoutube } from "react-icons/fa6";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { BeatLoader } from 'react-spinners';

import './AddSongModal.css'

// Klucz AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk

const AddSongModal = ({isOpen, handleClose}) => {

    const { songs, addSong, handleShowToast, setStartTime, setEndTime } = useContext(SongsContext)
  const [value, setValue] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [validateMessage, setValidateMessage] = useState('')
    const [songAddedMessage, setSongAddedMessage] = useState('')

//  const [shortSongsList, setShortSongsList] = useState([])

    const getSongDuration = async (videoId) => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    id: videoId,
                    part: 'contentDetails',
                    key: 'AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk'
                }
            });
            const isoDuration = response.data.items[0].contentDetails.duration
            const durationObject = parse(isoDuration);

            // Pobierz wartości minut i sekund z obiektu
            let minutes = durationObject.minutes || 0;
            let seconds = durationObject.seconds || 0;
            if(seconds < 10) {
                seconds = `0${seconds}`
            }
            if(minutes > 5) {
              setValidateMessage('Podana piosenka jest za długa')
              return
            }
            const duration = `00:0${minutes}:${seconds}`

            return duration
        } catch(error) {
            console.log(error)
        }
    }

    const getSongViews = async (videoId) => {
      try {
          const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
              params: {
                  id: videoId,
                  part: 'statistics',
                  key: 'AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk'
              }
          });
          const viewsCount = response.data.items[0].statistics.viewCount;

          if(viewsCount < 50000) {
            setValidateMessage('Podana piosenka jest za mało popularna')
            return
          }
      } catch(error) {
          console.log(error)
      }
  }

    const fetchSongData = async (e) => {
      setDisabled(true)
        setValidateMessage('')
        setSongAddedMessage('')

        const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            let videoId;
            const match = value.match(pattern);
            if (match) {
                videoId = match[1]
            } else {
                videoId = null
            }
            const isSongAlreadyAdded = songs.filter(song => song.videoId === videoId)
            if(isSongAlreadyAdded.length > 0) {
              setValidateMessage('Podana piosenka jest już na liście')
              setDisabled(false)
              return
            }
            const apiKey = 'AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk'
            const apiUrl =`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
        try {
            const response = await axios.get(apiUrl)
            if(response.data.items[0].snippet.categoryId !== "10") {
                setValidateMessage('Podany link nie jest piosenką')
            } else {
              getSongViews(response.data.items[0].id)
              getSongDuration(response.data.items[0].id)
                const title = response.data.items[0].snippet.title
                let duration;
                await getSongDuration(response.data.items[0].id)
                  .then(dur => {
                    duration = dur
                  })
                  .catch(error => {
                    console.error(error);
                  })
                const songObject = {
                  title: title,
                  duration: duration,
                  url: value,
                  addedById: localStorage.getItem('userId')
                }
                await addSong(JSON.stringify(songObject))
                  .then(msg => {
                    if(msg === 'Piosenka została dodana') {
                      handleShowToast(msg)
                      console.log(localStorage)
                      handleClose();
                      const startMil = Date.now()
                      const endMil = startMil + 7200000;
                      setStartTime(startMil)
                      setEndTime(endMil)
                    } else {
                      setValidateMessage(msg)
                    }
                  })
                  .catch(error => {
                    console.error(error);
                  })
            }
        } catch(error) {
            setValidateMessage('Podany link jest nieprawidłowy')
            console.log(error)
        }
        setDisabled(false)
    }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return ( 
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <form className="app__addModal" onSubmit={handleSubmit}>
        <div className="app__addModal-top">
          <RxCross2 onClick={handleClose} className="app__addModal-cross"/>
        </div>
        {validateMessage ? <p className="app__addModal-valMsg">{validateMessage}</p> : null}
        {songAddedMessage ? <p className="app__addModal-songAddMsg">{songAddedMessage}</p> : null}
        <div className="app__addModal-mainBox">
            <div className="app__addModal-content">
                <FaYoutube className="app__addModal-yt"/>
              <input type="text" value={value} onChange={handleChange} placeholder="Podaj Link"/>
            </div>
            {!disabled ? <button className="app__addModal-button" type="submit">
              <MdOutlineLibraryAdd className="app__addModal-add"/>
              <p onClick={fetchSongData}>Dodaj Piosenkę</p>
            </button> : <BeatLoader color="#ffffff" loading={true}/>}
        </div>
      </form>
    </Modal>
  );
}
 
export default AddSongModal;