import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { io } from "socket.io-client";
export const AuthContext = createContext();
axios.defaults.baseURL = backendUrl;
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState();
  const [socket, setSocket] = useState(null);
  // check if user is authenticated and if so, set the user data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // login function to handle user authentication and socket connection

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/v1/user/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
      }
    } catch (error) {}
  };

  // connect socket fuction to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUser", (userId) => {
      setOnlineUser(userId);
    });
  };
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);
  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
