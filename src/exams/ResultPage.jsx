import React from 'react';

export default function ResultPage({ result }) {
  if (!result) return <div>No result available.</div>;

  const { score, total, correct, suggestions } = result;
  const percentage = score;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exam Results</h2>
      <div className="mb-4">Score: <strong>{correct}/{total}</strong></div>
      <div className="mb-4">Percentage: <strong>{percentage}%</strong></div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Improvement Suggestions</h3>
        <div className="text-sm text-gray-700">{suggestions || 'No suggestions available.'}</div>
      </div>
    </div>
  );
}
