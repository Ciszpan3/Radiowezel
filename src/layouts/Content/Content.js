import React, { useContext } from 'react';

import { SongsContext } from '../../context/SongsProvider';
import { SongBar } from '../../components';

import './Content.css'

const Content = () => {

  const { dataSongs } = useContext(SongsContext)

  return ( 
    <div className='app__content'>
      {dataSongs.map(song => {
        return (
          <div key={song.songId} className='app__content'>
            <SongBar
              title={song.title}
              time={song.duration}
              likes={song.likes}
              id={song.songId}
            />
          </div>
        )
      })}
    </div>
  );
}
 
export default Content;