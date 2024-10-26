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

const StockManagementList = () => {
  const [data, setData] = useState([]);
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [isConfirm, setIsConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loader, setLoader] = useState(false);
  const toast = useRef(null);
  
  const item = {
    heading: t("stock_management"),
    routes: [
      { label: t("dashboard"), route: "/dashboard" },
      { label: t("stock_management"), route: "/dashboard/stock-management" },
    ],
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex">
        <ButtonComponent
          icon="ri-pencil-line"
          className="text-[1rem]"
          onClick={() => editStock(rowData)}
        />
        <ButtonComponent
          icon="ri-delete-bin-line"
          className="text-[1rem]"
          onClick={() => confirmDeleteStock(rowData)}
        />
      </div>
    );
  };
  const columns = [
    { field: "category", header: t("category") },
    { field: "brand_name", header: t("brand_name") },
    { field: "model_number", header: t("model_number") },
    { field: "stock_name", header: t("stock_name") },
    { field: "product_qty", header: t("product_qty") },
    { field: "buy_price", header: t("buy_price") },
    { field: "sell_price", header: t("sell_price") },
    { field: "gst_number", header: t("gst") },
    { header: t("action"), body: actionBodyTemplate, headerStyle: { paddingLeft: '3%'} },
  ];

  const editStock = (item) => {
    navigate(`/edit-stock-management/${item?.id}`);
  };

  const confirmDeleteStock = (item) => {
    setIsConfirm(!isConfirm);
    setDeleteId(item?.id);
  };

  const closeDialogbox = () => {
    setDeleteId(null);
    setIsConfirm(!isConfirm);
  };

  const confirmDialogbox = () => {
    setIsConfirm(!isConfirm);
    allApiWithHeaderToken(`demo_stocks/${deleteId}`, "", "delete")
      .then((response) => {
        fetchStockList();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    fetchStockList();
  }, []);

  const errorToaster=(err)=>{
    return toast.current.show({
      severity: "error",
      summary: "Error",
      detail: err,
      life: 2000
    });
  };

  const fetchStockList = () => {
    // To get all stocks stored in json
    setLoader(true);
    allApiWithHeaderToken("demo_stocks", "", "get")
      .then((response) => {
        setData(response?.data);
      })
      .catch((err) => {
        errorToaster(err?.response?.data?.error);
      }).finally(()=> {
        setLoader(false);
      });
  };

  const createStock = () => {
    navigate("/create-stock-management");
  };

  return (
    <div className="text-TextPrimaryColor">
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}}/>
      <Confirmbox
        isConfirm={isConfirm}
        closeDialogbox={closeDialogbox}
        confirmDialogbox={confirmDialogbox}
        message={t("stock_has_been_deleted_successfully")}
      />
      <Breadcrum item={item} />
      <div className="mt-4 flex justify-end bg-BgSecondaryColor p-2 border rounded border-BorderColor">
        <ButtonComponent
          onClick={() => createStock()}
          type="submit"
          label={t("create_stock_management")}
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

export default StockManagementList;
