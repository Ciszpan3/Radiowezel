import React, { useState, useEffect, useContext } from 'react';
import { useSpring, animated } from 'react-spring';
import { SongsContext } from '../../context/SongsProvider';

import './CountdownCircle.css';

const CountdownCircle = () => {

  const {startTime, endTime, setStartTime, setEndTime} = useContext(SongsContext)
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = Date.now();
      const remainingTime = endTime - currentTime;
      if (remainingTime <= 0 && startTime) {
        clearInterval(intervalId);
        if (setStartTime) {
          setStartTime('');
          setEndTime('');
        }
      }
      return remainingTime >= 0 ? remainingTime : 0;
    };

    let intervalId;

    if (endTime) {
      intervalId = setInterval(() => {
        setRemainingTime(calculateRemainingTime());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [startTime, endTime, setStartTime, setEndTime]);

  const fillPercentage = (100 * (endTime - Date.now())) / (endTime - startTime);

  const circleAnimation = useSpring({
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: remainingTime > 0 ? 100 - (fillPercentage * 100) / 100 : 100 },
    config: { duration: 1000 }
  });

  return (
    <div className="countdown-container">
      <svg className="countdown-svg" viewBox="0 0 36 36">
        <animated.path
          className="countdown-path"
          strokeDasharray="126"
          strokeDashoffset={circleAnimation.strokeDashoffset}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        ></animated.path>
      </svg>
      <span className="countdown-text">{(remainingTime / 1000) < 60 ? Math.floor(remainingTime / 1000) : null}</span>
    </div>
  );
};

export default CountdownCircle;
