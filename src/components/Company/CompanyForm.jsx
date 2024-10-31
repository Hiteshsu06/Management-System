// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
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
  address: "",
  contactNumber: "",
  gstNumber: "",
  companyLogo: "",
};

const CompanyForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const toast = useRef(null);
  const [toastType, setToastType] = useState(''); 

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    address: yup.string().required(t("address_is_required")),
    contactNumber: yup.string().required(t("contact_number_is_required")),
    gstNumber: yup.string().required(t("gst_number_is_required")),
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update Company
      updateCompany(value);
    } else {
      // Create Company
      createCompany(value);
    }
  };

  const successToaster=(response)=>{
    setToastType('success');
    return toast.current.show({
      severity: "success",
      summary: t("success"),
      detail: response?.data?.message,
      life: 500
    });
  };

  const errorToaster=(err)=>{
    setToastType('error');
    return toast.current.show({
      severity: "error",
      summary: t("error"),
      detail: err,
      life: 1000
    });
  };

  const createCompany = (value) => {
    let body = {
      name: value?.name,
      address: value?.address,
      contact_number: value?.contactNumber,
      gst_number: value?.gstNumber
    };
    setLoader(true);
    allApiWithHeaderToken("demo_companies", body, "post")
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
      }).finally(()=>{
        setLoader(false);
      });
  };

  const updateCompany = (value) => {
    let body = {
      name: value?.name,
      address: value?.address,
      contact_number: value?.contactNumber,
      gst_number: value?.gstNumber
    };
    setLoader(true);
    allApiWithHeaderToken(`demo_companies/${id}`, body, "put")
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
      }).finally(()=>{
        setLoader(false);
      });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (id) {
      setLoader(true);
      allApiWithHeaderToken(`demo_companies/${id}`, "", "get")
        .then((response) => {
          let data = {
            name: response?.data?.name,
            address: response?.data?.address,
            contactNumber: response?.data?.contact_number,
            gstNumber: response?.data?.gst_number
          }
          setData(data);
        })
        .catch((err) => {
          console.log("err", err);
        }).finally(()=>{
          setLoader(false);
        });
    }
  }, [id]);

  const toastHandler=()=>{
    if (toastType === 'success') {
        navigate('/dashboard');
     }
  }

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <div className="flex min-h-[80vh] bg-BgPrimaryColor py-4">
    {loader && <Loading/>}
    <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
    <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.name}
            onChange={handleChange}
            type="text"
            placeholder={t("company_name")}
            name="name"
            isLabel={true}
            error={errors?.name}
            touched={touched?.name}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.address}
            onChange={handleChange}
            type="text"
            placeholder={t("company_address")}
            name="address"
            isLabel={true}
            error={errors?.address}
            touched={touched?.address}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.contactNumber}
            onChange={handleChange}
            type="number"
            placeholder={t("company_contact_number")}
            name="contactNumber"
            isLabel={true}
            error={errors?.contactNumber}
            touched={touched?.contactNumber}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.gstNumber?.toLocaleUpperCase()}
            onChange={handleChange}
            type="text"
            placeholder={t("company_gst_number")}
            name="gstNumber"
            isLabel={true}
            error={errors?.gstNumber}
            touched={touched?.gstNumber}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-3"></div>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonComponent
            onClick={() => handleBack()}
            type="button"
            label={t("back")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          />
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={id ? t("update") : t("submit")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
