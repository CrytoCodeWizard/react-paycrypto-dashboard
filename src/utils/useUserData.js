/* eslint-disable import/no-unresolved */
import { useState, useEffect } from 'react';

import axios, { endpoints } from './axios';

const useUserData = (id) => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    axios
      .get(endpoints.user.list)
      .then((response) => {
        setUserData(response.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return {
    userData,
  };
};

export default useUserData;
