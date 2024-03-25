import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [endTime] = useState(parseInt(localStorage.getItem('endTime'), 10));
  console.log(endTime)

  const calculateRemainingTime = () => {
    const currentTime = Date.now();
    // console.log(endTime)
    // console.log(currentTime)
    const remainingTime = endTime - currentTime;
    return remainingTime >= 0 ? remainingTime : 0;
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [endTime]);

  const formatTime = (timeInMilliseconds) => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Remaining Time: {formatTime(remainingTime)}</h1>
    </div>
  );
};

export default Timer;
