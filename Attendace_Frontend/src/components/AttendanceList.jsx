import React, { useEffect, useState } from 'react';
import { format, getDaysInMonth, addMonths, subMonths, addDays } from 'date-fns';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AttendanceList = ({ users = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersTime, setAllUsersTime] = useState({});
  const userID = Cookies.get('userId');
  const [dailyTimes, setDailyTimes] = useState(null);
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const userName = Cookies.get('username') || '';
  const [leaveDays, setLeaveDays] = useState([]); console.log(leaveDays);

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
  }, [userID,token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/allusers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setAllUsers(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    fetch('http://localhost:5000/time/dailyTime/allUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        setAllUsersTime(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}, [token]);

useEffect(() => {
  fetch('http://localhost:5000/leave/', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => {
      setLeaveDays(data.map((item) => ({ ...item, date: new Date(item.date) })));
    })
    .catch((error) => {
      console.error(error);
    });
}, [token]);

  const handleMonthChange = (e) => {
    const selectedMonth = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(prevDate.getFullYear(), selectedMonth));
  };

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value);
    setSelectedDate((prevDate) => new Date(selectedYear, prevDate.getMonth()));
  };

  const handleForward = () => {
    setSelectedDate(prevDate => addMonths(prevDate, 1));
  };

  const handleBackward = () => {
    setSelectedDate(prevDate => subMonths(prevDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className='flex gap-8 relative items-center border rounded-md border-gray-200 mb-2 p-2 bg-gray-50'>
        <h1 className='font-semibold text-lg opacity-85 border-4 border-gray-200 rounded-full p-2 bg-green-200'>Attendance list</h1>
        <select value={selectedDate.getMonth()} onChange={handleMonthChange} className='font-bold text-xl opacity-85'>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {format(new Date(0, i), 'MMMM')}
            </option>
          ))}
        </select>
        <select value={selectedDate.getFullYear()} onChange={handleYearChange} className='font-bold text-xl opacity-85'>
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <option key={i} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <div className='right-[15%] absolute'>
          <button onClick={handleBackward} className='mr-10 text-2xl opacity-70'><FaChevronLeft /></button>
          <button onClick={handleForward} className='text-2xl opacity-70'><FaChevronRight /></button>
        </div>
        <div className='bg-white cursor-pointer absolute right-3 text-xl border-2 rounded-lg px-3 py-1 border-gray-200'>
          <FontAwesomeIcon icon={faFileExport} className='text-cyan-600 mr-2' />
          <span>export</span>
        </div>
      </div>
    );
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startDate = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), 1);
    const visibleUsers = allUsers.slice(0, 15);
    const cellWidth = '100rem';

    return (
      <div className='overflow-x-auto overflow-y-auto h-[22.5pc]'>
        <table className='table-fixed justify-center w-full items-center'>
          <thead className='sticky top-0 bg-white z-10'>
            <tr className='border-b-2 border-gray-100'>
              <th className='text-left opacity-80 w-4/12'>Employees Name  ID</th>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const currentDate = addDays(startDate, i);
                const dayName = format(currentDate, 'EEE');
                const dayNumber = format(currentDate, 'd');
                const isWeekend = dayName === 'Sat' || dayName === 'Sun';
                const isHoliday = leaveDays.some(leave => format(leave.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
                const isCurrentDate = isSameDay(currentDate, new Date());
                return (
                  <td key={i} className={`font-medium ${isWeekend ? 'text-green-600 font-bold' : ''} ${isHoliday ? 'text-red-600 font-bold' : ''}`} style={{ width: '8%' }}>
                    <div className={`text-center text-sm ${isCurrentDate ? 'rounded-full bg-black text-white' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginTop: '8px' }}>{dayName}</div>
                      <div style={{ marginBottom: '8px' }} className='font-bold'>{dayNumber}</div>
                    </div>
                  </td>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(role === 'admin' || role === 'hr') && visibleUsers.map((user, index) => (
              <tr key={index} className='border-b-2 border-gray-100'>
                <td className='font-medium'>
                  <div className='font-medium flex flex-col'>
                    <span>{user.Username}</span>
                    <span className="mt-auto text-sm">{user.Employee_ID}</span>
                  </div>
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const currentDate = addDays(startDate, i);
                  const formattedDate = format(currentDate, 'yyyy-MM-dd');

                  const userTime = allUsersTime[user.Username];
                  const userData = userTime ? userTime.find(day => day.date === formattedDate) : null;

                  let content;
                  if (userData) {
                    const totalHours = Math.floor(userData.totalTime / (1000 * 60 * 60));
                    const totalMinutes = Math.round((userData.totalTime % (1000 * 60 * 60)) / (1000 * 60));
                    content = `${totalHours}.${totalMinutes}`;
                  } else {
                    content = '';
                  }

                  const isWeekend = format(currentDate, 'EEE') === 'Sat' || format(currentDate, 'EEE') === 'Sun';
                  const isLeaveDay = leaveDays.some(leave => format(leave.date, 'yyyy-MM-dd') === formattedDate);

                  return (
                    <td key={i} className='' style={{ width: cellWidth }}>
                      <div className='font-bold text-sm text-center'>
                        {isWeekend && isLeaveDay ? (
                          <span className='text-red-600'>HW</span>
                        ) : isWeekend ? (
                          <span className='text-green-700'>w</span>
                        ) : isLeaveDay ? (
                          <span className='text-red-600'>H</span>
                        ) : (
                          <span>{content}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {(role === 'user' && dailyTimes) && (
              <tr className='border-b-2 border-gray-100'>
                <td className='font-medium'>{userName}</td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const currentDate = addDays(startDate, i);
                  const formattedDate = format(currentDate, 'yyyy-MM-dd');

                  const dailyTime = dailyTimes.find(day => day.date === formattedDate);

                  let content;
                  if (dailyTime) {
                    const totalHours = Math.floor(dailyTime.totalTime / (1000 * 60 * 60));
                    const totalMinutes = Math.floor((dailyTime.totalTime % (1000 * 60 * 60)) / (1000 * 60));
                    content = `${totalHours}.${totalMinutes}`;
                  } else {
                    content = '';
                  }

                  const isWeekend = format(currentDate, 'EEE') === 'Sat' || format(currentDate, 'EEE') === 'Sun';
                  const isLeaveDay = leaveDays.some(leave => format(leave.date, 'yyyy-MM-dd') === formattedDate);

                  return (
                    <td key={i} className='' style={{ width: cellWidth }}>
                      <div className='font-bold text-sm text-center'>
                        {isWeekend ? (
                          <span className='text-green-700'>w</span>
                        ) : isLeaveDay ? (
                          <span className='text-red-600'>H</span>
                        ) : (
                          <span>{content}</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  return (
    <div className='p-6 bg-white '>
      {renderHeader()}
      {renderCalendar()}
    </div>
  );
};

export default AttendanceList;
