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
  long_term: "",
  short_term_url: "",
  long_term_url: ""
};

const StockForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const [data, setData] = useState(structure);
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_is_required")),
    price: yup.string().required(t("price_is_required")),
    short_term: yup.string().required(t("short_term_is_required")),
    long_term: yup.string().required(t("long_term_is_required"))
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update
      updateStock(value);
    } else {
      // Create
      createStock(value);
    }
  };

  const createStock = (value) => {
    let body = {
      name: value?.name,
      price: value?.price,
      short_term: value?.short_term,
      long_term: value?.long_term,
      sector_id: value?.sector
    }
    allApiWithHeaderToken("stocks", body, "post", 'multipart/form-data')
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const updateStock = (value) => {
    allApiWithHeaderToken(`stock/${id}`, value, "put", 'multipart/form-data')
      .then(() => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleBack = () => {
    navigate("/dashboard/stocks");
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

  const { values, errors, handleSubmit, handleChange, touched, setFieldValue } = formik;

  return (
    <div className="flex h-full bg-BgPrimaryColor py-4">
      <div className="mx-4 sm:mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-4 md:col-span-2">
          <InputTextComponent
            value={values?.name}
            onChange={handleChange}
            type="text"
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
            type="text"
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
            value={values?.sector}
            onChange={handleChange}
            data= {[]}
            placeholder={t("select_sector")}
            name="sector"
            error={errors?.sector}
            touched={touched?.sector}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] custom-dropdown focus:outline-none"
            optionLabel="name"
          />
        </div>
        <div className="col-span-4 md:col-span-2">
        </div>
        <div className="col-span-4 md:col-span-2">
            <FileUpload 
              value={values?.short_term}
              name="short_term"
              isLabel={t("stock_short_term_chart")} 
              onChange={(e)=> {
                setFieldValue('short_term', e?.currentTarget?.files[0]);
                setFieldValue('short_term_url', URL.createObjectURL(e?.target?.files[0]));
              }}
            />
        </div>
        <div className="col-span-4 md:col-span-2">
            <FileUpload 
              isLabel={t("stock_long_term_chart")}
              value={values?.long_term}
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

export default StockForm;
