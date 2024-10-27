// utils
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// components
import InputTextComponent from "@common/InputTextComponent";
import AvatarProfile from "@common/AvatarProfile";

const Topbar = ({ toggleExpansionSwitch, toggle, searchChangeHandler, searchField }) => {
  const { t } = useTranslation("msg");
  const [expand, setExpand] = useState(true);
  const [theme, setTheme] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [searchvalue, setSearchValue] = useState("");

  const toggleTheme = () => {
    setTheme(!theme);
    if (theme) {
      document.querySelector("body").setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      if(theme === "dark"){
        document.documentElement.classList.add("dark");
      }
      else{
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.querySelector("body").setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  };

  useEffect(()=>{
    setSearchValue(searchField);
  },[searchField])

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
    const selectedTheme = localStorage.getItem("theme");
    if (selectedTheme === "dark") {
      setTheme(true);
      document.querySelector("body").setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme(false);
      document.querySelector("body").setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(()=>{
    setExpand(toggle)
  },[toggle]);

  return (
    <div className="flex h-16 w-full items-center gap-4 bg-BgTertiaryColor px-5">
      <button
        className={`toggle-button col-span-1 ${expand ? "expanded" : ""}`}
        onClick={() => {
          setExpand(!expand);
          toggleExpansionSwitch(!expand); // Fix the argument to toggleExpansionSwitch
        }}
      >
        <i
          className={`icon text-2xl text-TextPrimaryColor ${expand ? "ri-menu-fold-2-line rotate" : "ri-menu-unfold-2-line"}`}
        ></i>
      </button>
      <div className="grid w-full grid-cols-12 gap-2">
        <div className="col-span-8 max-sm:hidden flex items-center">
          <InputTextComponent
            type="text"
            placeholder={t("search")}
            value={searchvalue}
            onChange={(e)=>searchChangeHandler(e)}
            name="searchvalue"
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 max-sm:col-span-12 flex justify-end text-TextPrimaryColor">
          <button onClick={toggleTheme} className="me-8 text-xl">
            {theme ? (
              <i className="ri-sun-line"></i>
            ) : (
              <i className="ri-contrast-2-fill"></i>
            )}
          </button>
          <AvatarProfile shape="circle" userDetails={userDetails} />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
