import React, { useContext, useRef } from 'react';
import axios from 'axios';

// import { heart, anm_heart } from '../../assets'; 
import { SongsContext } from '../../context/SongsProvider';

import './SongBarLikes.css'

const SongBarLikes = ({likes, id}) => {

  const { setDataSongs, userId, userLike, setUserLike, isButtonActive, setIsButtonActive } = useContext(SongsContext)
  const heartRef = useRef(null);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/getsongs?userId=${userId}`);
      localStorage.setItem('userLike', response.data.userLike)
      setUserLike(response.data.userLike)
      setDataSongs(response.data.dtos)
    } catch (err) {
      
    }    
  }

  const removeLike = async (songRemoveId) => {
    // try {
    //   const response = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${songRemoveId}?userId=${userId}`)
    //   if (response.ok) {
    //     await fetchSongs();
    //   }
    // } catch (err) {
    //   console.error('Wystąpił błąd:', err);
    // }
    try {
      const response = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${songRemoveId}?userId=${userId}`, {
        method: 'POST'
      });
    
      if (response.ok) {
        fetchSongs();
      } else {
        throw new Error('Błąd sieciowy: ' + response.status);
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
    
  }

  const addElseLike = async () => {
    try {
      const response = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/likesong/${id}?userId=${userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchSongs();
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  };

  const addLike = async () => {
    setIsButtonActive(false)
    setUserLike(id)
    if (!userLike || userLike === 'null') {
        try {
            const response = await axios.post(`https://radiowezelbackendwindows.azurewebsites.net/likesong/${id}?userId=${userId}`)
            if (response.ok) {
              await fetchSongs();
            }
        } catch (err) {

        }
    } else if (userLike && String(id) === String(userLike)) {
      setUserLike('')
        try {
          removeLike(id);
        } catch (error) {

        }
    } else if (userLike && String(id) !== String(userLike)) {
      try {
        const response1 = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${userLike}?userId=${userId}`, {
          method: 'POST'
        });

        if (response1.ok) {
          fetchSongs();
          await addElseLike();
        }
      } catch (error) {

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