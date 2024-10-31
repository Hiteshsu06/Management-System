// components
import { useEffect, useState } from "react";
import { Menu } from "primereact/menu";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({selectSidebarItem}) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  let data = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Update the active item based on the current URL
    const path = location.pathname;
    if (path === "/dashboard") {
      setActiveItem("company");
    } else if (path.includes("/dashboard/stock-management")) {
      setActiveItem("stock_management");
    } else if (path.includes("/dashboard/users")) {
      setActiveItem("users");
    } else if (path.includes("/dashboard/sector-master")) {
      setActiveItem("sector_master");
    } else if (path.includes("/dashboard/indices")) {
      setActiveItem("indices");
    } else if (path.includes("/dashboard/stocks")) {
      setActiveItem("stocks");
    }
    selectSidebarItem(false)
  }, [location]);

  const items = [
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-community-line mr-2"></i>
          <span>{t("company")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard");
      },
      className: activeItem === "company" ? "active" : "",
      allowedRoles: ["viewer", "super_admin"]
    },
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-store-line mr-2"></i>
          <span>{t("stock_management")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard/stock-management");
      },
      className: activeItem === "stock_management" ? "active" : "",
      allowedRoles: ["viewer", "super_admin"]
    },
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-government-line mr-2"></i>
          <span>{t("sector_master")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard/sector-master");
      },
      className: activeItem === "sector_master" ? "active" : "",
      allowedRoles: ["admin", "super_admin"]
    },
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-bar-chart-line mr-2"></i>
          <span>{t("indices")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard/indices");
      },
      className: activeItem === "indices" ? "active" : "",
      allowedRoles: ["admin", "super_admin"]
    },
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-archive-stack-line mr-2"></i>
          <span>{t("stocks")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard/stocks");
      },
      className: activeItem === "stocks" ? "active" : "",
      allowedRoles: ["admin", "super_admin"]
    },
    {
      label: (
        <div className="flex items-center py-[2px]">
          <i className="ri-group-line mr-2"></i>
          <span>{t("users")}</span>
        </div>
      ),
      command: () => {
        navigate("/dashboard/users");
      },
      className: activeItem === "users" ? "active" : "",
      allowedRoles: ["super_admin"]
    },
  ];
  
  const accessibleItems = items.filter(item =>
    item.allowedRoles.some(role => [data?.role]?.includes(role))
  );

  return (
    <div className="min-h-screen mobile-screen-view-point bg-BgTertiaryColor text-TextPrimaryColor">
      <div className="px-5 py-4">
        <div>LOGO</div>
        <div className="text-[0.6rem] hidden lg:block">{t("management_system")}</div>
      </div>
      <Menu
        model={accessibleItems}
        className="custom-menu-container bg-BgTertiaryColor p-0 text-[0.8rem]"
      />
    </div>
  );
}

export default Sidebar;
