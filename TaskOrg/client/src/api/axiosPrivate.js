import axios from "axios";
import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";

export const axiosPublic = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

const axiosPrivate = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export const useAxiosPrivate = () => {
  const { accessToken, setAccessToken, logoutUser } = useUserContext();

  useEffect(() => {

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );


    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const res = await axiosPublic.get("/users/refresh-token");
            const newToken = res.data.accessToken;

            setAccessToken(newToken);
            prevRequest.headers["Authorization"] = `Bearer ${newToken}`;

            return axiosPrivate(prevRequest); 
          } catch (err) {
            logoutUser();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken, logoutUser]);

  return axiosPrivate;
};
