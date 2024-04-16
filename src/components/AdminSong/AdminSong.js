import React from 'react';
import axios from 'axios';

import './AdminSong.css'

const AdminSong = ({title, url, duration, id, setSongsToCheck}) => {

  const fetchSongsToCheck = async () => {
    const adminCode = localStorage.getItem('adminId')
    try {
      const response = await axios.get(`http://34.116.238.114:8080/songstocheck?adminCode=${adminCode}`)

      setSongsToCheck(response.data)
    } catch(err) {
    }
  }

  const refuseSong = async () => {
    try {
      await axios.post(`http://34.116.238.114:8080/refusesong/${id}`)
      await fetchSongsToCheck()
    } catch(err) {

    }
  }

  const acceptSong = async () => {
    try {
      await axios.post(`http://34.116.238.114:8080/acceptsong/${id}`)
      await fetchSongsToCheck()
    } catch(err) {

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