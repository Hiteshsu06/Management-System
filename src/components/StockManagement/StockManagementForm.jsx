// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import Dropdown from "@common/DropdownComponent";
import { allApiWithHeaderToken } from "@api/api";
import Loading from '@common/Loading';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

const structure = {
  category: "",
  brandName: "",
  modelNumber: "",
  stockName: "",
  productQty: "",
  buyPrice: "",
  sellPrice: "",
  gst: "",
  company: {}
};

const StockManagementForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const { id } = useParams();
  const [allCompanies, setAllCompanies] = useState([]);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(structure);
  const toast = useRef(null);
  const [toastType, setToastType] = useState(''); 

  useEffect(()=>{
    if (id && allCompanies.length > 0) {
      setLoader(true);
      allApiWithHeaderToken(`demo_stocks/${id}`, "", "get")
        .then((response) => {
          let filteredData = {
              brandName: response?.data?.brand_name,
              buyPrice: response?.data?.buy_price,
              category: response?.data?.category,
              gst: response?.data?.gst_number,
              modelNumber: response?.data?.model_number,
              productQty: response?.data?.product_qty,
              sellPrice: response?.data?.sell_price,
              stockName: response?.data?.stock_name
          };
          const selectedCompany = allCompanies.find((item) => item.id === response?.data?.demo_company_id);
          filteredData['company'] = selectedCompany || {};
          setData(filteredData);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setLoader(false);
        });
    }
  }, [id, allCompanies]);

  useEffect(()=>{
    fetchCompanyList();
  },[])

  const validationSchema = yup.object().shape({
    category: yup.string().required(t("category_is_required")),
    brandName: yup.string().required(t("brand_name_is_required")),
    modelNumber: yup.string().required(t("model_number_is_required")),
    stockName: yup.string().required(t("stock_name_is_required")),
    productQty: yup.string().required(t("product_qty_is_required")),
    buyPrice: yup.string().required(t("buy_price_is_required")),
    sellPrice: yup.string().required(t("sell_price_is_required")),
    gst: yup.string().required(t("gst_is_required")),
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update Stock
      updateStock(value);
    } else {
      // Create Stock
      createStock(value);
    }
  };

  const fetchCompanyList = () => {
    setLoader(true);
    allApiWithHeaderToken("demo_companies", "", "get")
      .then((response) => {
        setAllCompanies(response?.data);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(()=>{
        setLoader(false);
      });
  };

  const createStock = (value) => {
    let body = {
      category: value?.category,
      brand_name: value?.brandName,
      model_number: value?.modelNumber,
      stock_name: value?.stockName,
      product_qty: value?.productQty,
      buy_price: value?.buyPrice,
      sell_price: value?.sellPrice,
      gst_number: value?.gst,
      demo_company_id: value?.company?.id
    };
    setLoader(true);
    allApiWithHeaderToken("demo_stocks", body, "post")
      .then((response) => {
        successToaster(response);
      })
      .catch((err) => {
        errorToaster(err);
      })
      .finally(()=>{
        setLoader(false);
      });
  };

  const updateStock = (value) => {
    setLoader(true);
    allApiWithHeaderToken(`demo_stocks/${id}`, value, "put")
      .then((response) => {
        successToaster(response);
      })
      .catch((err) => {
        errorToaster(err);
      })
      .finally(()=>{
        setLoader(false);
      });
  };

  const handleBack = () => {
    navigate("/dashboard/stock-management");
  };

  const successToaster=(response)=>{
    setToastType('success');
    return toast.current.show({
      severity: "success",
      summary: "Success",
      detail: response?.data?.message,
      life: 500
    });
  };

  const errorToaster=(err)=>{
    setToastType('error');
    return toast.current.show({
      severity: "error",
      summary: "Error",
      detail: err?.response?.data,
      life: 500
    });
  };

  const toastHandler=()=>{
    if (toastType === 'success') {
        navigate('/dashboard/stock-management');
     }
  }

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = formik;
  return (
    <div className="h-screen p-auto">
      <div className="flex h-full bg-BgPrimaryColor py-4">
      {loader && <Loading/>}
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
      <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.category}
            onChange={handleChange}
            type="text"
            placeholder={t("category")}
            name="category"
            isLabel={true}
            error={errors?.category}
            touched={touched?.category}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.brandName}
            onChange={handleChange}
            type="text"
            placeholder={t("brand_name")}
            name="brandName"
            isLabel={true}
            error={errors?.brandName}
            touched={touched?.brandName}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.modelNumber}
            onChange={handleChange}
            type="text"
            placeholder={t("model_number")}
            name="modelNumber"
            isLabel={true}
            error={errors?.modelNumber}
            touched={touched?.modelNumber}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.stockName}
            onChange={handleChange}
            type="text"
            placeholder={t("stock_name")}
            name="stockName"
            isLabel={true}
            error={errors?.stockName}
            touched={touched?.stockName}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.productQty}
            onChange={handleChange}
            type="number"
            placeholder={t("product_qty")}
            name="productQty"
            isLabel={true}
            error={errors?.productQty}
            touched={touched?.productQty}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.buyPrice}
            onChange={handleChange}
            type="number"
            placeholder={t("buy_price")}
            name="buyPrice"
            isLabel={true}
            error={errors?.buyPrice}
            touched={touched?.buyPrice}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.sellPrice}
            onChange={handleChange}
            type="number"
            placeholder={t("sell_price")}
            name="sellPrice"
            isLabel={true}
            error={errors?.sellPrice}
            touched={touched?.sellPrice}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.gst}
            onChange={handleChange}
            type="text"
            placeholder={t("gst")}
            name="gst"
            isLabel={true}
            error={errors?.gst}
            touched={touched?.gst}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Dropdown 
            value={values?.company}
            onChange={handleChange}
            data= {allCompanies}
            placeholder={t("select_company")}
            name="company"
            error={errors?.company}
            touched={touched?.company}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
            optionLabel="name"
          />
        </div>
        <div className="col-span-3"></div>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonComponent
            onClick={() => handleBack()}
            type="button"
            label={t("back")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={id ? t("update") : t("submit")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default StockManagementForm;
