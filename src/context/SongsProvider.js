import { createContext, useState, useCallback } from "react";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastComponent } from "../components";

export const SongsContext = createContext();

const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [dataSongs, setDataSongs] = useState([]);
  const [userLike, setUserLike] = useState("");
  const [userId, setUserId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [playingSong, setPlayingSong] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isNonActiveOpen, setIsNonActiveOpen] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [userPin, setUserPin] = useState("");
  const [isRefreshVisible, setIsRefreshVisible] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(90);
  const [isButtonActive, setIsButtonActive] = useState(true);
  // const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  // const path = process.env.PATH
  // console.log(process.env)
  // console.log(SERVER_ADDRESS)
  // console.log(path)

  const handleShowToast = (msg) => {
    toast.success(<ToastComponent message={msg} />, { autoClose: 2000 });
  };

  const addSong = useCallback(async (songObject) => {
    try {
      const response = await axios.post(
        `http://${"34.116.238.114"}/addSong`,
        songObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        return "Piosenka została dodana";
      }
    } catch (err) {
      if (err.response.status === 400) {
        return "Piosenka nie przeszła walidacji";
      } else {
        return "Coś poszło nie tak";
      }
    }
  }, []);

  return (
    <SongsContext.Provider
      value={{
        songs,
        setSongs,
        userId,
        setUserId,
        dataSongs,
        setDataSongs,
        addSong,
        handleShowToast,
        startTime,
        endTime,
        setStartTime,
        setEndTime,
        playingSong,
        setPlayingSong,
        userLike,
        setUserLike,
        isOpen,
        setIsOpen,
        isNonActiveOpen,
        setIsNonActiveOpen,
        isFirstModalOpen,
        setIsFirstModalOpen,
        userPin,
        setUserPin,
        isRefreshVisible,
        setIsRefreshVisible,
        isButtonActive,
        setIsButtonActive,
        refreshCountdown,
        setRefreshCountdown,
      }}
    >
      {children}
    </SongsContext.Provider>
  );
};

export default SongsProvider;
