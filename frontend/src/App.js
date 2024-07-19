import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/signup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';
// import { setAuthUser } from '../redux/userSlice'


function App() {
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser != null ? <Homepage /> : <Login />,
    },
    {
      path: "/register",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    }
  ])

  useEffect(() => {
    if (authUser) {
      const socketio = io(`${BASE_URL}`, {
        query: {
          userId: authUser._id
        }
      });
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () => socketio.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }

  }, [authUser]);

  return (
    <div className="h-screen flex items-center justify-center bg-mybg">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
