import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue, expirationTime) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item);
      const currentTime = new Date().getTime();
      if (parsedItem.expires && parsedItem.expires > currentTime) {
        return parsedItem.value;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    const currentTime = new Date().getTime();
    const expires = currentTime + expirationTime;
    localStorage.setItem(key, JSON.stringify({ value, expires }));
  }, [key, value, expirationTime]);

  return [value, setValue];
};

export default useLocalStorage;
