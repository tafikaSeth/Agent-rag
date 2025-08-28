import React, { useState } from 'react'
import axios from 'axios';
import './Ask.css'

export const QuestionResponse = () => {
    const [question, setQuestion] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {
        if (!question.trim()) return;
        setLoading(true);
    
        try {
          const res = await axios.post('http://localhost:5000/ask', {
            question: question.trim(),
          });

          const newEntry = {
            question: question.trim(),
            answer: res.data.answer || 'Pas de réponse trouvée',
          };

          setHistory((prev) => [newEntry, ...prev]);
          setQuestion('');
        } catch (err) {
          console.error(err);
          alert("Erreur lors de l'envoi de la question.");
        } finally {
          setLoading(false);
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        askQuestion();
      };
    


  return (
    <div className="ask">
      <h1>Pose ta question !</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pose une question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Envoyer'}
        </button>
      </form>

      <div className="history">
        {history.map((entry, index) => (
          <div className="qa-pair" key={index}>
            <p><strong>Q:</strong> {entry.question}</p>
            <p><strong>R:</strong> {entry.answer}</p>
            <hr />
          </div>
        ))}
      </div>
      
    </div>
  )
}