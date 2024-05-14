import {FaArrowLeft} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'


export default function Navbar() {
   
    const navigate = useNavigate()
    
    return (
        <div className="flex justify-between sticky top-0 z-[9999] py-4 bg-white">
            <div className='flex gap-6 items-center'>
                <button onClick={()=>{navigate('/onboard')}}>
                    <FaArrowLeft />
                </button>
                <img src='logo.png'/>
                <div>
                    <h2 className='text-blue font-bold text-[1.25rem]'>AI Interviewer</h2>
                </div>
            </div>
            <button className='border-blue border-[2px] px-4 rounded-full font-semibold text-[1.1rem] hover:bg-blue hover:text-white active:bg-blue active:text-white'>Start over</button>
        </div>
    )

}
