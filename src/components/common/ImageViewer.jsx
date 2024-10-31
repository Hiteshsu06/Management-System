import { useState, useLayoutEffect } from 'react';
import ButtonComponent from "@common/ButtonComponent";
import { downloadImage } from '@helpers/downloadImage';
import Loading from '@common/Loading';

import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const ImageViewer = () => {
    const location = useLocation();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation("msg");
    const { url, heading, currentUrl } = location.state || {};

    const handleBack =()=>{
        navigate(currentUrl)
    }

    const onloadImage=()=>{
      setLoader(false)
    }

    useLayoutEffect(()=>{
      setLoader(true)
    },[])

  return (
    <div className="min-h-screen bg-BgPrimaryColor p-4">
        {loader && <div className='h-[70vh] border rounded border-BorderColor p-2'><Loading width="w-[90%]"/></div> }
        <div className={`mt-4 flex justify-end gap-2 bg-BgSecondaryColor ${loader ? '' : 'border rounded border-BorderColor p-2'}`}>
             <img
                src={url}
                width="100%"
                onLoad={onloadImage}
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