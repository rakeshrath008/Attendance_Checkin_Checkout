import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus , faFilter, faFileExport, faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import CreateAccountPopUp from './CreateAccountPopUp';
import EditAccountPopUp from './EditAccountPopUp';

const Manage_Users = () => {
  const [userData, setData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);
  const popupRef = useRef(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showEditPopUp , setShowEditPopUp] = useState(false);
  const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUserData = userData.filter((user) =>
  user.Username.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(()=>{
    fetchData();
  },[userData]);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token')
      const response = await fetch('http://localhost:5000/users/allusers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTogglePopup = (index) => {
    setIsPopupOpen(!isPopupOpen);
    setPopupIndex(index === popupIndex ? null : index);
  };
  const [userID, setUserID] = useState(null);
  const handleEditClick = (userId) => {
    setUserID(userId);
    setShowEditPopUp(!showEditPopUp);
  };

  const handleDeleteClick = async (userId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (isConfirmed) {
      await deleteConfirmed(userId);
    }
  };

  const deleteConfirmed = async (userId) => {
    try {
      const token = Cookies.get('token');
      await fetch(`http://localhost:5000/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setShowDeleteSuccessMessage(true);
      fetchData();
      setTimeout(() => {
        setShowDeleteSuccessMessage(false);
    }, 1000);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='bg-white justify-center items-center text-center h-screen w-screen relative'>
      <div className='flex flex-row h-12 '>
        <div className='absolute justify-center items-center text-center flex flex-row gap-10 w-[60%] h-12 left-2 '>
          <p className='font-bold opacity-85 text-xl'>Users list</p>
          <input
            type="search"
            placeholder='Search'
            className='border w-[70%] rounded-full p-2'
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className='absolute flex flex-row items-center text-green h-12 gap-8 right-8'>
          <div className='cursor-pointer flex flex-row absolute h-full w-full right-44 top-2'>
            <FontAwesomeIcon icon={faUserPlus } className='text-blue-600 mr-1 mt-1 text-xl' onClick={()=> setShowPopUp(!showPopUp)}/>
            <button className='bg-[#212121] text-white w-full h-[60%] rounded-full text-center' onClick={()=> setShowPopUp(!showPopUp)} >Create User</button>
          </div>
          <div className='cursor-pointer'>
            <FontAwesomeIcon icon={faFilter} className='text-green-600 mr-2' />
            <span>Filter</span>
          </div>
          <div className='cursor-pointer'>
            <FontAwesomeIcon icon={faFileExport} className='text-cyan-600 mr-2' />
            <span>export</span>
          </div>
        </div>
      </div>
      <div className='absolute text-left items-center justify-center overflow-scroll overflow-x-hidden h-[92%] w-full bg-white'>
      <table className="border border-b-[.1rem] w-full items-center table-fixed">
    <thead className='sticky top-0 bg-white z-10'>
      <tr className="bg-slate-100 text-gray-700">
        <th className="py-2 opacity-60 text-center">Employee_ID</th>
        <th className="py-2 opacity-60">Username</th>
        <th className="py-2 opacity-60">Email</th>
        <th className="py-2 opacity-60 text-center">Role</th>
        <th className="py-2 opacity-60 text-center">Actions</th>
      </tr>
    </thead>
    <tbody className='border border-b-[.1rem]'>
      {filteredUserData.map((user, index) => (
        <tr key={index} className="border border-b-[.1rem]">
          <td className="py-2 text-center opacity-95">{user.Employee_ID}</td>
          <td className="py-2 text-left opacity-95">{user.Username}</td>
          <td className="py-2 text-left opacity-95">{user.Email}</td>
          <td className="py-2 text-center opacity-95">{user.Role}</td>
          <td className="py-2 text-center opacity-95">
            <div className="relative">
              <FontAwesomeIcon icon={faEllipsisV} className="cursor-pointer w-3 " onClick={() => { handleTogglePopup(index) }}/>
              {popupIndex === index && (
                <div className="absolute right-0 bottom-1 w-[5.6pc] bg-white border border-gray-200 rounded-md shadow-lg z-50" ref={popupRef}>
                  <button onClick={() => handleDeleteClick(user.userId)} className="block w-full text-center py-2 px-4 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 focus:outline-none">Delete</button>
                  <button onClick={() => handleEditClick(user.userId)} className="block w-full text-center py-2 px-4 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none">Edit</button>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
        <div className='absolute w-full text-center'>{showDeleteSuccessMessage && <span className='text-red-600'>User deleted successfully</span>}</div>
      </div>
      {showPopUp && <CreateAccountPopUp setShowPopUp={setShowPopUp}/>}
      {showEditPopUp && <EditAccountPopUp setShowEditPopUp={setShowEditPopUp} userId={userID}/>}
    </div>
  );
};

export default Manage_Users;