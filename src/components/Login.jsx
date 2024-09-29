// hooks
import { useRef, useState } from "react";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";

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

const Login = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
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
          firstName: response?.data?.data?.email,
          lastName: "",
          email: response?.data?.data?.email
        }
        let jwtToken = response?.headers?.authorization;
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", jwtToken);
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

  const loginByFacebook = () => {};

  const loginByGoogle = () => {};

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <div className="mt-16 flex justify-center max-sm:px-4">
      <div className="w-1/3 max-lg:w-1/2 max-sm:w-full border px-5 py-5 max-lg:px-10 max-md:px-5">
        <Toast ref={toast} position="top-right" onHide={()=>{ navigate('/dashboard') }}/>
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
            touched={touched?.email}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
          <InputTextComponent
            value={values?.password}
            onChange={handleChange}
            type="password"
            placeholder={t("your_password")}
            name="password"
            error={errors?.password}
            touched={touched?.password}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <div>
              <input
                type="checkbox"
                onChange={() => {
                  setChecked(!checked);
                }}
              />
            </div>
            <div className="text-[0.8rem]">{t("keep_me_logged_in")}</div>
          </div>
          <div className="z-10 text-[0.8rem] text-BgTertiaryColor underline underline-offset-2 hover:cursor-pointer">
            <Link href="/forgot-password">{t("forgot_password")}</Link>
          </div>
        </div>
        <div className="mt-4">
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            loading={loader}
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
            <Link to="/signup">Signup</Link>
          </span>
        </div>
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 flex-shrink text-center text-[0.8rem] text-gray-400">
            {t("or")}
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div className="relative">
          <i className="ri-facebook-circle-fill absolute left-4 text-[1.5rem]"></i>
          <ButtonComponent
            onClick={() => loginByFacebook()}
            type="submit"
            label={t("login_with_facebook")}
            className="w-full rounded border px-6 py-2 text-[12px] text-BgTertiaryColor"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
        <div className="relative mt-4">
          <i className="ri-google-fill absolute left-4 text-[1.3rem]"></i>
          <ButtonComponent
            onClick={() => loginByGoogle()}
            type="submit"
            label={t("login_with_google")}
            className="w-full rounded border px-6 py-2 text-[12px] text-BgTertiaryColor"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
