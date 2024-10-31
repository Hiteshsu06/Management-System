// hooks
import React, { useRef, useState } from "react";

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
import Cookies from 'js-cookie';

const data = {
  email: "",
  password: "",
};

const Login = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(''); 
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email(t("please_enter_valid_email"))
      .required(t("email_is_required")),
    password: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("password_is_required")),
  });

  const onHandleSubmit = async (value) => {
    let body = {
      user: {
        email: value?.email,
        password: value?.password
      }
    }
    setLoader(true);
    // To Handle Normal submit
    allApi(`users/sign_in`, body, "post")
    .then((response) => {
      if(response?.status === 200){
        let data = {
          id: response?.data?.data?.id,
          fullName: "",
          email: response?.data?.data?.email,
          role: response?.data?.data?.role,
          gender: response?.data?.data?.gender
        }
        let firstName = response?.data?.data?.first_name ? response?.data?.data?.first_name : "";
        let lastName = response?.data?.data?.last_name ? response?.data?.data?.last_name : "";
        if(firstName && lastName){
          data.fullName = firstName + " " + lastName
        }
        let jwtToken = response?.headers?.authorization;
        localStorage.setItem("user", JSON.stringify(data));
        Cookies.set('token', jwtToken, { expires: 3 });
        setToastType('success');
        toast.current.show({
          severity: "success",
          summary: t("success"),
          detail: response?.data?.message,
          life: 1000
        });
      }
    })
    .catch((err) => {
      setToastType('error');
      toast.current.show({
        severity: "error",
        summary: t("error"),
        detail: err.response?.data,
        life: 1000
      });
    }).finally(()=>{
      setLoader(false);
    });
  };

  const toastHandler=()=>{
   if (toastType === 'success') {
      let userNavigation = '';
      if(JSON.parse(localStorage.getItem("user"))?.role){
        userNavigation = ['admin', 'super_admin']?.includes(JSON.parse(localStorage.getItem("user"))?.role) ? '/dashboard/sector-master' : '/dashboard';
        navigate(userNavigation);
      }
      else{
        userNavigation = '/not-authorized';
        navigate(userNavigation);
      }
    }
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event); // Call the submit function when Enter is pressed
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
    <React.Fragment>
      {loader && <Loading/>}
      <div className="h-screen flex justify-center max-sm:px-4">
        <div className="my-auto w-1/4 max-lg:w-1/2 max-sm:w-full border px-5 py-5 max-lg:px-10 max-md:px-5 h-fit">
          <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
          <div className="text-center text-[1.5rem] font-[600] tracking-wide max-lg:text-[1.4em] max-sm:text-[1rem]">
            {t("welcome_back")}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <InputTextComponent
              value={values?.email}
              onChange={handleChange}
              type="email"
              placeholder={t("your_email")}
              name="email"
              error={errors?.email}
              onKeyDown={handleKeyDown}
              touched={touched?.email}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
            <InputTextComponent
              value={values?.password}
              onChange={handleChange}
              type="password"
              placeholder={t("your_password")}
              name="password"
              onKeyDown={handleKeyDown}
              error={errors?.password}
              touched={touched?.password}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-2">
            </div>
            <div className="z-10 text-[0.8rem] text-BgTertiaryColor underline underline-offset-2 hover:cursor-pointer">
              <Link to="/forgot-password">{t("forgot_password")}</Link>
            </div>
          </div>
          <div className="mt-4">
            <ButtonComponent
              onClick={() => handleSubmit()}
              type="submit"
              label={t("log_in")}
              className="w-full rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </div>
          <div className="mt-2 text-center text-[0.8rem]">
            {" "}
            {t("don't_have_an_account?")}
            <span className="ps-2 font-[500] text-BgTertiaryColor underline">
              <Link to="/signup">{t("signup")}</Link>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
