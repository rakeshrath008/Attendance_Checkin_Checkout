import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const HorlidaysCalendar = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaveDays, setLeaveDays] = useState([]);
  const [popUpOpen, setPopupOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [details, setDetails] = useState('');
  const [dateSelected, setDateSelected] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessageHoliday, setErrorMessageHoliday] = useState('');

  const token = Cookies.get('token');

  const fetchLeaveDays = (token) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      return fetch('http://localhost:5000/leave/', {
        headers: headers
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch leave data');
          }
          return response.json();
        })
        .then((data) => {
          return data.map((item) => ({ ...item, date: new Date(item.date) }));
        })
        .catch((error) => {
          console.error(error);
          return [];
        });
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  useEffect(() => {
    fetchLeaveDays(token)
      .then((leaveDays) => {
        setLeaveDays(leaveDays);
      });
  }, [leaveDays]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDateSelected(true);
    const leaveDay = leaveDays.find((day) => day.date.getTime() === date.getTime());
    if (leaveDay) {
      setDetails(leaveDay.details);
    } else {
      setDetails('');
    }
  };

  const handleSubmitDetails = () => {

    if (!details.trim()) {
      setErrorMessageHoliday('Please enter a holiday name');
      setTimeout(() => {
        setErrorMessageHoliday('');
      }, 1000);
      return;
    }

    const userName = Cookies.get('username');
    const newLeaveDay = { date: selectedDate, details, username: userName };
    setLeaveDays([...leaveDays, newLeaveDay]);
    fetch('http://localhost:5000/leave/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newLeaveDay),
    })
      .then(() => {
        console.log('Leave day added successfully');
        setDetails('');
        setSuccessMessage('Holiday set successfully');
        setTimeout(() => {
          setSuccessMessage('');
          setPopupOpen(false);
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBack = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleForward = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const renderDates = () => {
    const dates = [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    return dates.map((date) => renderDateItem(date));
  };


  const renderDateItem = (date) => {
    const currentDate = new Date();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = leaveDays.some((leaveDay) => {
      const leaveDate = new Date(leaveDay.date);
      return leaveDate.toDateString() === date.toDateString();
    });

    return (
      <div
        key={date.toDateString()}
        className={`m-1 cursor-pointer text-center text-lg w-28 ml-4 p-2 ${currentDate.toDateString() === date.toDateString() ? 'border-blue-500' : ''}  
          ${isWeekend ? 'text-green-600' : isHoliday ? 'text-red-500' : 'text-black'} 
          ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'bg-gray-100 rounded-full' : ''}`}
        onClick={() => handleDateChange(date)}
      >
        <div className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
        <div
          className={`inline-block w-6 h-6 rounded-full ${currentDate.toDateString() === date.toDateString() ? 'bg-blue-500 text-white' : ''
            }`}
        >
          <span className={isWeekend ? 'text-green-600' : isHoliday ? 'text-red-500' : 'text-black'}>
            {date.toLocaleDateString('en-US', { day: 'numeric' })}
          </span>
        </div>
      </div>
    );
  };

  const year = selectedDate.getFullYear();
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div className="flex flex-col relative bg-white">
      <div className='w-full h-12 relative border-b-4 border-gray-50'>
        <h1 className='font-bold text-2xl opacity-80 left-4 top-1 absolute'>Holidays List</h1>
        <div className='absolute text-center w-full h-12'>
          <button onClick={() => {
            if (dateSelected) { setPopupOpen(true); } else {
              setErrorMessage('Please select a date');
              setTimeout(() => {
                setErrorMessage('');
              }, 1500);
            }
          }} className='border-2 border-gray-300 p-2 text-wider opacity-80 bg-white rounded-md px-6 hover: text-black hover:bg-slate-100 hover:opacity-80'>+ Add</button>
        </div>
        <div className='flex absolute right-[7%]'>
          <h1 className="my-2 text-blue-900 font-serif font-bold text-2xl opacity-90"> {monthName} {year}</h1>
          <button
            onClick={handleBack}
            className=" text-blue-700 ml-2 mt-1 text-xl"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={handleForward}
            className=" text-blue-700 ml-2 mt-1 text-xl"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      <div className="flex items-center p-3 mt- border-2 border-gray-100 h-fit w-fit ml-1 mr-1">
        <div className="flex flex-wrap">{renderDates()}</div>
      </div>
      {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
      {popUpOpen &&
        <div className='absolute w-full h-full bg-white rounded-lg text-center border-4'>
          <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Enter details" className="border border-gray-300 p-2 mt-4 rounded-md mr-2" />
          <button onClick={handleSubmitDetails} className="border border-blue-500 bg-gray-300 hover:bg-green-500 rounded-md p-2 mt-2">Submit</button>
          {errorMessageHoliday && <div className="text-red-500 text-center">{errorMessageHoliday}</div>}
          {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
        </div>
      }
    </div>
  );
};

export default HorlidaysCalendar;
