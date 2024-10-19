import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from "@common/ButtonComponent";
import { useTranslation } from "react-i18next";
import { downloadImage } from '@components/helpers/downloadImage';

const ImageViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation("msg");
    const { url, heading, currentUrl } = location.state || {};

    const handleBack =()=>{
        navigate(currentUrl)
    }
  return (
    <div className="min-h-screen bg-BgPrimaryColor p-4">
        <div className="mt-4 flex justify-end gap-2 bg-BgSecondaryColor border rounded border-BorderColor p-2">
            <LazyLoadImage
                src={url}
            />
            <span className='ri-download-2-line absolute text-[1.5rem] top-[2.5rem] right-[2rem]' role='button' onClick={()=>downloadImage(url, heading)}></span>
        </div>
        <div className="mt-4 flex justify-end gap-4">
          <ButtonComponent
            onClick={() => handleBack()}
            type="button"
            label={t("back")}
            className="rounded bg-[#1f1f70] px-6 py-2 text-[12px] text-white"
            icon="pi pi-arrow-right"
            iconPos="right"
          />
        </div>
   </div>
  )
}

export default ImageViewer;