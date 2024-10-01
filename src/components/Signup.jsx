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
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const toast = useRef(null);
  const { t } = useTranslation("msg");
  const [overallUser, setOverallUser] = useState([]);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    firstname: yup.string().required(t("first_name_is_required")),
    lastname: yup.string().required(t("last_name_is_required")),
    email: yup
      .string()
      .email(t("please_enter_valid_email"))
      .required(t("email_is_required")),
    password: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("password_is_required")),
    confirmPassword: yup
      .string()
      .min(6, t("please_enter_password_more_then_6_characters"))
      .max(20, t("please_enter_password_less_then_20_characters"))
      .required(t("confirm_password_is_required"))
      .oneOf(
        [yup.ref("password")],
        t("confirm_password_and_new_password_should_be_same"),
      ),
  });

  const onHandleSubmit = async (value) => {
    let body = {
      user: {
        email: value?.email,
        password: value?.password
      }
    }
    // To get all users stored in json
    await allApi("users", body , "post")
      .then((response) => {
        if(response?.status === 200){
          navigate('/')
        }
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "User already exists",
          life: 3000,
        });
      });
  };

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });
  const { values, errors, handleSubmit, handleChange, touched } =
    formik;

  return (
    <div className="my-16 flex justify-center max-sm:px-4">
      <div className="w-1/3 max-lg:w-1/2 max-sm:w-full border px-5 py-5 max-lg:px-10 max-md:px-5">
        <Toast ref={toast} position="top-right" style={{scale: '0.7'}}/>
        <div className="my-2 text-left text-[1.5rem] font-[600] tracking-wide max-xl:text-center max-lg:text-[1.4em] max-sm:text-[1rem]">
          {t("signup")}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div>
            <InputTextComponent
              value={values?.firstname}
              onChange={handleChange}
              type="text"
              placeholder={t("first_name")}
              name="firstname"
              error={errors?.firstname}
              touched={touched?.firstname}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
          <div>
            <InputTextComponent
              value={values?.lastname}
              onChange={handleChange}
              type="text"
              placeholder={t("last_name")}
              name="lastname"
              error={errors?.lastname}
              touched={touched?.lastname}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
          <div>
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
          <div>
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
          <div>
            <InputTextComponent
              value={values?.confirmPassword}
              onChange={handleChange}
              type="password"
              placeholder={t("your_confirm_password")}
              name="confirmPassword"
              error={errors?.confirmPassword}
              touched={touched?.confirmPassword}
              className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-start">
          <div>
            <input
              type="checkbox"
              onChange={() => {
                setChecked(!checked);
              }}
            />
          </div>
          <div className="ms-2 text-[0.8rem]">{t("terms_&_condition")}</div>
        </div>
        <div className="mt-6">
          <ButtonComponent
            disabled={!checked}
            onClick={() => handleSubmit()}
            type="submit"
            label={t("sign_up")}
            className="w-full rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
          />
        </div>
        <div className="mb-4 mt-2 text-center text-[0.8rem]">
          {t("already_have_an_account?")}
          <span className="ps-2 font-[500] text-BgTertiaryColor underline">
            <Link to="/">{t("sign_in")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Signup;
