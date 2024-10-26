// hooks
import { useRef, useState } from "react";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";
import Loading from '@common/Loading';

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const data = {
  email: "",
  password: "",
};

const ForgotPassword = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState('');
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("please_enter_valid_email"))
      .required(t("email_is_required"))
  });

  const onHandleSubmit = async (value) => {
    let body = {
      user: {
        email: value?.email
      }
    }
    setLoader(true);
    allApi(`users/password`, body, "post")
    .then((response) => {
      if(response?.status === 200){
        setToastType('success');
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response?.data?.message,
          life: 1000
        });
      }
    })
    .catch((err) => {
      console.log("err", err);
    }).finally(()=>{
      setLoader(false);
    });
  };

  const toastHandler=()=>{
    if (toastType === 'success') {
        navigate('/');
     }
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <div className="h-screen items-center flex justify-center max-sm:px-4">
      {loader && <Loading/>}
      <div className="w-1/3 h-[40%] max-lg:w-1/2 max-sm:w-full border px-5 py-5 max-lg:px-10 max-md:px-5">
        <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
        <div className="text-center text-[1.5rem] font-[600] tracking-wide max-lg:text-[1.4em] max-sm:text-[1rem]">
          {t("forgot_password")}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          <InputTextComponent
            value={values?.email}
            onChange={handleChange}
            type="email"
            placeholder={t("your_email")}
            name="email"
            error={errors?.email}
            touched={touched?.email}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={t("request_reset_link")}
            className="w-full rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
        <div className="mt-2 text-center text-[0.8rem]">
          <span className="ps-2 font-[500] text-BgTertiaryColor underline">
            <Link to="/">{t("back_to_login")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
