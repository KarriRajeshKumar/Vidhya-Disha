export const API_BASE = (import.meta.env && import.meta.env.DEV) ? '' : ((import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : 'http://localhost:4000');

export async function fetchExams(userId) {
  const res = await fetch(`${API_BASE}/api/exams?userId=${encodeURIComponent(userId)}`);
  return res.json();
}

export async function startExam(userId, examId) {
  const res = await fetch(`${API_BASE}/api/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, examId })
  });
  return res.json();
}

export async function submitExam(payload) {
  const res = await fetch(`${API_BASE}/api/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function fetchHistory(userId) {
  const res = await fetch(`${API_BASE}/api/history?userId=${encodeURIComponent(userId)}`);
  return res.json();
}
