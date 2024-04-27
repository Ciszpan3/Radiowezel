import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
// import { PinInput, PinInputField, HStack, Input } from '@chakra-ui/react'
// import { PinField } from 'react-pin-input';

import { SongsContext } from "../../context/SongsProvider";
import { FaCircleXmark } from "react-icons/fa6";
import { Modal } from "../../components";
import { parseISO, getTime } from "date-fns";
import { BeatLoader } from "react-spinners";

import "./FirstEntry.css";

const FirstEntry = ({ handleShowToast }) => {
  const {
    setUserId,
    setDataSongs,
    setStartTime,
    setEndTime,
    setPlayingSong,
    setUserLike,
    isOpen,
    setIsOpen,
    isNonActiveOpen,
    setIsNonActiveOpen,
    setIsFirstModalOpen,
    isFirstModalOpen,
    userPin,
    setUserPin,
    isRefreshVisible,
    setIsRefreshVisible,
    refreshCountdown,
    setRefreshCountdown,
  } = useContext(SongsContext);
  const [validateMessage, setValidateMessage] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleNonActiveClose = () => {
    setIsNonActiveOpen(false);
  };

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false);
    setIsOpen(true);
    setIsRefreshVisible(false);
    const firstInput = document.getElementById("add__pinField-first");
    if (firstInput) {
      firstInput.focus();
    }
  };

  const fetchSongs = async (userId) => {
    try {
      const response = await axios.get(`http://${"34.116.238.114"}/getsongs`, {
        params: {
          userId: userId,
        },
      });

      setUserLike(response.data.userLike);
      localStorage.setItem("userLike", response.data.userLike);
      setDataSongs(response.data.dtos);
    } catch (err) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`http://${"34.116.238.114"}/newuser`);
        // setUserId(response.data.id)
        localStorage.setItem("userPin", response.data.userCode);
        setUserPin(response.data.userCode);
      } catch (err) {}
    };
    const checkIsWebActive = async () => {
      try {
        const response = await axios.get(
          `http://${"34.116.238.114"}/isvotingactive`
        );

        if (response.data) {
          const isFirstModalDisplayed = localStorage.getItem(
            "firstModalDisplayed"
          );
          if (!isFirstModalDisplayed) {
            localStorage.setItem("firstModalDisplayed", "true");
            fetchData();
            setIsFirstModalOpen(true); // Ustawiamy isOpen na true, aby pokazać modal
          }
          if (isFirstModalDisplayed) {
            const userId = localStorage.getItem("userId");
            try {
              await axios.post(
                `http://${"34.116.238.114"}/logout`,
                JSON.stringify(userId),
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
            } catch (err) {}
            setIsOpen(true);
          }
        } else {
          setIsNonActiveOpen(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkIsWebActive();
  }, [setIsFirstModalOpen, setIsNonActiveOpen, setIsOpen, setUserPin]);

  function formatTime(miliseconds) {
    const seconds = Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const getPlayingSong = async (videoId, dur) => {
    const apiKey = "AIzaSyBsOaeliSFqW6myMwAgpXslA8xhXpT7Owk";
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      const duration = formatTime(dur);
      const title = response.data.items[0].snippet.title;
      const songObject = {
        title: title,
        id: videoId,
        duration: `00:0${duration}`,
      };
      setPlayingSong(songObject);
    } catch (err) {}
  };

  const inputs = useRef([]);

  const handleLogin = async (pinValue) => {
    const element = document.getElementById("app__firstEntry-form");
    try {
      const userPinJson = JSON.stringify(pinValue.toUpperCase());
      const response = await axios.post(
        `http://${"34.116.238.114"}/login`,
        `${userPinJson}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        handleClose();
        handleShowToast();
        localStorage.setItem("userId", response.data.loginModel.userId);
        setUserId(response.data.loginModel.userId);
        const startDate = response.data.loginModel.lastAddedSongDate;
        const startISO = parseISO(startDate);
        const startMil = getTime(startISO);
        const endMil = startMil + 7200000;
        setStartTime(startMil);
        setEndTime(endMil);
        await fetchSongs(response.data.loginModel.userId);
        if (response.data.playingSong.includes("SongId")) {
          const playingSongJSON = response.data.playingSong;
          const playingSong = JSON.parse(playingSongJSON);
          await getPlayingSong(playingSong.SongId, playingSong.Duration);
        } else {
          setPlayingSong("Żadna piosenka nie gra");
        }
        element.style.opacity = "1";
      }
    } catch (err) {
      setValidateMessage("Pin jest nieprawidłowy");
    }
  };

  async function handleInputChange(index, event) {
    const value = event.target.value;
    if (validateMessage) {
      setValidateMessage("");
    }

    if (!value.match(/[0-9a-zA-Z]/)) {
      return;
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    const isPinFull = newPin.filter((value) => value !== "");
    // let pinValues = '';
    // newPin.forEach(value => {
    //   pinValues = pinValues + value
    // });
    if (isPinFull.length === 4) {
      const element = document.getElementById("app__firstEntry-form");
      if (element) {
        element.style.opacity = "0.8";
      }
      handleLogin(newPin.join(""));
    }

    // Przechodzi do następnego pola, jeśli wprowadzono wartość i nie jest to ostatnie pole
    if (value && index < 3) {
      inputs.current[index + 1].focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Enter") {
      handleLogin(pin.join(""));
    }
    if (event.key === "Backspace" && pin[index] !== "") {
      const newPin = [...pin];
      newPin[index] = "";
      setPin(newPin);
    }
    if (event.key === "Backspace" && index > 0 && pin[index] === "") {
      inputs.current[index - 1].focus();
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.post(`http://${"34.116.238.114"}/newuser`);
      // setUserId(response.data.id)
      localStorage.setItem("userPin", response.data.userCode);
      setUserPin(response.data.userCode);
    } catch (err) {}
  };

  const handlePinNotRememebered = async () => {
    handleClose();
    await fetchData();
    setIsFirstModalOpen(true);
    setValidateMessage("");
  };

  const RefreshCountdown = () => {
    useEffect(() => {
      const intervalId = setInterval(() => {
        setRefreshCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }, [setRefreshCountdown]);

    return <p className="refresh_countdown">{refreshCountdown}</p>;
  };

  return (
    <>
      <Modal isOpen={isFirstModalOpen} handleClose={handleCloseFirstModal}>
        <div className="app__pinModal">
          <p className="app__pinModal-startText">
            Witaj w oficjalnej aplikacji Radiowęzła Zespołu Szkół Zawodowych w
            Gostyniu. Poniżej znajduje się kod dzięki któremu będziesz miał/a
            dostęp do wszystkich funkcji aplikacji.
          </p>
          {userPin ? (
            <p className="app__pinModal-pin">{userPin}</p>
          ) : (
            <BeatLoader color="#ffffff" loading={true} />
          )}
          <p className="app__pinModal-startText">
            Jeśli masz słabą pamięć zapisz go gdzieś, chociażby w notatniku! 😊
          </p>
          <FaCircleXmark
            onClick={handleCloseFirstModal}
            className="app__firstEntry-closeBtn"
          />
        </div>
      </Modal>
      {!isFirstModalOpen && (
        <Modal isOpen={isOpen} handleClose={handleClose} isLoginModal={true}>
          <div className="app__firstEntry-modal">
            {/* <img src={excl_mark} alt="exclamation_mark" /> */}
            <p>Poniżej wpisz wcześniej wyświetlony kod</p>
            <form
              className="app__firstEntry-modal_inputCont"
              id="app__firstEntry-form"
            >
              {validateMessage && (
                <p style={{ color: "red", fontSize: "28px" }}>
                  {validateMessage}
                </p>
              )}
              <div className="pin_inputs-box">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    id={`add__pinField-${index}`}
                    className="add__pinField"
                    type="text"
                    maxLength={1}
                    value={pin[index]}
                    onChange={(e) => handleInputChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              {isRefreshVisible ? (
                <p
                  className="app__firstEntry-notRemember"
                  onClick={handlePinNotRememebered}
                >
                  Nie pamiętam kodu
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "0.35rem",
                  }}
                >
                  <p className="app__firsteEntry-textNotRemember">
                    Jeśli nie pamiętasz kodu, za 90 sekund pojawi się przycisk
                    do resetu, NIE ODŚWIEŻAJ STRONY!
                  </p>
                  <RefreshCountdown />
                </div>
              )}
            </form>
            {/* <FaCircleXmark onClick={handleClose} className='app__firstEntry-closeBtn'/> */}
          </div>
        </Modal>
      )}
      <Modal isOpen={isNonActiveOpen} handleClose={handleNonActiveClose}>
        <div className="app__firstEntry-modal">
          <p>Strona jest narazie nieaktywna. Poczekaj do następnej przerwy</p>
        </div>
      </Modal>
    </>
  );
};

export default FirstEntry;
