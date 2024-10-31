// components
import { 
  Topbar, 
  Sidebar, 
  CompanyList, 
  StockManagementList, 
  StockList, 
  SectorList, 
  IndicesList, 
  UserList 
} from "@components";
import { PrivateRoute } from "../App";
import Loading from "@common/Loading";

// utils
import { Suspense, useState, useLayoutEffect, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const refrainTags = ["BUTTON", "INPUT", "I", "IMG"];

const DashboardPage = () => {
  const [toggle, setToggle] = useState(true);
  const { t } = useTranslation("msg");
  const [searchField, setSearchField] = useState("");
  const location = useLocation();
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

  useEffect(() => {
    setSearchField("")
  }, [location]);

  const selectSidebarItem=()=>{
    if (window.innerWidth <= 1024 && toggle) {
      setToggle(false);
    }
  }

  const slideHandler=(event)=>{
    if(event?.touches[0].clientX){
      setToggle(false);
    }
  }

  const searchChangeHandler=(e)=>{
    setSearchField(e.target.value);
  }

  return (
    <div className="flex overflow-hidden bg-BgPrimaryColor h-[100svh]">
      <div className={`sidebar ${toggle ? "open" : "closed"} min-w-fit  max-lg:max-w-[60px] max-lg:absolute max-lg:z-10`}>
        <Sidebar selectSidebarItem={selectSidebarItem}/>
      </div>
      <div className="w-full min-h-screen max-h-full" onClick={handleClick} onTouchMove={(e)=>{slideHandler(e)}}>
        <Topbar toggleExpansionSwitch={toggleExpansionSwitch} toggle={toggle} searchChangeHandler={searchChangeHandler} searchField={searchField}/>
         <div className="bg-BgPrimaryColor px-5 py-2 overflow-y-scroll h-[90svh] content-scroll-bar">
          <Suspense fallback={<Loading loadingText={t("loading")} />}>
            <Routes>
              <Route path="/" element={
                <PrivateRoute
                role={['super_admin', 'viewer']}>
                    <CompanyList search={searchField}/>
                </PrivateRoute>}
              />
              <Route path="/users" element={
                  <PrivateRoute
                      role={['super_admin']}>
                      <UserList search={searchField}/>
                  </PrivateRoute>}
              />
              <Route path="/stock-management" element={
                <PrivateRoute
                    role={['super_admin', 'viewer']}>
                    <StockManagementList search={searchField}/>
                </PrivateRoute>}
              />
              <Route path="/stocks" element={
                <PrivateRoute
                    role={['super_admin', 'admin']}>
                    <StockList search={searchField}/>
                </PrivateRoute>}
              />
              <Route path="/sector-master" element={
                <PrivateRoute
                    role={['super_admin', 'admin']}>
                    <SectorList search={searchField}/>
                </PrivateRoute>}
              />
              <Route path="/indices" element={
                <PrivateRoute
                    role={['super_admin', 'admin']}>
                    <IndicesList search={searchField}/>
                </PrivateRoute>}
              />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
