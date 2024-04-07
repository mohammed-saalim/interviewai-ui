import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export default function FirstLoadPage() {
    
    const navigate = useNavigate()

    useEffect(()=>{
        setTimeout(()=>{
            navigate('/onboard')
        }, 4000)
    })

    return (
        <div className="bg-[#3369FF] fade-in height grid place-content-center">
            <img 
                src="mascot.png"
            />
        </div>
    )
}
