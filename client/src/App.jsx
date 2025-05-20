import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import ChatPage from './components/ChatPage'

const App = () => {
  // const { user } = useSelector(store => store.auth);
  // const { socket } = useSelector(store => store.socketio);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (user) {
  //     const socketio = io('http://localhost:8000', {
  //       query: { userId: user?._id },
  //       transports: ['websocket']
  //     });

  //     dispatch(setSocket(socketio));

  //     socketio.on('getOnlineUsers', (onlineUsers) => {
  //       dispatch(setOnlineUsers(onlineUsers));
  //     });

  //     socketio.on('notification', (notification) => {
  //       dispatch(setLikeNotification(notification));
  //     });

  //     return () => {
  //       socketio.close();
  //       dispatch(setSocket(null));
  //     };
  //   } else if (socket) {
  //     socket.close();
  //     dispatch(setSocket(null));
  //   }
  // }, [user, dispatch]);
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/signup" element={<Signup />} /> 
    <Route path="/login" element={<Login />} />
     {/* Protected routes inside MainLayout */}
     <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />}/>
          <Route path="profile/:id" element={<Profile />} />
          <Route path= "/chat" element={<ChatPage/>} />
      </Route>
   </Routes>
   </BrowserRouter>
   </>
  )
}

export default App