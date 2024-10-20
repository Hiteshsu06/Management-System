import React, { useRef } from "react";
import { TieredMenu } from "primereact/tieredmenu";
import { Avatar } from "primereact/avatar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { allApiWithHeaderToken } from "@api/api";

const AvatarProfile = ({ size, shape }) => {
  let data = JSON.parse(localStorage.getItem("user"));
  const menu = useRef(null);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const items = [
    {
      label: t("my_profile"),
      icon: "ri-id-card-line",
      command: () => {
        navigate('/edit-profile')
      }
    },
    {
      label: t("help"),
      icon: "ri-questionnaire-line",
    },
    {
      label: t("languages"),
      icon: "ri-global-line",
      items: [
        {
          label: t("english"),
          command: () => {
            localStorage.setItem("i18nextLng", "en");
            window.location.reload();
          },
        },
        {
          label: t("hindi"),
          command: () => {
            localStorage.setItem("i18nextLng", "hi");
            window.location.reload();
          },
        },
        {
          label: t("swedish"),
          command: () => {
            localStorage.setItem("i18nextLng", "sv");
            window.location.reload();
          },
        },
      ],
    },
    {
      label: t("logout"),
      icon: "ri-logout-circle-r-line",
      command: () => {
        allApiWithHeaderToken(`users/sign_out`,"", "delete")
        .then((response) => {
          if(response?.status === 200){
           navigate('/');
           let theme = localStorage.getItem("theme");
           localStorage.clear();
           localStorage.setItem("theme", theme);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
      },
    },
  ];

  return (
    <div className="card justify-content-center flex text-TextPrimaryColor">
      <div className="me-4">
        <div className="text-[0.8rem]">{data?.email}</div>
        <div className="text-[0.6rem]">{t("super_admin")}</div>
      </div>
      <Avatar
        label={data?.firstName?.split("")[0]?.toUpperCase()}
        className="avatar-background"
        size={size}
        shape={shape}
        onClick={(e) => menu.current.toggle(e)}
      />
      <TieredMenu
        model={items}
        popup
        ref={menu}
        breakpoint="767px"
        className="w-44 p-0 text-[0.8rem] bg-BgTertiaryColor mt-1"
      />
    </div>
  );
};

export default AvatarProfile;
