import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FirstLoadPage() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/onboard');
        }, 4000);
    }, []); // Added an empty dependency array to ensure the effect runs only once after the component mounts.

    return (
        <div className="bg-[#3369FF] fade-in height flex justify-center items-center">
            <img src="mascot.png" alt="Mascot" /> {/* Added alt text for accessibility */}
        </div>
    );
}
