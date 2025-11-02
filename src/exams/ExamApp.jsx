import React, { useState } from 'react';
import ExamsList from './ExamsList';
import ExamPage from './ExamPage';
import ResultPage from './ResultPage';

export default function ExamApp({ userId }) {
  const [currentExam, setCurrentExam] = useState(null);
  const [result, setResult] = useState(null);

  const start = (examId) => setCurrentExam({ examId });
  const handleFinish = (res) => { setResult(res); setCurrentExam(null); };

  if (result) return <ResultPage result={result} />;
  if (currentExam) return <ExamPage userId={userId} examId={currentExam.examId} onFinish={handleFinish} />;

  return <ExamsList userId={userId} onStart={(id) => start(id)} />;
}
