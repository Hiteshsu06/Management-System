// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import Dropdown from "@common/DropdownComponent";
import FileUpload from "@common/FileUpload";
import { allApiWithHeaderToken } from "@api/api";

const structure = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  address: "",
  profile_image: "",
  profile_image_url: ""
};

const genderList = [
  { name: "Male", value: "M" },
  { name: "Female", value: "F" },
  { name: "Other", value: "O" },
];

const ProfilePage = () => {
  const { t } = useTranslation("msg");
  const [data, setData] = useState(structure);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    email: yup.string().required(t("email_is_required")),
  });

  useEffect(() => {
    let email = JSON.parse(localStorage.getItem("user"))?.email;
    setData({ ...data, email: email });
  }, []);

  const onHandleSubmit = async (value) => {
    console.log("data", value);
  };

  useEffect(() => {
   if(id){
     setLoader(true);
     allApiWithHeaderToken(`/users/${id}`, "", "get")
     .then((response) => {
        let data = {
          firstName: response?.data?.first_name,
          lastName: response?.data?.last_name,
          email: response?.data?.email ,
          address: response?.data?.full_address,
          profile_image_url: response?.data?.profile_image_url
        }
        const genderData = genderList?.find((item)=> item?.value === response?.data?.gender);
        data['gender'] = genderData?.value;
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
      <div className="flex min-h-full bg-BgPrimaryColor py-4 overflow-y-auto">
            <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
              <div className="col-span-4 md:col-span-4">
                  <h4 className="xs:text-xl mb-2 font-serif font-extrabold sm:text-xl md:text-2xl lg:text-3xl dark:text-white">
                     {t("my_profile")}
                  </h4>
                  <div>
                    <FileUpload
                      isLabel={t("profile_image")}
                      value={values?.profile_image_url}
                      name="profile_image"
                      onChange={(e) => {
                        setFieldValue("profile_image", e?.currentTarget?.files[0]);
                        setFieldValue(
                          "profile_image_url",
                          URL.createObjectURL(e?.target?.files[0]),
                        );
                      }}
                      isProfile={true}
                    />
                  </div>
              </div>
              <div className="col-span-4 md:col-span-2">
                <InputTextComponent
                  value={values?.firstName}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("first_name")}
                  name="firstName"
                  isLabel={true}
                  error={errors?.firstName}
                  touched={touched?.firstName}
                  className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <InputTextComponent
                  value={values?.lastName}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("last_name")}
                  name="lastName"
                  isLabel={true}
                  error={errors?.lastName}
                  touched={touched?.lastName}
                  className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <InputTextComponent
                  value={values?.email}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("email")}
                  name="email"
                  isLabel={true}
                  error={errors?.email}
                  touched={touched?.email}
                  disabled={true}
                  className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <InputTextComponent
                  value={values?.address}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("full_address")}
                  name="address"
                  isLabel={true}
                  error={errors?.address}
                  touched={touched?.address}
                  className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <Dropdown
                  value={values?.gender}
                  onChange={handleChange}
                  data={genderList}
                  label={t("gender")}
                  placeholder={t("select_gender")}
                  name="gender"
                  error={errors?.gender}
                  touched={touched?.gender}
                  className="custom-dropdown col-span-2 w-full rounded border-[1px] border-[#ddd] focus:outline-none"
                  optionLabel="name"
                />
              </div>
              <div className="col-span-4 md:col-span-2"></div>
              <div className="col-span-3"></div>
              <div className="mt-4 flex justify-end gap-4">
              <ButtonComponent
                onClick={() => {
                  navigate("/dashboard");
                }}
                type="button"
                label={t("back")}
                className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
              />
              <ButtonComponent
                onClick={() => handleSubmit()}
                type="submit"
                label={t("update")}
                className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
              />
              </div>
            </div>
      </div>
    </div>
  );
};

export default ProfilePage;
