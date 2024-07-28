${BASE_URL}import axios, { Axios } from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    profilephoto: "",
    gender: ""
  })

  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender })
  }

  const defaultProfileImages = {
    male: 'default-male-profile.png',
    female: 'default-female-profile.png',
  };

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result.replace(/^data:image\/\w+;base64,/, ''));
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Failed to convert image to base64'));
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    let profilephoto = user.profilephoto;

    if (!profilephoto && user.gender) {
      const imageUrl = defaultProfileImages[user.gender];
      profilephoto = await convertImageToBase64(imageUrl);
    }

    const updatedUser = { ...user, profilephoto };
    setUser(updatedUser);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, updatedUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }

    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
    }

    setUser({
      fullName: "",
      userName: "",
      password: "",
      confirmPassword: "",
      profilephoto: "",
      gender: ""
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
        <h1 className='text-2xl mt-4 mb-2 font-bold text-center text-gray-300'>Signup</h1>
        <form onSubmit={onSubmitHandler}>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Full Name
              </span>
            </label>
            <input value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} className='w-full input input-border text-myclr3 border-slate-700 h-10 bg-myclr4' type='text' placeholder='Full Name'></input>
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Username
              </span>
            </label>
            <input value={user.userName} onChange={(e) => setUser({ ...user, userName: e.target.value })} className='w-full input input-border text-myclr3 border-slate-700 h-10 bg-myclr4' type='text' placeholder='Username'></input>
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Password
              </span>
            </label>
            <input value={user.Password} onChange={(e) => setUser({ ...user, password: e.target.value })} className='w-full input input-border text-myclr3 border-slate-700 h-10 bg-myclr4' type='password' placeholder='Password'></input>
          </div>
          <div>
            <label className='label p-2'>
              <span className='text-base label-text'>
                Confirm Password
              </span>
            </label>
            <input value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} className='w-full input input-border text-myclr3 border-slate-700 h-10 bg-myclr4' type='password' placeholder='Confirm Password'></input>
          </div>
          <div className='flex items-center my-4'>
            <div className='flex items-center'>
              <p>Male</p>
              <input checked={user.gender === "male"} onChange={() => handleCheckbox("male")} type="checkbox" className="checkbox mx-2" />
            </div>
            <div className='flex items-center'>
              <p>Female</p>
              <input checked={user.gender === "female"} onChange={() => handleCheckbox("female")} type="checkbox" className="checkbox mx-2" />
            </div>
          </div>
          <p className='text-center my-2'>Already have an account?
            <Link to='/login' className='text-myclr2 hover:text-myclr3'>
              Login
            </Link>
          </p>
          <div>
            <button type='submit' className='btn btn-block btn-md mt-2 text-myclr3 border border-myclr3 bg-myclr hover:bg-myclr2 hover:text-black '>Signup</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
