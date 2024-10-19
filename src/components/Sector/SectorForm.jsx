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
import { Toast } from "primereact/toast";

const structure = {
  name: "",
  price: "",
  short_term: "",
  long_term: "",
  short_term_url: "",
  long_term_url: ""
};

const SectorForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const toast = useRef(null);
  const [toastType, setToastType] = useState('');

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    price: yup.string().required(t("price_is_required")),
    short_term: id ? yup.string() : yup.string().required(t("short_term_is_required")),
    long_term: id ? yup.string() : yup.string().required(t("long_term_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update Sector
      updateSector(value);
    } else {
      // Create Sector
      createSector(value);
    }
  };

  const createSector = (value) => {
    let body = {
      name: value?.name,
      price: value?.price,
      sector_short_term_chart: value?.short_term,
      sector_long_term_chart: value?.long_term
    };
    setLoader(true);
    allApiWithHeaderToken("sector_masters", body, "post", 'multipart/form-data')
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

  const updateSector = (value) => {
    let body = {
      name: value?.name,
      price: value?.price
    }
    if(value?.short_term){
      body['sector_short_term_chart'] = value?.short_term
    }
    if(value?.long_term){
      body['sector_long_term_chart'] = value?.long_term
    };
    setLoader(true);
    allApiWithHeaderToken(`sector_masters/${id}`, body, "put", 'multipart/form-data')
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
    navigate("/dashboard/sector-master");
  };

  useEffect(() => {
    if (id) {
      setLoader(true);
      allApiWithHeaderToken(`sector_masters/${id}`, "", "get")
        .then((response) => {
          let data = {
            name: response?.data?.name,
            price: response?.data?.price,
            short_term: response?.data?.short_term,
            long_term: response?.data?.long_term,
            short_term_url: response?.data?.sector_short_term_chart_url ,
            long_term_url: response?.data?.sector_long_term_chart_url 
          }
          setData(data);
        })
        .catch((err) => {
          console.log("err", err);
        })
        .finally(()=>{
          setLoader(false);
        });
    }
  }, [id]);

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

  const toastHandler=()=>{
    if (toastType === 'success') {
        navigate('/dashboard/sector-master');
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
            type="text"
            placeholder={t("sector_name")}
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
            type="number"
            placeholder={t("sector_price")}
            name="price"
            isLabel={true}
            error={errors?.price}
            touched={touched?.price}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
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
              }}/>
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

export default SectorForm;
