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
import Loading from '@common/Loading';

const SectorList = ({search}) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [exportLoader, setExportLoader] = useState(false);
  const toast = useRef(null);

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
          onClick={() => {navigate(`/sector-master/stocks/${rowData?.id}`, { state: { heading: rowData?.name}})}}
        />
      </div>
    );
  };

  const viewChart=(rowData, caption, range)=>{
    navigate('/view-chart', { state: { url: rowData?.[range], heading: caption, currentUrl: '/dashboard/sector-master'}})
  };

  const chartBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ButtonComponent
          label={t("short_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("short_term"), 'sector_short_term_chart_url')}
        />
        <ButtonComponent
          label={t("long_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("long_term"), 'sector_long_term_chart_url')}
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
    setLoader(true);
    let body = {
      search: search
    }
    allApiWithHeaderToken("sector_masters/filter", body, "post")
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
    fetchSectorList();
  }, [search]);

  const createStock = () => {
    navigate("/create-sector");
  };

  const exportData= async ()=>{
    setExportLoader(true);
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
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setExportLoader(false);
        });
  } catch (error) {
      console.error('Error downloading the CSV file:', error);
  }
  }

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
      {exportLoader && <Loading width='w-[85%]'/>}
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
          disabled={(data?.length > 0 || exportLoader ) ? false : true}
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