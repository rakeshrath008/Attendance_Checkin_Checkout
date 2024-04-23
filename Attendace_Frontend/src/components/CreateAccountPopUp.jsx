import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CreateAccountPopUp = ({setShowPopUp}) => {

    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        empId: '',
        role: ''
    });
    const [message, setMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const errors = validateForm();
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }

            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message);
                throw new Error('Failed to submit form');
            }

            setForm({});
            setSubmitted(true);
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };

    const handleForm = (e) => {
        console.log()
        setForm({ ...form, [e.target.name]: e.target.value });
        setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const errors = {};

        if (!form.role) {
            errors.role = "Please select a role";
        }

        if (!form.username.trim()) {
            errors.username = 'Username is required';
        } else if (form.username.length < 4 || form.username.length > 30) {
            errors.username = 'Username must be between 4 and 20 characters';
        } else if (!/^[A-Za-z0-9@' ']+$/.test(form.username)) {
            errors.username = 'Username can only contain letters,at the rate of and numbers';
        }

        if (!form.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(form.email)) {
            errors.email = 'Invalid email format';
        }

        if (!form.password) {
            errors.password = 'Password is required';
        } else if (form.password.length < 8 || form.password.length > 20) {
            errors.password = 'Password must be between 8 and 20 characters';
        }
        else if (!/^[a-zA-Z0-9@#%]+$/.test(form.password)) {
            errors.password = 'password can only contain letters, numbers, and dollar, hash and percentage';
        }

        if (!form.confirmPassword) {
            errors.confirmPassword = 'Password not matched';
        } else if (form.confirmPassword !== form.password) {
            errors.confirmPassword = 'Password and Confirm Password do not match';
        }

        if (!form.empId.trim()) {
            errors.empId = 'EmployeeID is required';
        } else if (!/^[0-9]+$/.test(form.empId)) {
            errors.empId = 'Employee ID can only contain only numbers';
        }

        return errors;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    return (
        <div className="flex items-center justify-center bg-gray-900 bg-opacity-50 fixed inset-0 z-50">
          <div className="bg-slate-50 p-4 rounded-2xl border-2 h-fit w-[40%] relative ">
            <div>
              <span className="absolute left-8 text-2xl opacity-90 font-bold mb-2">Create Account</span>
              <button onClick={()=>setShowPopUp(false)} className="absolute right-4 top-3 text-red-600 text-3xl"><FontAwesomeIcon icon={faTimes} /></button>
            </div><br /><br />
            {submitted ? (
              <p className='text-green-600'>Your details submitted successfully!</p>
            ) : (
              <form className='flex flex-col space-y-7 justify-center items-center' onSubmit={handleSubmit}>
                <div className="w-[90%] relative">
                  <label htmlFor="username" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Username</label>
                  <input type="text" name='username' id='username' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white'  value={form.username || ''} onChange={handleForm} />
                  {validationErrors.username && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.username}</p>)}
                </div>
  
                <div className="w-[90%] relative">
                  <label htmlFor="empId" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>EmployeeID</label>
                  <input type="text" name='empId' id='empId' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white' value={form.empId || ''} onChange={handleForm}/>
                  {validationErrors.empId && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.empId}</p>)}
                </div>
  
                <div className="w-[90%] relative">
                  <label htmlFor="email" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Email</label>
                  <input type="email" name='email' id='email' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white'value={form.email || ''} onChange={handleForm}/>
                  {validationErrors.email && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.email}</p>)}
                </div>
  
                <div className="w-[90%] relative">
                  <label htmlFor="role" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Role</label>
                  <select id="role" name="role" className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-opacity-70 text-black border-[#676666] bg-white' value={form.role || ''} onChange={handleForm}>
                    <option value="">-Select Role-</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="hr">Hr</option>
                  </select>
                  {validationErrors.role && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.role}</p>)}
                </div>
  
                <div className="w-[90%] relative">
                  <label htmlFor="password" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Password</label>
                  <input type="password" name='password' id='password' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white' value={form.password || ''} onChange={handleForm}/>
                  {validationErrors.password && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.password}</p>)}
                </div>
  
                <div className="w-[90%] relative">
                  <label htmlFor="confirmPassword" className='absolute text-[.75rem] text-gray-600 tracking-wide -top-2 left-3 z-20 bg-white rounded-full px-1'>Confirm Password</label>
                  <input type="confirmPassword" name='confirmPassword' id='confirmPassword' className='outline-none border-2 border-opacity-40 h-10 w-full rounded-xl p-2 text-black border-[#676666] bg-white' value={form.confirmPassword || ''} onChange={handleForm}/>
                  {validationErrors.confirmPassword && (<p className='text-sm absolute top-full right-0 ml-1' style={{ color: 'red' }}>{validationErrors.confirmPassword}</p>)}
                </div>
                <div className='w-[90%] relative'>
                <button type='submit' className='border h-10 w-full text-white bg-[#212121] hover:text-blue-100 hover:bg-slate-800 rounded-xl tracking-wider'>Submit</button>
                <div>
                </div>  
                </div>
                {message && <p className="text-red-500">{message}</p>}
              </form>
            )}
          </div>
        </div>
      );
};

export default CreateAccountPopUp
