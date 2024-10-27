// utils
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import { allApiWithHeaderToken } from "@api/api";

const CompanyList = ({search}) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const toast = useRef(null);

  const item = {
    heading: t("company"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("company"), route: "/dashboard" },
    ],
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-pencil-line"
          className="text-[1rem]"
          onClick={() => editCompany(rowData)}
        />
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="text-[1rem]"
          onClick={() => confirmDeleteCompany(rowData)}
        />
      </div>
    );
  };
  const columns = [
    { field: "name", header: t("name") },
    { field: "address", header: t("address") },
    { field: "contact_number", header: t("contact_number") },
    { field: "gst_number", header: t("gst") },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editCompany = (item) => {
    navigate(`/edit-company/${item?.id}`);
  };

  const confirmDeleteCompany = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`demo_companies/${deleteId}`, "", "delete")
      .then((response) => {
        if(response){
          fetchCompanyList();
        }
      })
      .catch((err) => {
        console.log(err)
      });
  };

  const fetchCompanyList = () => {
    // To get all companies
    setLoader(true);
    let body = {
      search: search
    }
    allApiWithHeaderToken("demo_companies/filter", body, "post")
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
    fetchCompanyList();
  }, [search]);

  const createCompany = () => {
    navigate("/create-company");
  };

  const errorToaster=(err)=>{
    return toast.current.show({
      severity: "error",
      summary: t("error"),
      detail: err,
      life: 2000
    });
  };

  return (
    <div className="text-TextPrimaryColor">
       <Toast ref={toast} position="top-right" style={{scale: '0.7'}}/>
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
        message={t("company_has_been_deleted_successfully")}
      />
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-end bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <ButtonComponent
          onClick={() => createCompany()}
          type="submit"
          label={t("create_company")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
        />
      </div>
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

export default CompanyList;
