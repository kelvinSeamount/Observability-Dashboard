import { useTheme } from "../../contexts/ThemeContext";
import { Globe, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";


interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({onMenuClick}:HeaderProps) => {

  const { theme, toggleTheme } = useTheme();
  const langMenuRef = useRef<HTMLDivElement>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(()=>{
    function handleClickOutside(event:MouseEvent){
      if(langMenuRef.current && !langMenuRef.current.contains(event.target as Node)){
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown',handleClickOutside)
    return ()=>{
      document.removeEventListener('mousedown',handleClickOutside)
    }
  },[])
  
  const languages = [
    { code: "en", label: t("header.english") },
    { code: "de", label: t("header.german") },
    { code: "fr", label: t("header.french") },
    { code: "es", label: t("header.spanish") },
  ];

  const changeLanguage= async(lng:string)=>{
    await i18n.changeLanguage(lng)
   localStorage.setItem('i18nextLng',lng)
    setLangMenuOpen(false)
  }
  return (
    <header className="stick top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-800 transition-colors focus-ring flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            <span className="hidden md:inline-block text-sm">
              {t("header.language")}
            </span>
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z.10 animate-fadeIn">
              {languages.map((lang)=>(
                <button key={lang.code} onClick={()=>changeLanguage(lang.code)}
                className={`flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:bg-gray-700 ${i18n.language ===lang.code ?'text-primary':'text-gray-700 dark:text-gray-200'}`}
                >{lang.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
