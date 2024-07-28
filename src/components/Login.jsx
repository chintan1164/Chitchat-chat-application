import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/userSlice'
import { BASE_URL } from '..'

const Login = () => {
  const [user, setUser] = useState({
    userName: "",
    password: ""
  })

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('Response:', res);

      navigate("/");

      dispatch(setAuthUser(res.data))

    } catch (error) {
      console.error('Error object:', error);
      if (error.response) {
        toast.error(error.response.data.message);
        console.log('Error response data:', error.response.data);
      } else if (error.request) {
        toast.error("No response received from server. Please try again later.");
        console.log('Error request:', error.request);
        console.log('Request configuration:', error.config);
      } else {
        toast.error("An error occurred while setting up the request. Please try again.");
        console.log('Error message:', error.message);
        console.log('Error config:', error.config);
      }
    }

    setUser({
      userName: "",
      password: ""
    })
  }
  return (
    <div className="min-w-96 mx-auto bg-myblue">
      <div className='w-full p-6 rounded-lg border border-myclr3 shadow-md'>
        <div>
          <span onClick={() => window.location.reload()} className="text-4xl font-bold text-white mr-auto tracking-wide cursor-pointer flex items-center justify-center" >
            <img src='ChitChat2.png' class='w-14 h-14 mr-1' alt="ChitChat Logo" />
            Chit<span className="text-myclr2 text-3xl">Chat</span>
          </span>
        </div>
        <h1 className='text-2xl mt-4 mb-2 font-bold text-center text-gray-300'>Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Username
              </span>
            </label>
            <input value={user.userName} onChange={(e) => setUser({ ...user, userName: e.target.value })} className='w-full input text-myclr3 input-border border-slate-700 h-10 bg-myclr4' type='text' placeholder='Username'></input>
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Password
              </span>
            </label>
            <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} className='w-full input text-myclr3 input-border border-slate-700 h-10 bg-myclr4' type='password' placeholder='Password'></input>
          </div>
          <p className='text-center my-2'>Don't have an account?
            <Link to='/register' className='text-myclr2 hover:text-myclr3'>
              Signup
            </Link>
          </p>
          <div>
            <button type='submit' className='btn btn-block btn-md mt-2 text-myclr3 border border-myclr3 bg-myclr hover:bg-myclr2 hover:text-black hover:drop-shadow-md'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
