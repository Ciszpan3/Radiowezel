import React from 'react';

// import { BiSolidMicrophoneAlt } from "react-icons/bi";
import { WiTime4 } from "react-icons/wi";
import { BiMusic } from "react-icons/bi";

import './SongBarInformations.css'

const SongBarInformations = ({title, time, headingStyle}) => {
  return ( 
    <div className='app__songBarInfo' style={headingStyle && headingStyle}>
      <div className="app__songBarInfo-content">
        <div>
          <BiMusic className='app__songBarInfo-content-icons bigger-icon'/>
          <p className='p_title'>Tytuł:</p>
        </div>
        <p className='p_song-title'>{title}</p>
      </div>
      <div className="app__songBarInfo-content">
        <div>
          <WiTime4 className='app__songBarInfo-content-icons'/>
          <p className='p_time'>{time !== undefined ? time.slice(4) : null}</p>
        </div>
      </div>
    </div>
  );
}
 
export default SongBarInformations;