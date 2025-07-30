import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  //   Class: Module 61

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => {
        // console.log("Response inside of axios interceptors: ", res);
        return res;
      },
      (error) => {
        // console.log("Error inside of axios interceptors:", error?.response);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          logout().then(() => {
            navigate("/");
          });
        } else {
          // Reject any non-auth errors to be handled in onSubmit
          return Promise.reject(error);
        }
      }
    );
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
