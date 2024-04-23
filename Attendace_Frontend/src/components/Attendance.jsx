import React, { useEffect, useState } from "react";
import { FaSignInAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import AttendanceList from "./AttendanceList";

export default function Attendance() {
  const [submissionType, setSubmissionType] = useState('entry');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const userID = Cookies.get('userId');
  const username = Cookies.get('username');
  const token = Cookies.get('token');
  useEffect(() => {
    const options = {
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5000/time/${userID}/lastData`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.type === 'entry') {
            setSubmissionType('exit');
            const entryTime = new Date(responseData.time);
            const indianTime = entryTime.toLocaleTimeString('en-US', options);
            setSubmissionStatus(`Check in at ${indianTime}`);
          } else if (responseData.type === 'exit') {
            const exitTime = new Date(responseData.time);
            const indianTime = exitTime.toLocaleTimeString('en-US', options);
            setSubmissionStatus(`Checkout at ${indianTime}`);
          } else {
            console.error('No entry or exit time found');
          }
        } else {
          console.error('Failed to fetch last data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching last data:', error);
      }
    }

    fetchData();
  }, [userID, token]);

  const handleSubmission = async () => {
    try {
      if (submissionType === null) {
        return;
      }

      const isEntry = submissionType === 'entry';
      const response = await sendTime(isEntry);
      const data = await response.json();
      displaySubmissionStatus(data, isEntry ? 'Entry' : 'Exit');
    } catch (error) {
      console.error('Error during submission:', error.message);
    }
  };

  const sendTime = async (isEntry) => {
    const response = await fetch(`http://localhost:5000/time/createTime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: userID,
        username: username,
        entry: isEntry,
        exit: !isEntry,
      }),
    });
    return response;
  };

  const displaySubmissionStatus = (data, eventType) => {
    if (!data || !data[`${eventType.toLowerCase()}Time`]) {
      console.error(`Invalid data received for ${eventType} submission.`);
      return;
    }

    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };

    const eventTimeIST = new Date(data[`${eventType.toLowerCase()}Time`]).toLocaleTimeString('en-US', options);

    if (eventType === 'Entry') {
      setSubmissionStatus(`Check in at ${eventTimeIST}`);
    } if (eventType === 'Exit') {
      setSubmissionStatus(`Checkout at ${eventTimeIST}`);
    }
  };

  return (
    <div className=" bg-white w-screen">
      <div className='flex flex-col items-center text-center justify-center font-serif'>
        <div className='flex flex-col items-center justify-center text-center mt-2'>
          <span onClick={() => setSubmissionType(submissionType === 'exit' ? 'entry' : 'exit')}>
            <FaSignInAlt onClick={handleSubmission} className='size-[100px] mt-5 cursor-pointer' color={submissionType === 'entry' ? "green" : "red"} />
          </span>
          <div>
            {submissionType === 'entry' ? <p className='text-purple-700 font-bold'>{submissionStatus}</p> : <p className='text-purple-700 font-bold'>{submissionStatus}</p>}
          </div>
        </div>
        {/* <HorizontalCalendar /> */}
      </div>
      <AttendanceList />
    </div>
  );
}
