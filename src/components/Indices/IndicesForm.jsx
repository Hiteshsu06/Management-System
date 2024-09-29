// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import FileUpload from "@common/FileUpload";
import { allApiWithHeaderToken } from "@api/api";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Dropdown from "@common/DropdownComponent";

const structure = {
  name: "",
  price: "",
  short_term: "",
  long_term: ""
};
const categories = [
  {name: "Domestic", value: 0},
  {name: "International", value: 1}
]
const IndicesForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    price: yup.string().required(t("price_is_required")),
    country: yup.string().required(t("country_is_required")),
    category: yup.string().required(t("category_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateIndex(value);
    } else {
      // Create
      createIndex(value);
    }
  };

  const createIndex = (value) => {
    let body = {
      name: value?.name,
      price: value?.price,
      short_term: value?.short_term,
      long_term: value?.long_term,
      country_code: value?.country?.value,
      category_code: value?.category?.value
    }
    allApiWithHeaderToken("indices", body, "post", 'multipart/form-data')
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const updateIndex = (value) => {
    allApiWithHeaderToken(`indices/${id}`, value, "put")
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleBack = () => {
    navigate("/dashboard/indices");
  };

  useEffect(() => {
    if (id) {
      allApiWithHeaderToken(`companies/${id}`, "", "get")
        .then((response) => {
          setData(response?.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, []);

  const formik = useFormik({
    initialValues: data,
    onSubmit: onHandleSubmit,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
  });

  const { values, errors, handleSubmit, handleChange, setFieldValue, touched } = formik;

  return (
    <div className="flex h-screen bg-BgPrimaryColor py-4">
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
            data= {[]}
            placeholder={t("select_country")}
            name="country"
            error={errors?.country}
            touched={touched?.country}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
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
              value={values?.short_term}
              name="short_term"
              isLabel={t("stock_short_term_chart")} 
              onChange={(e)=> {
                setFieldValue('short_term', e?.currentTarget?.files[0])
              }}/>
        </div>
        <div className="col-span-4 md:col-span-2">
            <FileUpload 
              isLabel={t("stock_long_term_chart")}
              value={values?.long_term}
              name="long_term"
              onChange={(e)=> {
                setFieldValue('long_term', e?.currentTarget?.files[0])
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
            icon="pi pi-arrow-right"
            iconPos="right"
          />
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={t("submit")}
            className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
    </div>
  );
};

export default IndicesForm;