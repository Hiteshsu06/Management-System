import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useEffect, useState } from "react";
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import Dropdown from "@common/DropdownComponent";
import FileUpload from "@common/FileUpload";

const structure = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    address: "",
};

const genderList = [
    { name: "Male", code: "M" },
    { name: "Female", code: "F" },
    { name: "Other", code: "O" }
]

const ProfilePage = () => {
    const { t } = useTranslation("msg");
    const [data, setData] = useState(structure);

    const onHandleSubmit = async (value) => {
        console.log("data",value)
    };

    const formik = useFormik({
        initialValues: data,
        onSubmit: onHandleSubmit,
        enableReinitialize: true,
        validateOnBlur: true,
      });
    
    const { values, errors, handleSubmit, handleChange, touched } = formik;

  return (
    <section className="py-10 my-auto dark:bg-gray-900">
    <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div
            className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <div className="">
                <h4
                    className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-white">
                    Edit Profile
                </h4>
                <div>
                        <FileUpload />
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full  mb-4 mt-6">
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
                        <div className="w-full  mb-4 lg:mt-6">
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
                    </div>

                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full">
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
                        <div className="w-full">
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
                    </div>
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full">
                            <Dropdown 
                                value={values?.gender}
                                onChange={handleChange}
                                data= {genderList}
                                label={t("gender")}
                                placeholder={t("select_gender")}
                                name="gender"
                                error={errors?.gender}
                                touched={touched?.gender}
                                className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
                                optionLabel="name"
                            />
                        </div>
                        <div className="w-full"></div>
                    </div>
                    <div className="w-full flex justify-end gap-4 rounded-lg mt-4 text-right text-lg font-semibold">
                        <ButtonComponent
                            onClick={() => handleSubmit()}
                            type="submit"
                            label={t("back")}
                            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                        />
                        <ButtonComponent
                            onClick={() => handleSubmit()}
                            type="submit"
                            label={t("update")}
                            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                        />
                    </div>
            </div>
        </div>
    </div>
    </section>
  )
}

export default ProfilePage;