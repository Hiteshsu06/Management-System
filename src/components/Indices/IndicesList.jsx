// utils
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from "primereact/toast";

// components
import Breadcrum from "@common/Breadcrum";
import DataTable from "@common/DataTable";
import ButtonComponent from "@common/ButtonComponent";
import Confirmbox from "@common/Confirmbox";
import { allApiWithHeaderToken } from "@api/api";

const IndicesList = ({search}) => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [domesticData, setDomesticData] = useState([]);
  const [internationalData, setInternational] = useState([]);
  const toast = useRef(null);

  const item = {
    heading: t("Indices"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("Indices"), route: "/dashboard/Indices" },
    ],
  };
  
  const chartBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <ButtonComponent
          label={t("short_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("short_term"), 'index_short_term_chart_url')}
        />
        <ButtonComponent
          label={t("long_term")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          onClick={() => viewChart(rowData, t("short_term"), 'index_short_term_chart_url')}
        />
      </div>
    );
  };

  const viewChart=(rowData, caption, range)=>{
    navigate('/view-chart', { state: { url: rowData?.[range], heading: caption, currentUrl: '/dashboard/sector-master'}})
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-pencil-line"
          className="text-[1rem]"
          onClick={() => editIndex(rowData)}
        />
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="text-[1rem]"
          onClick={() => confirmDeleteIndex(rowData)}
        />
      </div>
    );
  };
  const columns = [
    { field: "name", header: t("name") },
    { field: "price", header: t("price") },
    { header: t("charts"), body: chartBodyTemplate, headerStyle: { paddingLeft: '3%'} },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editIndex = (item) => {
    navigate(`/edit-index/${item?.id}`);
  };

  const confirmDeleteIndex = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`indices/${deleteId}`, "", "delete")
      .then((response) => {
        fetchIndicesList();
      })
      .catch((err) => {
        console.log("err", err);
      })
  };

  const fetchIndicesList = () => {
    // To get all indices
    setLoader(true);
    let body = {
      search: search
    }
    allApiWithHeaderToken("indices/filter", body, "post")
      .then((response) => {
        let data = response?.data?.data;
        setInternational(data?.international_data);
        setDomesticData(data?.domestic_data)
      })
      .catch((err) => {
        errorToaster(err?.response?.data?.error);
      }).finally(()=>{
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchIndicesList();
  }, [search]);

  const createStock = () => {
    navigate("/create-index");
  };

  const exportData= async ()=>{
    setLoader(true);
    try {
      allApiWithHeaderToken("indices/export-report", "", "get", "", "blob")
        .then((response) => {
          // Create a Blob URL and download the file
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `indices_${new Date().toLocaleDateString()}.csv`); // File name
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

  const errorToaster=(err)=>{
    return toast.current.show({
      severity: "error",
      summary: "Error",
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
        message={t("index_has_been_deleted_successfully")}
      />
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-end gap-2 bg-BgSecondaryColor border rounded border-BorderColor p-2">
        <ButtonComponent
          onClick={() => exportData()}
          type="button"
          label={t("export_data")}
          disabled={(domesticData?.length > 0 || internationalData?.length > 0) ? false : true}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          icon="ri-download-2-fill"
          iconPos="right"
        />
        <ButtonComponent
          onClick={() => createStock()}
          type="submit"
          label={t("create_index")}
          className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
        />
      </div>
      <div className="mt-4 p-4 border rounded border-BorderColor">
            <TabView> 
                <TabPanel header="Domestic">
                <DataTable
                    className="bg-BgPrimaryColor border rounded border-BorderColor"
                    columns={columns}
                    loader={loader}
                    data={domesticData}
                    showGridlines={true}
                  />
                </TabPanel>
                <TabPanel header="International">
                  <DataTable
                      className="bg-BgPrimaryColor border rounded border-BorderColor"
                      columns={columns}
                      loader={loader}
                      data={internationalData}
                      showGridlines={true}
                    />
                </TabPanel>
            </TabView>
      </div>
    </div>
  );
};

export default IndicesList;