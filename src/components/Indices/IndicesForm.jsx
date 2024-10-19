// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import FileUpload from "@common/FileUpload";
import { allApiWithHeaderToken } from "@api/api";
import Loading from '@common/Loading';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import Dropdown from "@common/DropdownComponent";
import { Toast } from "primereact/toast";

const structure = {
  name: "",
  price: "",
  short_term: "",
  short_term_url: "",
  long_term: "",
  long_term_url: "",
  category: {}
};

const categories = [
  {name: "Domestic", value: "0"},
  {name: "International", value: "1"}
]

const IndicesForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [allCountries, setAllCountries] = useState([]);
  const [loader, setLoader] = useState(false);
  const toast = useRef(null);
  const [toastType, setToastType] = useState(''); 
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    price: yup.string().required(t("price_is_required")),
    short_term: id ? yup.string() : yup.string().required(t("short_term_is_required")),
    long_term: id ? yup.string() : yup.string().required(t("long_term_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update Index
      updateIndex(value);
    } else {
      // Create Index
      createIndex(value);
    }
  };

  const fetchCountryList = () => {
    setLoader(true);
    allApiWithHeaderToken("countries/list", "", "get")
      .then((response) => {
        setAllCountries(response?.data);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(()=>{
        setLoader(false);
      });
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
      detail: err,
      life: 1000
    });
  };

  const createIndex = (value) => {
    setLoader(true);
    let body = {
      name: value?.name,
      price: value?.price,
      index_short_term_chart: value?.short_term,
      index_long_term_chart: value?.long_term,
      country_id: value?.country?.id,
      category_id: Number(value?.category)
    }
    allApiWithHeaderToken("indices", body, "post", 'multipart/form-data')
      .then((response) => {
        successToaster(response);
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
  };

  const updateIndex = (value) => {
    setLoader(true);
    let body = {
      name: value?.name,
      price: value?.price,
      country_id: value?.country?.name,
      category_id: Number(value?.category)
    }
    allApiWithHeaderToken(`indices/${id}`, body, "put")
      .then((response) => {
        successToaster(response);
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
  };

  const handleBack = () => {
    navigate("/dashboard/indices");
  };

  useEffect(() => {
    if (id) {
      setLoader(true);
      allApiWithHeaderToken(`indices/${id}`, "", "get")
        .then((response) => {
          let data = {
            name: response?.data?.name,
            price: response?.data?.price,
            short_term: response?.data?.short_term,
            short_term_url: response?.data?.index_short_term_chart_url,
            long_term: response?.data?.long_term,
            long_term_url: response?.data?.index_long_term_chart_url
          }
          const selectedCategory = categories?.find((item) => item?.value == response?.data?.category_id);
          data['category'] = selectedCategory || {};

          const selectedCountry = allCountries?.find((item) => item?.id == response?.data?.country_id);
          console.log("R",selectedCountry)
          data['country'] = selectedCountry || {};
          setData(data);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setLoader(false);
        });
    }
    fetchCountryList();
  }, []);

  const toastHandler=()=>{
    if (toastType === 'success') {
        navigate('/dashboard/indices');
     }
  }

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue, touched } = formik;

  return (
    <div className="flex min-h-screen bg-BgPrimaryColor py-4">
      {loader && <Loading/>}
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
      <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.name}
            onChange={handleChange}
            type="name"
            placeholder={t("index_name")}
            name="name"
            isLabel={true}
            error={errors?.name}
            touched={touched?.name}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.price}
            onChange={handleChange}
            type="price"
            placeholder={t("index_price")}
            name="price"
            isLabel={true}
            error={errors?.price}
            touched={touched?.price}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Dropdown 
            value={values?.country}
            onChange={handleChange}
            data= {allCountries}
            placeholder={t("select_country")}
            name="country"
            editable ={true}
            error={errors?.country}
            touched={touched?.country}
            className="col-span-2 w-full ps-3 rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
            optionLabel="name"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <Dropdown 
            value={values?.category}
            onChange={handleChange}
            data= {categories}
            placeholder={t("select_category")}
            name="category"
            error={errors?.category}
            touched={touched?.category}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
            optionLabel="name"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
            <FileUpload 
              value={values?.short_term_url}
              name="short_term"
              isLabel={t("stock_short_term_chart")} 
              onChange={(e)=> {
                setFieldValue('short_term', e?.currentTarget?.files[0]);
                setFieldValue('short_term_url', URL.createObjectURL(e?.target?.files[0]));
              }}/>
        </div>
        <div className="col-span-4 md:col-span-2">
            <FileUpload 
              isLabel={t("stock_long_term_chart")}
              value={values?.long_term_url}
              name="long_term"
              onChange={(e)=> {
                setFieldValue('long_term', e?.currentTarget?.files[0]);
                setFieldValue('long_term_url', URL.createObjectURL(e?.target?.files[0]));
              }}
            />
        </div>
        <div className="col-span-3"></div>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonComponent
            onClick={() => handleBack()}
            type="button"
            label={t("back")}
            className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
          />
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={id ? t("update") : t("submit")}
            className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default IndicesForm;