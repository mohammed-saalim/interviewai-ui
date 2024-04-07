import { BiSend } from 'react-icons/bi'


export default function InputCom() {


    return (
        <form className=' bg-white box-shadow p-3 flex items-center w-full max-w-[600px] rounded-full self-center sticky bottom-2'>
            <input 
                type="text"
                className='w-[90%] outline-none text-[1rem] text-blue'
            />
            <button className='text-3xl text-blue'><BiSend /></button>
        </form>
    )

}
    
    
