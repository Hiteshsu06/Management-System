// utils
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// components
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import { allApiWithHeaderToken } from "@api/api";

const SectorwiseStockList = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const { id } = useParams();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();
  const { heading } = location.state || {};
  console.log("heading",heading)

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

  const fetchStockList=()=>{
    allApiWithHeaderToken(`sectors/stocks/${id}`, "", "get")
    .then((response) => {
        setData(response?.data);
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(()=>{
      setLoader(false);
    });
  }

  useEffect(()=>{
    if (id) {
      setLoader(true);
      fetchStockList();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/dashboard/sector-master");
  };

  const exportData= async ()=>{
    setLoader(true);
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
          setLoader(false);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setLoader(false);
        });
      } 
    catch (error) {
        console.error('Error downloading the CSV file:', error);
    }
 }

  return (
    <div className="text-TextPrimaryColor p-4 sm:p-8">
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
        message={t("stock_has_been_deleted_successfully")}
      />
      <div className="mt-4 flex justify-between gap-2 bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <div className="flex items-center">
            <h4 className="text-[1.2rem] text-TextSecondaryColor ms-[4px] font-[600]">{heading}</h4>
        </div>
        <ButtonComponent
          onClick={() => exportData()}
          type="button"
          disabled={(data?.length > 0 ) ? false : true}
          label={t("export_data")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          icon="ri-download-2-fill"
          iconPos="right"
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
      <div className="mt-4 flex justify-end gap-4">
          <ButtonComponent
            onClick={() => handleBack()}
            type="button"
            label={t("back")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          />
        </div>
    </div>
  );
};

export default SectorwiseStockList;