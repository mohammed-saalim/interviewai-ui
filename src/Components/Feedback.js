import React from 'react';
import { useLocation } from 'react-router-dom';
import { questions } from '../Constants/questions'; // Import the questions object

const Feedback = () => {
    const location = useLocation();
    const { data } = location.state; // Destructure the data object from location.state

    // Regular expression to match the score in the response
    const scoreRegex = /(?:Score:|score=) (\d+(?:\.\d+)?)/i
    
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">Summary Page</h1>
            {Object.entries(data).map(([key, value]) => {
                try {
                    // Extract the score using regex
                    const match = value.match(scoreRegex);
                    const score = match ? parseFloat(match[1]) : null;

                    return (
                        <div key={key} className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
                            <p className="text-lg">{`Question ${key}: ${questions[key]}`}</p>
                            <p className="text-lg">Answer: {value}</p>
                            {/* Display the extracted score */}
                            {score && <p className="text-sm">Score: {score.toFixed(1)}/1</p>}
                        </div>
                    );
                } catch (error) {
                    console.error('Error parsing score:', error);
                    return null;
                }
            })}
        </div>
    );
};

export default Feedback;
