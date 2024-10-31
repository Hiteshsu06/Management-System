import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = ({width}) => {
  return (
    <div className={`flex items-center justify-content-center absolute z-10 bg-[rgb(236 236 241 / 50%)] h-[70vh] ${width ? width : 'w-full'}`}>
        <ProgressSpinner style={{width: '50px', height: '50px'}} className='text-BgTertiaryColor'/>
    </div>
  )
}

export default Loading;