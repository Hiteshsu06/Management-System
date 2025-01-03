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

const StockList = ({search}) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [exportLoader, setExportLoader] = useState(false);
  const toast = useRef(null);

  const item = {
    heading: t("stocks"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("stocks"), route: "/dashboard/stocks" },
    ],
  };

  const [data, setData] = useState([]);
  const chartBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ButtonComponent
          label={t("short_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("short_term"), 'stock_short_term_chart_url')}
        />
        <ButtonComponent
          label={t("long_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("short_term"), 'stock_long_term_chart_url')}
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

  const viewChart=(rowData, caption, range)=>{
    navigate('/view-chart', { state: { url: rowData?.[range], heading: caption, currentUrl: '/dashboard/sector-master'}})
  };

  const columns = [
    { field: "name", header: t("name") },
    { field: "price", header: t("price") },
    { body: (item)=> item?.sector?.name , header: t("sector") },
    { header: t("charts"), body: chartBodyTemplate, headerStyle: { paddingLeft: '3%'} },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editCompany = (item) => {
    navigate(`/edit-stock/${item?.id}`);
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
    allApiWithHeaderToken(`stocks/${deleteId}`, "", "delete")
      .then((response) => {
        fetchStockList();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const fetchStockList = () => {
    let body = {
      search: search
    }
    setLoader(true);
    allApiWithHeaderToken("stocks/filter", body, "post")
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
    fetchStockList();
  }, [search]);

  const createStock = () => {
    navigate("/create-stock");
  };

  const exportData= async ()=>{
    setExportLoader(true);
    try {
      allApiWithHeaderToken("stocks/export-report", "", "get", "", "blob")
        .then((response) => {
          // Create a Blob URL and download the file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `stocks_${new Date().toLocaleDateString()}.csv`); // File name
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
      } 
    catch (error) {
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
        message={t("stock_has_been_deleted_successfully")}
      />
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-end gap-2 bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <ButtonComponent
          onClick={() => exportData()}
          type="button"
          disabled={(data?.length > 0 || exportLoader) ? false : true}
          label={t("export_data")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          icon="ri-download-2-fill"
          iconPos="right"
        />
        <ButtonComponent
          onClick={() => createStock()}
          type="submit"
          label={t("create_stock")}
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

export default StockList;
