// components
import { Topbar, Sidebar, CompanyList, StockManagementList, StockList, SectorList, IndicesList } from "@components";
import Loading from "@common/Loading";

// utils
import { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const [toggle, setToggle] = useState(true);
  const { t } = useTranslation("msg");
  const toggleExpansionSwitch = (key) => {
    setToggle(key);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-BgPrimaryColor">
      <div className={`sidebar ${toggle ? "open" : "closed"} h-full min-w-[60px]  max-lg:max-w-[60px]`}>
        <Sidebar />
      </div>
      <div className="w-full">
        <Topbar toggleExpansionSwitch={toggleExpansionSwitch} />
        <div className="h-[calc(100%_-_4rem)] bg-BgPrimaryColor px-5 py-2">
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
