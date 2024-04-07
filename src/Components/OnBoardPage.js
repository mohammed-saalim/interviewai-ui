import {FaArrowRight} from 'react-icons/fa'
import {useNavigate} from 'react-router-dom'

export default function OnboardPage() {

    const navigate = useNavigate()
    function goToChat(){
        navigate('/chat')
    }

    return (
        <div className="height fade-in py-8 px-8 flex flex-col justify-between items-center">
        <div className="pt-16">
            <h1 className="text-blue text-center font-bold text-2xl">Your AI Assistant</h1>
            <p className="text-gray text-lg text-center mt-4">Using this software, you can ask you questions and receive answers using artificial intelligence</p>
        </div>
        <img 
            src="onboard.png"
            className='fade-in max-w-[500px] my-4'
        />
        <button onClick={goToChat} className="bg-blue w-full max-w-[500px] rounded-full p-4 text-white font-bold text-lg tracking-wide flex items-center justify-between">
            <div></div>
            <p>Continue</p>
            <i><FaArrowRight /></i>
        </button>
        </div>
    )
}
