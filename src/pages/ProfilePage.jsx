// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import Dropdown from "@common/DropdownComponent";
import FileUpload from "@common/FileUpload";
import { allApiWithHeaderToken } from "@api/api";
import Loading from '@common/Loading';
import { Toast } from "primereact/toast";

const structure = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  address: "",
  profileImage: "",
  profileImageUrl: ""
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
  const toast = useRef(null);
  const [toastType, setToastType] = useState('');

  const validationSchema = yup.object().shape({
    email: yup.string().required(t("email_is_required")),
  });

  useEffect(() => {
    let email = JSON.parse(localStorage.getItem("user"))?.email;
    setData({ ...data, email: email });
  }, []);

  const onHandleSubmit = async (value) => {
    setLoader(true);
    let body = {
      first_name: value?.firstName,
      last_name: value?.lastName,
      full_address: value?.address
    };
    body['gender'] = value?.gender ? value?.gender : "";
    if(value?.profileImage){
      body['profile_image'] = value?.profileImage;
    }
    allApiWithHeaderToken(`users/update_user/${id}`, body, "put", 'multipart/form-data')
      .then((response) => {
        successToaster(response);
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
        localStorage.setItem("user", JSON.stringify(data));
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

  const backHandler=()=>{
    let userNavigation = JSON.parse(localStorage.getItem("user"))?.role && JSON.parse(localStorage.getItem("user"))?.role === 'admin' && '/dashboard/sector-master';
    if(userNavigation){
      navigate(userNavigation);
    }
    else{
      navigate('/dashboard');
    }
  }

  useEffect(() => {
   if(id){
     setLoader(true);
     allApiWithHeaderToken(`/users/${id}`, "", "get")
     .then((response) => {
        let data = {
          firstName: response?.data?.first_name,
          lastName: response?.data?.last_name,
          email: response?.data?.email,
          address: response?.data?.full_address,
          profileImageUrl: response?.data?.profile_image_url
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

  const toastHandler=()=>{
    if (toastType === 'success') {
        backHandler();
     }
  };


  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = formik;

  return (
    <div className="h-screen p-auto">
      {loader && <Loading/>}
      <Toast ref={toast} position="top-right" style={{scale: '0.7'}} onHide={toastHandler}/>
      <div className="flex min-h-full bg-BgPrimaryColor py-4 overflow-y-auto">
            <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
              <div className="col-span-4 md:col-span-4">
                  <h4 className="xs:text-xl mb-2 font-serif font-extrabold sm:text-xl md:text-2xl lg:text-3xl dark:text-white">
                     {t("my_profile")}
                  </h4>
                  <div>
                    <FileUpload
                      isLabel={t("profile_image")}
                      value={values?.profileImageUrl}
                      name="profile_image"
                      onChange={(e) => {
                        setFieldValue("profileImage", e?.currentTarget?.files[0]);
                        setFieldValue(
                          "profileImageUrl",
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
                onClick={backHandler}
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
