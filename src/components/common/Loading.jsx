import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {
  return (
    <div className="flex items-center justify-content-center absolute w-full z-10 bg-[rgb(236 236 241 / 50%)]" style={{ height: '80svh' }}>
        <ProgressSpinner style={{width: '50px', height: '50px'}} className='text-BgTertiaryColor'/>
    </div>
  )
}

export default Loading;