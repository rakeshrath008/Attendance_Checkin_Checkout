import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import HorlidaysCalendar from './HolidaysCalender';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const Holidays = () => {
  const [leaveDays, setLeaveDays] = useState([]);
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
  

  const handleLeaveDay = (date, token) => {
    if (!date) {
      console.error('Date is null or undefined');
      return;
    }
  
    const leaveDay = leaveDays.find((day) => day.date.getTime() === date.getTime());
    if (leaveDay) {
      const confirmed = window.confirm('Are you sure you want to delete?');
      if (!confirmed) {
        return;
      }
  
      setLeaveDays(leaveDays.filter((day) => day.date.getTime() !== date.getTime()));
  
      fetch(`http://localhost:5000/leave/${date.getTime()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(() => {
          setTimeout(() => {
            console.log('Leave day removed successfully');
          }, 100);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className='bg-white h-screen w-screen relative'>
      <HorlidaysCalendar />
      <div className="w-full absolute mt-1 overflow-y-auto h-64">
        <table className="border border-b-[.1rem] w-full table-fixed">
          <thead className='sticky -top-1 bg-white z-10'>
            <tr className='bg-slate-100 text-gray-700'>
              <th className="py-1">Created by</th>
              <th className="py-1">Date</th>
              <th className="py-1">Details</th>
              <th className="py-1">Delete</th>
            </tr>
          </thead>
          <tbody className='border border-b-[.1rem]'>
            {leaveDays.map((day, index) => (
              <tr key={index} className='border border-b-[.1rem]'>
                <td className="text-center py-1 opacity-95">{day.username}</td>
                <td className="text-center py-1 opacity-95">{day.date.toDateString()}</td>
                <td className="text-center py-1 opacity-95">{day.details}</td>
                <td className="text-center py-1 opacity-95">
                  <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleLeaveDay(day.date,token)} className="ml-2 w-4 text-red-400 hover:text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Holidays;