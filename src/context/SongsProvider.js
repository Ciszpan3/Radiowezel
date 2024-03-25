import { createContext, useEffect, useState, useCallback } from "react"; 
import axios from "axios";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastComponent } from "../components";

export const SongsContext = createContext()

const SongsProvider = ({children}) => {

    const [songs, setSongs] = useState([])
    const [dataSongs, setDataSongs] = useState([])
    const [userLike, setUserLike] = useState('')
    const [userId, setUserId] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [playingSong, setPlayingSong] = useState({})

    const handleShowToast = (msg) => {
        toast.success(<ToastComponent message={msg}/>, { autoClose: 2000 });
    }

    const addSong = useCallback(async (songObject) => {
        try {
            const response = await axios.post('https://radiowezelbackendwindows.azurewebsites.net/addSong', songObject, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if(response.status === 200) {
                return 'Piosenka została dodana'
            }
        } catch(err) {
            console.log(err);
            if(err.response.status === 400) {
                return 'Piosenka zawiera nicenzuralne słowa'
            } else {
                return 'Coś poszło nie tak'
            }
        }
    }, []);
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('https://radiowezelbackendwindows.azurewebsites.net/getsongs', {
                    params: {
                        userId: localStorage.getItem('userId')
                    }
                });

                setDataSongs(response.data.dtos)
            } catch(err) {
                console.log(err)
            }
        }
        if(localStorage.getItem('userId')) {
            fetchSongs();
        }
    }, [addSong, setUserId])

  return (
    <SongsContext.Provider value={{songs, setSongs, userId, setUserId, dataSongs, setDataSongs, addSong, handleShowToast, startTime, endTime, setStartTime, setEndTime, playingSong, setPlayingSong, userLike, setUserLike}}>
      {children}
    </SongsContext.Provider>
  )
}

export default SongsProvider;