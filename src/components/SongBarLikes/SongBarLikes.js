import React, { useContext, useState } from 'react';
import axios from 'axios';

// import { heart, anm_heart } from '../../assets'; 
import { SongsContext } from '../../context/SongsProvider';

import './SongBarLikes.css'

const SongBarLikes = ({likes, id}) => {

  // const ref = useRef(null)

  const userLike = localStorage.getItem('userLike')

  // const toggleHeart = () => {
  //   ref.current.classList.toggle('heart-active')
  //   setIsLiked(prev => !prev)
  // }

  const { setDataSongs, userId } = useContext(SongsContext)
  const [isButtonActive, setIsButtonActive] = useState(true)

  const fetchSongs = async () => {
    try {
        const response = await axios.get('https://radiowezelbackendwindows.azurewebsites.net/getsongs', {
            params: {
                userId: userId
            }
        });
        localStorage.setItem('userLike', response.data.userLike)

        setDataSongs(response.data.dtos)
    } catch(err) {
        console.log(err)
    }
  }

  const removeLike = async (songRemoveId) => {
    try {
      const response = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${songRemoveId}?userId=${userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchSongs();
      } else {
        console.clear()
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
      } else {
        console.clear()
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  }

  const addLike = async () => {
    const userSongLike = localStorage.getItem('userLike');
    console.clear()
    setIsButtonActive(false)
    if (!userSongLike || userSongLike === 'null') {
        try {
            const response = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/likesong/${id}?userId=${userId}`, {
                method: 'POST'
            });
            if (response.ok) {
              fetchSongs();
            } else {
              console.clear()
            }
        } catch (err) {
            console.log('Błąd: ', err);
        }
    } else if (userSongLike && String(id) === userSongLike) {
        try {
          removeLike(id);
        } catch (error) {
            console.log('Błąd: ', error);
        }
    } else if (userSongLike && String(id) !== userSongLike) {
        try {
            const response1 = await fetch(`https://radiowezelbackendwindows.azurewebsites.net/unlikesong/${userSongLike}?userId=${userId}`, {
                method: 'POST'
            });
            if (response1.ok) {
              fetchSongs();
            } else {
              console.clear()
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
      <div className={`anm_heart-mainBox ${String(id) === userLike ? 'heart-active' : ''}`} onClick={isButtonActive ? addLike : null}>
        <div className='anm_heart-box'>
          <span className='heartBtn'></span>
        </div>
      </div>
      <p className='p_likes-amount'>{likes}</p>
    </div>
  );
}
 
export default SongBarLikes;