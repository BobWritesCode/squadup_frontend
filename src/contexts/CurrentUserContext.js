import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';
import {
  axiosDefaultsBaseUrl,
  axiosDefaultsHeadersPostContentType,
  axiosDefaultsWithCredentials,
} from '../api/axiosDefaults';
import PropTypes from 'prop-types';


axios.defaults.baseURL = axiosDefaultsBaseUrl;
axios.defaults.headers.post['Content-Type'] =
  axiosDefaultsHeadersPostContentType;
axios.defaults.withCredentials = axiosDefaultsWithCredentials;

export const axiosReq = axios.create();
export const axiosRes = axios.create();

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get('/dj-rest-auth/user/');
      setCurrentUser(data);
    } catch (err) { /* empty */ }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                navigate('/signin');
              }
              return null;
            });
            removeTokenTimestamp();
            return config;
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      },
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post('/dj-rest-auth/token/refresh/');
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                navigate('/signin');
              }
              return null;
            });
            removeTokenTimestamp();
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      },
    );
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};

// Props validation
CurrentUserProvider.propTypes = {
  children: PropTypes.any,
};
