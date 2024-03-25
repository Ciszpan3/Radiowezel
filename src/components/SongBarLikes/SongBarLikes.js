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
        const response = await axios.get('https://localhost:7087/getsongs', {
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
      const response = await fetch(`https://localhost:7087/unlikesong/${songRemoveId}?userId=${userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        await fetchSongs();
      } 
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  }

  const addElseLike = async () => {
    try {
      const response = await fetch(`https://localhost:7087/likesong/${id}?userId=${userId}`, {
        method: 'POST'
      });
      if (response.ok) {
        await fetchSongs();
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
    }
  }

  const addLike = async () => {
    const userSongLike = localStorage.getItem('userLike');
    setIsButtonActive(false)
    if (!userSongLike || userSongLike === 'null') {
        try {
            const response = await fetch(`https://localhost:7087/likesong/${id}?userId=${userId}`, {
                method: 'POST'
            });
            if (response.ok) {
                await fetchSongs();
            }
        } catch (err) {
            console.log('Błąd: ', err);
        }
    } else if (userSongLike && String(id) === userSongLike) {
        console.log('unlikesong with the same id');
        try {
            await removeLike(id);
        } catch (error) {
            console.log('Błąd: ', error);
        }
    } else if (userSongLike && String(id) !== userSongLike) {
        try {
            const response1 = await fetch(`https://localhost:7087/unlikesong/${userSongLike}?userId=${userId}`, {
                method: 'POST'
            });
            if (response1.ok) {
                await fetchSongs();
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
      {/* <img src={heart} alt="heart-icon" /> */}
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