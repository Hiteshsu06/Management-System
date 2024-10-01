// components
import { Topbar, Sidebar, CompanyList, StockManagementList, StockList, SectorList, IndicesList } from "@components";
import Loading from "@common/Loading";

// utils
import { Suspense, useState, useLayoutEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

const refrainTags = ["BUTTON", "INPUT", "I", "IMG"];

const DashboardPage = () => {
  const [toggle, setToggle] = useState(true);
  const { t } = useTranslation("msg");
  const toggleExpansionSwitch = (key) => {
    setToggle(key);
  };

   // Function to handle click
   const handleClick = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 1024 && toggle && !refrainTags.includes(e?.target?.tagName)) {
      setToggle(false);
    }
  };

  useLayoutEffect(()=>{
    if (window.innerWidth <= 1024 && toggle) {
      setToggle(false);
    }
  },[]);

  const selectSidebarItem=()=>{
    if (window.innerWidth <= 1024 && toggle) {
      setToggle(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-BgPrimaryColor">
      <div className={`sidebar ${toggle ? "open" : "closed"} h-full min-w-fit  max-lg:max-w-[60px] max-lg:absolute max-lg:z-10`}>
        <Sidebar selectSidebarItem={selectSidebarItem}/>
      </div>
      <div className="w-full" onClick={handleClick}>
        <Topbar toggleExpansionSwitch={toggleExpansionSwitch} toggle={toggle}/>
        <div className="bg-BgPrimaryColor px-5 py-2">
          <Suspense fallback={<Loading loadingText={t("loading")} />}>
            <Routes>
              <Route path="/" element={<CompanyList />} />
              <Route
                path="/stock-management"
                element={<StockManagementList />}
              />
              <Route
                path="/stocks"
                element={<StockList />}
              />
              <Route
                path="/sector-master"
                element={<SectorList />}
              />
               <Route
                path="/indices"
                element={<IndicesList />}
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
