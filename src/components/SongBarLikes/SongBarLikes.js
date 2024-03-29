import React, { useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';

// import { heart, anm_heart } from '../../assets'; 
import { SongsContext } from '../../context/SongsProvider';

import './SongBarLikes.css'

const SongBarLikes = ({likes, id}) => {

  // const ref = useRef(null)

  //const userLike = localStorage.getItem('userLike')

  // const toggleHeart = () => {
  //   ref.current.classList.toggle('heart-active')
  //   setIsLiked(prev => !prev)
  // }

  const { setDataSongs, userId, userLike, setUserLike } = useContext(SongsContext)
  const [isButtonActive, setIsButtonActive] = useState(true)
  const heartRef = useRef(null);

  const fetchSongs = async () => {
    try {
        const response = await axios.get('https://radiowezelbackendwindows.azurewebsites.net/getsongs', {
            params: {
                userId: userId
            }
        });
        localStorage.setItem('userLike', response.data.userLike)
        setUserLike(response.data.userLike)
        setDataSongs(response.data.dtos)
    } catch(err) {
        console.log(err)
    }
  }

  const removeLike = async (songRemoveId) => {
    try {
      const response = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${songRemoveId}?userId=${userId}`)
      if (response.ok) {
        fetchSongs();
      } else {
        //console.clear()
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  }

  const addElseLike = async () => {
    try {
      const response = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/likesong/${id}?userId=${userId}`)
      if (response.ok) {
        fetchSongs();
      } else {
        //console.clear()
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  }

  const addLike = async () => {
    //const userSongLike = localStorage.getItem('userLike');
    //console.clear()
    setIsButtonActive(false)
    setUserLike(id)
    //setUserLike(id)
    if (!userLike || userLike === 'null') {
        try {
            const response = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/likesong/${id}?userId=${userId}`)
            if (response.ok) {
              fetchSongs();
            } else {
              //console.clear()
            }
        } catch (err) {
            console.log('Błąd: ', err);
        }
    } else if (userLike && String(id) === String(userLike)) {
      setUserLike('')
        try {
          removeLike(id);
        } catch (error) {
            console.log('Błąd: ', error);
        }
    } else if (userLike && String(id) !== String(userLike)) {
        try {
            const response1 = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${userLike}?userId=${userId}`)
            if (response1.ok) {
              fetchSongs();
            } else {
              //console.clear()
            }
            await addElseLike();
        } catch (error) {
            console.log('Błąd: ', error);
        }
    }
    setIsButtonActive(true)
}

  return ( 
    <div className='app__songBarLikes'>
      <div ref={heartRef} className={`anm_heart-mainBox ${String(id) === String(userLike) ? 'heart-active' : ''}`} onClick={isButtonActive ? addLike : null}>
        <div className='anm_heart-box'>
          <span className='heartBtn'></span>
        </div>
      </div>
      <p className='p_likes-amount'>{likes}</p>
    </div>
  );
}
 
export default SongBarLikes;