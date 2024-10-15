import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-content-center absolute w-full z-10 bg-[rgb(236 236 241 / 50%)]">
        <ProgressSpinner style={{width: '50px', height: '50px'}} className='text-BgTertiaryColor'/>
    </div>
  )
}

export default Loading;