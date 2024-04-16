import { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { HubConnectionBuilder } from '@microsoft/signalr';
import { SongsContext } from '../../context/SongsProvider';

const WebSocket = () => {
    const [connection, setConnection] = useState(null);
    const {setDataSongs, setPlayingSong, setIsOpen, setIsNonActiveOpen, setIsFirstModalOpen, setUserPin} = useContext(SongsContext)

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("http://34.116.238.114:8080/websocket")
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => null)
                .catch(err => console.error("Error while establishing connection :(", err));

            connection.on("ReceiveMessage", (message) => {
                if(message === 'Voting started.') {
                  const fetchSongs = async () => {
                    try {
                        const userId = localStorage.getItem('userId')
                        try {
                            await axios.post('http://34.116.238.114:8080/logout', JSON.stringify(userId), {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                            });
                        } catch(err) {

                        }
                        setIsNonActiveOpen(false)
                        if(userId) {
                            setIsOpen(true)
                        } else {
                            const fetchData = async () => {
                                try {
                                  const response = await axios.post('http://34.116.238.114:8080/newuser')
                                  // setUserId(response.data.id)
                                  localStorage.setItem('userPin', response.data.userCode)
                                  setUserPin(response.data.userCode)
                                } catch(err) {
                                  
                                }
                              }
                              await fetchData();
                            setIsFirstModalOpen(true)
                        }
                        // setDataSongs(response.data.dtos)
                    } catch(err) {

                    }
                  }
                  fetchSongs();
                } else if(message === 'Voting ended.') {
                    setIsNonActiveOpen(true)
                    setPlayingSong('Żadna piosenka narazie nie gra')
                    setDataSongs([])
                }
                else if(message === 'Like added to song.') {
                    const fetchSongs = async () => {
                        try {
                            const response = await axios.get('http://34.116.238.114:8080/getsongs', {
                                params: {
                                    userId: localStorage.getItem('userId')
                                }
                            });
                            setDataSongs(response.data.dtos)
                        } catch(err) {
                            
                        }
                      }
                      fetchSongs();
                } else if(message.includes('SongId')) {
                    const msgObject = JSON.parse(message)
                    
                    function formatTime(miliseconds) {
                        const seconds= Math.floor((miliseconds / 1000) % 60);
                        const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
                        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                    }
                      
                    const videoId = msgObject.SongId
                    const dur = msgObject.Duration
                      const getPlayingSong = async (videoId, dur) => {
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
                          setPlayingSong(songObject)
                        } catch(err) {
                          
                        }
                      }
                      getPlayingSong(videoId, dur)
                } else if(message === 'No song is playing.') {
                    setPlayingSong('Narazie nic nie gra')
                }
                // Tutaj możesz obsłużyć odebraną wiadomość, np. zaktualizować stan komponentu
            });
        }
    }, [connection, setDataSongs, setIsFirstModalOpen, setIsNonActiveOpen, setIsOpen, setUserPin, setPlayingSong]);
};

export default WebSocket