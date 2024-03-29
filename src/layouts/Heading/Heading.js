import React, { useState, useContext, useEffect } from 'react';

import { SongBarInformations, AddSongModal, Modal } from '../../components';
import { pexels_music } from '../../assets'; 

import { FaDeezer } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { FaCircleInfo } from "react-icons/fa6";
import { FaCircleXmark } from "react-icons/fa6";

import CountdownCircle from '../../components/CountDown/CountDown';
import { SongsContext } from '../../context/SongsProvider';

import './Heading.css'

const Heading = () => {

  const {startTime, playingSong, userId} = useContext(SongsContext)

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const setDarkMode = () => {
    document.body.setAttribute('data-theme', 'dark');
  }
  const setLightMode = () => {
    document.body.setAttribute('data-theme', 'light');
  }

  const toggleTheme = () => {
    if(isDarkMode) {
      setDarkMode();
      setIsDarkMode(false)
      localStorage.setItem('isDarkMode', true)
    } else {
      setLightMode();
      setIsDarkMode(true)
      localStorage.setItem('isDarkMode', false)
    }
  }

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode')
    if(isDarkMode !== undefined && isDarkMode !== null) {
      if(isDarkMode === true || isDarkMode === 'true') {
        setDarkMode();
      } else {
        setLightMode();
      }
    }
  }, [])

  const handleAddSongModalClose = () => {
    setIsAddModalOpen(false)
  }

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false)
  }

  const style = {
    width: '100%'
  }

  return ( 
    <>
      {userId && <>
        <div className='app__heading'>
          <div className="app__heading-head">
            <div className='app__heading-head-main'>
              <FaDeezer className='app__heading-footer-icons smaller-icon'/>
              <p>Aktualnie Leci:</p>
            </div>
            <div className='app__heading-head-th_info'>
              <div className='app__heading-toggleBtn' onClick={toggleTheme}>
                <div className='app__heading-toggleBtn_circle'></div>
              </div>
              <FaCircleInfo className='app__infoBtn' onClick={() => setIsInfoModalOpen(true)}/>
            </div>
          </div>
          <div className='app__heading-content'>
            {typeof playingSong === 'object' ?
            <SongBarInformations title={playingSong.title} time={playingSong.duration} headingStyle={style}/> :
            <p className='app__heading-noSongPlaying'>Żadna piosenka narazie nie gra</p>}
          </div>
          <div className='app__heading-imgBox'>
            <img src={pexels_music} alt="music-concert" />
          </div>
          <div className='app__heading-footer'>
            {!startTime ? <div className='app__heading-footer-add' onClick={() => setIsAddModalOpen(true)}>
              <MdOutlineLibraryAdd className='app__heading-footer-icons'/>
              <p className='p_reem-footer'>Dodaj piosenke</p>
            </div> :
            <div className='app__heading-footer_countdownBox'>
              <p>Możesz dodać nastepną piosenkę dopiero za 2h</p>
              <CountdownCircle/>
            </div>}
            {/* <div className='app__heading-footer-top'>
              <div className='app__heading-footer-top_month'>
                <BiTrophy className='app__heading-footer-icons'/>
                <p className='p_reem-footer'>Top Miesiąca</p>
              </div>
              <div className='app__heading-seperator'>&nbsp;</div>
              <div className='app__heading-footer_arrows'>
                <FaSortAmountUp className='app__heading-footer_arrows-icons'/>
                <FaSortAmountDown className='app__heading-footer_arrows-icons'/>
              </div>
            </div> */}
          </div>
        </div>
        <AddSongModal isOpen={isAddModalOpen} handleClose={handleAddSongModalClose}/>
        <Modal isOpen={isInfoModalOpen} handleClose={handleCloseInfoModal}>
          <div className='app__info'>
            <div className='app__info-content'>
              <p className='p_song-title'>Aplikacja działa na zasadzie głosowań, uczniowie mogą dodawać piosenki poprzez link (youtube).
        Następnie każdy z dostępem do aplikacji może na daną piosenkę zagłosować.
        Oczywiście nie jest to nieograniczone tak więc głosujcie na to co faktycznie chcecie usłyszeć z głośników.
        Po dodaniu piosenki występuje czasowy ogranicznik, po jego upłynięciu można ponownie dodać piosenkę i cieszyć się z dobrodziejstw aplikacji.</p>
            </div>
            <div className='app__info-close'>
              <FaCircleXmark onClick={handleCloseInfoModal} className='app__firstEntry-closeBtn'/>
            </div>
          </div>
        </Modal>
      </>}
    </>
  );
}
 
export default Heading;