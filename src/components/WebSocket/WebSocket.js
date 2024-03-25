import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { HubConnectionBuilder } from '@microsoft/signalr';
import { SongsContext } from '../../context/SongsProvider';

const WebSocket = () => {
    const [connection, setConnection] = useState(null);
    const {setDataSongs, setPlayingSong} = useContext(SongsContext)

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:7087/websocket")
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => console.log("Connection established!"))
                .catch(err => console.error("Error while establishing connection :(", err));

            connection.on("ReceiveMessage", (message) => {
                if(message === 'Voting started.') {
                  const fetchSongs = async () => {
                    console.log('Voting started from a webSocket')
                    try {
                        const response = await axios.get('https://localhost:7087/getsongs', {
                            params: {
                                userId: localStorage.getItem('userId')
                            }
                        });
                        localStorage.setItem('userLike', response.data.userLike)
                        setDataSongs(response.data.dtos)
                    } catch(err) {
                        console.log(err)
                    }
                  }
                  fetchSongs();
                } else if(message === 'Like added to song.') {
                    const fetchSongs = async () => {
                        try {
                            const response = await axios.get('https://localhost:7087/getsongs', {
                                params: {
                                    userId: localStorage.getItem('userId')
                                }
                            });
                            setDataSongs(response.data.dtos)
                        } catch(err) {
                            console.log(err)
                        }
                      }
                      fetchSongs();
                } else if(message.includes('SongId')) {
                    const msgObject = JSON.parse(message)
                    console.log(message)
                    
                    function formatTime(miliseconds) {
                        console.log(miliseconds)
                        const seconds= Math.floor((miliseconds / 1000) % 60);
                        const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
                        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    }
                      
                    const videoId = msgObject.SongId
                    const dur = msgObject.Duration
                      const getPlayingSong = async (videoId, dur) => {
                        console.log(videoId)
                        const apiKey = 'AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk'
                        const apiUrl =`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
                        try {
                          const response = await axios.get(apiUrl) 
                          const duration = formatTime(dur)
                          const title = response.data.items[0].snippet.title
                          const songObject = {
                            title: title,
                            id: videoId,
                            duration: `00:0${duration}`
                          }
                          console.log(songObject)
                          setPlayingSong(songObject)
                        } catch(err) {
                          console.log(err)
                        }
                      }
                      getPlayingSong(videoId, dur)
                    console.log(`wiadomosc z videoId`)
                    console.log(message)
                } else if(message === 'No song is playing.') {
                    setPlayingSong('Narazie nic nie gra')
                }
                // Tutaj możesz obsłużyć odebraną wiadomość, np. zaktualizować stan komponentu
            });
        }
    }, [connection]);
};

export default WebSocket