// hooks
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import { allApiWithHeaderToken } from "@api/api";

const SectorList = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);

  const item = {
    heading: t("sectors"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("sector"), route: "/dashboard/sector-master" },
    ]
  };

  const [data, setData] = useState([]);
  const stocksBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ButtonComponent
          label={t("view_stocks")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => editSector(rowData)}
        />
      </div>
    );
  }
  const chartBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ButtonComponent
          label={t("short_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => editSector(rowData)}
        />
        <ButtonComponent
          label={t("long_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => confirmDeleteCompany(rowData)}
        />
      </div>
    );
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-pencil-line"
          className="text-[1rem]"
          onClick={() => editSector(rowData)}
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
    { field: "price", header: t("price") },
    { header: t("stocks"), body: stocksBodyTemplate, headerStyle: { paddingLeft: '3%'} },
    { header: t("charts"), body: chartBodyTemplate, headerStyle: { paddingLeft: '3%'} },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editSector = (item) => {
    navigate(`/edit-sector/${item?.id}`);
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
    allApiWithHeaderToken(`sector_masters/${deleteId}`, "", "delete")
      .then((response) => {
        fetchSectorList();
      })
      .catch((err) => {
        console.log("err", err);
      })
  };

  const fetchSectorList = () => {
    // To get all users stored in json
    setLoader(true);
    allApiWithHeaderToken("sector_masters", "", "get")
      .then((response) => {
        setData(response?.data);
      })
      .catch((err) => {
        console.log("err", err);
      }).finally(()=>{
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchSectorList();
  }, []);

  const createStock = () => {
    navigate("/create-sector");
  };

  const exportData= async ()=>{
    setLoader(true);
    try {
      allApiWithHeaderToken("sectors/export-report", "", "get", "", "blob")
        .then((response) => {
          // Create a Blob URL and download the file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `sectors_${new Date().toLocaleDateString()}.csv`); // File name
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoader(false);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setLoader(false);
        });
  } catch (error) {
      console.error('Error downloading the CSV file:', error);
  }
  }

  return (
    <div className="text-TextPrimaryColor">
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
        message={t("sector_has_been_deleted_successfully")}
      />
      <Breadcrum item={item}/>
      <div className="mt-4 flex justify-end gap-2 bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <ButtonComponent
          onClick={() => exportData()}
          type="button"
          label={t("export_data")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          icon="ri-download-2-fill"
          iconPos="right"
        />
        <ButtonComponent
          onClick={() => createStock()}
          type="button"
          label={t("create_sector")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
        />
      </div>
      <div className="mt-4">
        <DataTable
          className="bg-BgPrimaryColor border rounded border-BorderColor"
          columns={columns}
          loader={loader}
          data={data}
          showGridlines={true}
        />
      </div>
    </div>
  );
};

export default SectorList;