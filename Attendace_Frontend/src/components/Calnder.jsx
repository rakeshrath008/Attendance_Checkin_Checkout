import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const HorizontalCalendar = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveDays, setLeaveDays] = useState([]);
  const token = Cookies.get('token');
  const userID = Cookies.get('userId');
  const [dailyTimes, setDailyTimes] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await fetch(`http://localhost:5000/time/${userID}/dailyTime`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const dataArray = Object.values(data);

        const dailyTimes = dataArray.map(item => ({
          date: item.date,
          totalTime: item.totalTime
        }));

        setDailyTimes(dailyTimes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    if (userID) {
      fetchAllData();
    }
  }, [userID, token]);


  useEffect(() => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    fetch('http://localhost:5000/leave/', {
      headers: headers
    })
      .then((response) => response.json())
      .then((data) => {
        setLeaveDays(data.map((item) => ({ ...item, date: new Date(item.date) })));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBack = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 15);
      return newDate;
    });
  };

  const handleForward = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 15);
      return newDate;
    });
  };

  const renderDates = () => {
    const currentDate = new Date();
    const dates = [];
    for (let i = -7; i <= 7; i++) {
      const displayedDate = new Date(selectedDate);
      displayedDate.setDate(displayedDate.getDate() + i);
      const isWeekend = displayedDate.getDay() === 0 || displayedDate.getDay() === 6;
      const isHoliday = leaveDays.some(leaveDay => {
        const leaveDate = new Date(leaveDay.date);
        return leaveDate.toDateString() === displayedDate.toDateString();
      });
      let totalHours = 0;
      const dailyTime = dailyTimes && dailyTimes.find(dailyTime => {
        const dailyDate = new Date(dailyTime.date);
        return dailyDate.getDate() === displayedDate.getDate() &&
          dailyDate.getMonth() === displayedDate.getMonth() &&
          dailyDate.getFullYear() === displayedDate.getFullYear();
      });
      if (dailyTime && dailyTime.totalTime) {
        const totalMilliseconds = dailyTime.totalTime;
        const totalSeconds = totalMilliseconds / 1000;
        const totalMinutes = totalSeconds / 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        totalHours = `${hours}.${minutes}`;
      }

      dates.push(
        <div
          key={displayedDate.toDateString()}
          className={`m-1 cursor-pointer text-center text-lg w-10 ${currentDate.toDateString() === displayedDate.toDateString() ? 'border-blue-500' : ''
            }  ${isWeekend ? 'text-green-600' : isHoliday ? 'text-red-600' : 'text-blue-600'}`}
        >
          {displayedDate.getDate() === 1 && (
            <div key={`${displayedDate.getMonth()}`} className="text-center font-bold text-red-600 text-sm mt-[-20px]">
              {displayedDate.toLocaleDateString('en-US', { month: 'long' })}
            </div>
          )}
          <div className="text-sm">{displayedDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
          <div className={`inline-block w-6 h-6 rounded-full ${currentDate.toDateString() === displayedDate.toDateString() ? 'bg-blue-500 text-white' : ''}`}>
            <span className={isHoliday ? 'text-red-600' : isWeekend ? 'text-green-600' : 'text-black'}>
              {displayedDate.toLocaleDateString('en-US', { day: 'numeric' })}
            </span>
          </div>
          {dailyTime && (
            <div className="text-[65%] mt-1">
              <span className={`font-bold ${totalHours < 3.5 ? 'text-red-500' : totalHours < 9 ? 'text-red-500' : 'text-black'}`}>
                {totalHours < 3.5 ? 'A' : totalHours}
              </span>
            </div>
          )}
          {isHoliday && isWeekend ? (
            <div className="text-[65%] mt-1">
              <span className={`font-bold ${isHoliday ? 'text-red-600' : ''}`}>
                W&H
              </span>
            </div>
          ) : (
            <>
              {isHoliday && (
                <div className="text-[65%] mt-1">
                  <span className={`font-bold ${isHoliday ? 'text-red-600' : ''}`}>
                    {isHoliday ? 'H' : ''}
                  </span>
                </div>
              )}
              {isWeekend && (
                <div className="text-[65%] mt-1">
                  <span className={`font-bold ${isWeekend ? 'text-green-600' : ''}`}>
                    {isWeekend ? 'W' : ''}
                  </span>
                </div>
              )}
            </>
          )}

        </div>
      );
    }
    return dates;
  };

  const year = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="flex flex-col items-start ">
      <h1 className="my-2 text-blue-700 font-serif text-xl font-bold ml-1 ">{monthName} {year}</h1>
      <div className="flex items-center border rounded-lg">
        <button onClick={handleBack} className="border-none bg-blue-500 rounded-full text-white px-3 py-1 mr-2">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="flex flex-wrap">{renderDates()}</div>
        <button onClick={handleForward} className="border-none bg-blue-500 rounded-full text-white px-3 py-1 ml-2">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalCalendar;
