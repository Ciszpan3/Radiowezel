import React, { useState, useContext } from 'react';

import { SongBarInformations, AddSongModal } from '../../components';
import { pexels_music } from '../../assets'; 

import { FaDeezer } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";

import CountdownCircle from '../../components/CountDown/CountDown';
import { SongsContext } from '../../context/SongsProvider';

import './Heading.css'

const Heading = () => {

  const {startTime, playingSong, userId} = useContext(SongsContext)

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const setDarkMode = () => {
    document.body.setAttribute('data-theme', 'dark');
  }
  const setLightMode = () => {
    document.body.setAttribute('data-theme', 'light');
  }

  const toggleTheme = () => {
    console.log(isDarkMode)
    if(isDarkMode) {
      setDarkMode();
      setIsDarkMode(false)
    } else {
      setLightMode();
      setIsDarkMode(true)
    }
  }

  const handleAddSongModalClose = () => {
    setIsAddModalOpen(false)
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
            <div className='app__heading-toggleBtn' onClick={toggleTheme}>
              <div className='app__heading-toggleBtn_circle'></div>
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
      </>}
    </>
  );
}
 
export default Heading;