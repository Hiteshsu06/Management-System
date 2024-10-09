import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-content-center absolute w-full">
        <ProgressSpinner style={{width: '50px', height: '50px'}} className='text-BgTertiaryColor'/>
    </div>
  )
}

export default Loading;