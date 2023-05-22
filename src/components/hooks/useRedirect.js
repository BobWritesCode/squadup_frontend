import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const useRedirect = (userAuthStatus) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post('/dj-rest-auth/token/refresh/')
        // if user is logged in:
        if (userAuthStatus === 'loggedIn') {
        }
      } catch (error) {
        if (error.response.data.code === 'token_not_valid') {
          navigate('/signin')
        }
      }
    }
    handleMount();
  }, [navigate, userAuthStatus])
}
