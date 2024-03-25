import React from 'react';

import { SongBarInformations, SongBarLikes } from '../../components';

import './SongBar.css'

const SongBar = ({title, time, likes, id}) => {
  return ( 
    <div className='app__songBar'>
      <SongBarInformations 
        title={title}
        time={time}
      />
      <SongBarLikes likes={likes} id={id}/>
    </div>
  );
}
 
export default SongBar;