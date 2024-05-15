import React from 'react';
import { useLocation } from 'react-router-dom';

const Feedback = () => {
    const location = useLocation();
    const { data, questions } = location.state; // Assuming 'questions' contains the relevant category questions

    return (
        <div className="container">
            <h1 className="text-3xl font-bold text-center mb-8 bg-cyan-900">Interview Feedback Summary</h1>
            <div className="grid">
                {Object.entries(data).map(([key, feedbackData]) => {
                    const { feedback, score } = feedbackData;
                    const questionText = questions[key]; // Access the question text directly by key
                    
                    return (
                        <div key={key} className="card">
                            <h2 className="card-header">{`Question: ${questionText}`}</h2>  {/* Displaying the question text */}
                            {score && (
                                <p className="card-score score-animate">
                                    Score: {parseFloat(score).toFixed(1)}/1
                                </p>
                            )}
                            <p className="card-content">{feedback}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Feedback;
