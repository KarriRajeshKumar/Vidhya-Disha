import React, { useEffect, useState } from 'react';
import { fetchExams } from './api';

export default function ExamsList({ userId, onStart }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchExams(userId).then((data) => {
      setExams(data.exams || []);
      setLoading(false);
    }).catch((e) => { console.error(e); setLoading(false); });
  }, [userId]);

  if (loading) return <div>Loading exams...</div>;
  if (!exams.length) return <div>No exams available.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map(exam => (
          <div key={exam.id} className="border p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold">{exam.title}</h3>
            <p className="text-sm text-gray-600">{exam.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">{exam.total_questions} questions • {exam.duration_minutes} mins</div>
              <button onClick={() => onStart(exam.id)} className="bg-blue-600 text-white px-3 py-1 rounded">Start</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
