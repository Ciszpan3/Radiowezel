import React, { useContext } from 'react';
import axios from 'axios';
import { SongsContext } from '../../context/SongsProvider';

import './AdminSong.css'

const AdminSong = ({title, url, duration, id, setSongsToCheck}) => {

  const {dataSongs} = useContext(SongsContext)

  const fetchSongsToCheck = async () => {
    const adminCode = localStorage.getItem('adminId')
    try {
      const response = await axios.get(`https://radiowezelbackendwindows.azurewebsites.net/songstocheck?adminCode=${adminCode}`)

      setSongsToCheck(response.data)
    } catch(err) {
      console.log(err)
    }
  }

  console.log(dataSongs)

  const refuseSong = async () => {
    try {
      await axios.post(`https://radiowezelbackendwindows.azurewebsites.net//refusesong/${id}`)
      await fetchSongsToCheck()
    } catch(err) {
      console.log(err)
    }
  }

  const acceptSong = async () => {
    try {
      await axios.post(`https://radiowezelbackendwindows.azurewebsites.net//acceptsong/${id}`)
      await fetchSongsToCheck()
    } catch(err) {
      console.log(err)
    }
  }

  return ( 
    <div className='app__adminSong'>
      <div className='app__adminSong-informations'>
        <p>Tytuł: <span>{title}</span></p>
        <p>Url: <span>{url}</span></p>
        <p>Czas: <span>{duration.slice(4)}</span></p>
      </div>
      <div className='app__adminSong-buttons'>
        <button onClick={acceptSong}>accept</button>
        <button onClick={refuseSong}>refuse</button>
      </div> 
    </div>
  );
}
 
export default AdminSong;