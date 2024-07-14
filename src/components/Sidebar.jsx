import { Menu } from "primereact/menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const items = [
    {
      label: t("company"),
      icon: "ri-community-line",
      command: () => {
        navigate("/dashboard");
      },
    },
    {
      label: t("stock_management"),
      icon: "ri-store-line",
      command: () => {
        navigate("/dashboard/stock-management");
      },
    },
  ];

  return (
    <div className="h-full bg-BgTertiaryColor text-TextPrimaryColor">
      <div className="p-5">
        <div>LOGO</div>
        <div className="text-[0.6rem]">{t("management_system")}</div>
      </div>
      <Menu
        model={items}
        className="custom-menu-container bg-BgTertiaryColor p-0 text-[0.8rem]"
      />
    </div>
  );
};

export default Sidebar;
