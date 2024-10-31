// utils
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import Dropdown from "@common/DropdownComponent";
import { allApiWithHeaderToken } from "@api/api";

const roleList = [
  { name: "Admin", value: "admin" },
  { name: "Super Admin", value: "super_admin" },
  { name: "Viewer", value: "viewer" },
];

const UserList = ({search}) => {
  const { t } = useTranslation("msg");
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState('');
  const toast = useRef(null);

  const item = {
    heading: t("users"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("users"), route: "/dashboard/users" },
    ],
  };

  const [data, setData] = useState([]);

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="ms-4 text-[1rem]"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </div>
    );
  };

  const roleChange = (e, rowData)=>{
    setLoader(true);
    let body = {
      role: e?.target?.value
    };
    allApiWithHeaderToken(`users/role-update/${rowData?.id}`, body, "post")
      .then((response) => {
        successToaster(response);
        fetchUsersList();
      })
      .catch((err) => {
        if(Array.isArray(err?.response?.data?.errors)){
          err?.response?.data?.errors?.forEach((item)=>{
            errorToaster(item);
          })
        }else{
          errorToaster(err?.response?.data);
        }
      })
      .finally(()=>{
        setLoader(false);
      });
  }
  
  const successToaster=(response)=>{
    setToastType('success');
    return toast.current.show({
      severity: "success",
      summary: t("success"),
      detail: response?.data?.message,
      life: 500
    });
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <div className="flex">
       <Dropdown
          value={rowData?.role}
          onChange={(e)=> roleChange(e, rowData)}
          data={roleList}
          className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
          optionLabel="name"
        />
      </div>
    );
  };

  const columns = [
    { field: "email", header: t("email") },
    { body: (item)=> item?.first_name ? item?.first_name : <div className="ms-8">-</div>, header: t("first_name") },
    { body: (item)=> item?.last_name ? item?.last_name : <div className="ms-8">-</div>, header: t("last_name") },
    { body: (item)=> item?.gender ? item?.gender : <div className="ms-4">-</div>, header: t("gender") },
    { body: roleBodyTemplate, header: t("role") },
    { header: t("delete"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const confirmDeleteUser = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`users/${deleteId}`, "", "delete")
      .then((response) => {
        fetchUsersList();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const fetchUsersList = () => {
    let body = {
      search: search
    }
    setLoader(true);
    allApiWithHeaderToken("users/filter", body, "post")
      .then((response) => {
        setData(response?.data);
      })
      .catch((err) => {
        errorToaster(err?.response?.data?.error);
      }).finally(()=>{
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchUsersList();
  }, [search]);

 const errorToaster=(err)=>{
  return toast.current.show({
    severity: "error",
    summary: t("error"),
    detail: err,
    life: 2000
  });
};

const toastHandler=()=>{
  if (toastType === 'success') {
     
   }
};

  return (
    <div className="text-TextPrimaryColor">
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
        message={t("user_has_been_deleted_successfully")}
      />
      <Breadcrum item={item} />
      <div className="mt-4">
        <DataTable
          className="bg-BgPrimaryColor border rounded border-BorderColor"
          columns={columns}
          data={data}
          loader={loader}
          showGridlines={true}
        />
      </div>
    </div>
  );
};

export default UserList;
