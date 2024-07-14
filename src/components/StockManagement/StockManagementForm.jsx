// components
import ButtonComponent from "@common/ButtonComponent";
import InputTextComponent from "@common/InputTextComponent";
import { allApi } from "@api/api";

// external libraries
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const data = {
  category: "",
  brandName: "",
  modelNumber: "",
  stockName: "",
  productQty: "",
  buyPrice: "",
  sellPrice: "",
  gst: "",
};

const StockManagementForm = () => {
  const { t } = useTranslation("msg");
  const navigate = useNavigate();
  const { id } = useParams();

  const validationSchema = yup.object().shape({
    category: yup.string().required(t("category_is_required")),
    brandName: yup.string().required(t("brand_name_is_required")),
    modelNumber: yup.string().required(t("model_number_is_required")),
    stockName: yup.string().required(t("stock_name_is_required")),
    productQty: yup.string().required(t("product_qty_is_required")),
    buyPrice: yup.string().required(t("buy_price_is_required")),
    sellPrice: yup.string().required(t("sell_price_is_required")),
    gst: yup.string().required(t("gst_is_required")),
  });

  const onHandleSubmit = async (value) => {
    if (id) {
      // Update Stock
      updateStock(value);
    } else {
      // Create Stock
      createStock(value);
    }
  };

  const createStock = (value) => {
    allApi("stockManagement", value, "post")
      .then(() => {
        navigate("/dashboard/stock-management");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const updateStock = (value) => {
    allApi(`stockManagement/${id}`, value, "put")
      .then(() => {
        navigate("/dashboard/stock-management");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleBack = () => {
    navigate("/dashboard/stock-management");
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
    <div className="flex h-screen bg-BgPrimaryColor">
      <div className="mx-16 my-auto grid h-fit w-full grid-cols-4 gap-4 bg-BgSecondaryColor p-8 border rounded border-BorderColor">
        <div className="col-span-2">
          <InputTextComponent
            value={values?.category}
            onChange={handleChange}
            type="category"
            placeholder={t("category")}
            name="category"
            isLabel={true}
            error={errors?.category}
            touched={touched?.category}
            className="w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.brandName}
            onChange={handleChange}
            type="brandName"
            placeholder={t("brand_name")}
            name="brandName"
            isLabel={true}
            error={errors?.brandName}
            touched={touched?.brandName}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.modelNumber}
            onChange={handleChange}
            type="modelNumber"
            placeholder={t("model_number")}
            name="modelNumber"
            isLabel={true}
            error={errors?.modelNumber}
            touched={touched?.modelNumber}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.stockName}
            onChange={handleChange}
            type="stockName"
            placeholder={t("stock_name")}
            name="stockName"
            isLabel={true}
            error={errors?.stockName}
            touched={touched?.stockName}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.productQty}
            onChange={handleChange}
            type="productQty"
            placeholder={t("product_qty")}
            name="productQty"
            isLabel={true}
            error={errors?.productQty}
            touched={touched?.productQty}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.buyPrice}
            onChange={handleChange}
            type="buyPrice"
            placeholder={t("buy_price")}
            name="buyPrice"
            isLabel={true}
            error={errors?.buyPrice}
            touched={touched?.buyPrice}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.sellPrice}
            onChange={handleChange}
            type="sellPrice"
            placeholder={t("sell_price")}
            name="sellPrice"
            isLabel={true}
            error={errors?.sellPrice}
            touched={touched?.sellPrice}
            className="col-span-2 w-full rounded border-[1px] border-[#ddd] px-[1rem] py-[8px] text-[11px] focus:outline-none"
          />
        </div>
        <div className="col-span-2">
          <InputTextComponent
            value={values?.gst}
            onChange={handleChange}
            type="gst"
            placeholder={t("gst")}
            name="gst"
            isLabel={true}
            error={errors?.gst}
            touched={touched?.gst}
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
            icon="pi pi-arrow-right"
            iconPos="right"
          />
          <ButtonComponent
            onClick={() => handleSubmit()}
            type="submit"
            label={t("submit")}
            className="rounded bg-BgTertiaryColor px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
      </div>
    </div>
  );
};

export default StockManagementForm;
