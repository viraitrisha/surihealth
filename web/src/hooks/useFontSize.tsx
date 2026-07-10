import { useState, useEffect } from 'react';

export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(62.5);

  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) {
      setFontSize(parseFloat(saved));
      document.documentElement.style.fontSize = saved + '%';
    }
  }, []);

  const updateFontSize = (value: number) => {
    setFontSize(value);
    document.documentElement.style.fontSize = value + '%';
    localStorage.setItem('fontSize', value.toString());
  };

  return { fontSize, updateFontSize };
};