import React, { useState, useEffect, useRef } from 'react';
import { startExam, submitExam } from './api';

export default function ExamPage({ userId, examId, onFinish }) {
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!userId || !examId) return;
    (async () => {
      const data = await startExam(userId, examId);
      setSession(data.sessionId);
      setQuestions(data.questions || []);
      setTimeLeft((data.questions?.length || 10) * 60); // default 1 minute per question
    })();
  }, [userId, examId]);

  useEffect(() => {
    if (!timeLeft) return;
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && session) {
      handleSubmit();
    }
  }, [timeLeft]);

  const selectAnswer = (questionId, selectedIndex) => {
    setAnswers(prev => {
      const copy = [...prev];
      const existing = copy.find(a => a.questionId === questionId);
      if (existing) existing.selectedIndex = selectedIndex;
      else copy.push({ questionId, selectedIndex });
      return copy;
    });
  };

  const handleNext = () => setIndex(i => Math.min(i + 1, questions.length - 1));
  const handlePrev = () => setIndex(i => Math.max(i - 1, 0));

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    const payload = { userId, examId, answers, timeTakenMinutes: Math.round(((questions.length * 60) - timeLeft) / 60) };
    const result = await submitExam(payload);
    if (onFinish) onFinish(result);
  };

  if (!questions.length) return <div>Preparing exam...</div>;

  const q = questions[index];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{session ? 'Exam In Progress' : 'Preparing...'}</h2>
        <div className="text-lg font-mono">Time: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
      </div>

      <div className="border p-4 rounded">
        <div className="mb-2">Question {index + 1} of {questions.length}</div>
        <div className="text-lg font-semibold mb-3">{q.question_text}</div>
        <ul>
          {q.choices.map((c, i) => (
            <li key={i} className={`p-2 border rounded my-1 cursor-pointer ${answers.find(a => a.questionId === q.id && a.selectedIndex === i) ? 'bg-blue-100' : ''}`} onClick={() => selectAnswer(q.id, i)}>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={handlePrev} className="px-3 py-1 border rounded">Previous</button>
        <div>
          <button onClick={handleNext} className="px-3 py-1 border rounded mr-2">Next</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-green-600 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
