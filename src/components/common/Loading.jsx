import { useTranslation } from "react-i18next";

const Loading = ({loadingText}) => {
  const { t } = useTranslation('msg');
  return (
    <div>{loadingText || t('loading')}</div>
  )
}

export default Loading;