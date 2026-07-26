import { createContext, useContext, useState } from 'react';
import { contentData } from '../data/content';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('th'); // Default เป็นภาษาไทย
  const [content, setContent] = useState(contentData.th); // Default Content เป็นไทย

  const changeLanguage = (newLang) => {
    setLang(newLang);
    setContent(contentData[newLang]);
    window.scrollTo(0, 0); // Reset scroll ไปหัวหน้าเวลาเปลี่ยนภาษา
  };

  return (
    <LanguageContext.Provider value={{ lang, content, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
