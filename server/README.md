# Exams Server

1. Copy `.env.sample` to `.env` and fill DB and GEMINI_API_KEY values.
2. Create the database and tables:
   - Run `mysql -u root -p < db.sql` or open `db.sql` in your MySQL client.
3. Install dependencies:
   - `npm install` (run inside `server` folder)
4. Start server:
   - `npm run dev`

Endpoints:

- `GET /api/exams?userId=...` - get exams for user
- `POST /api/start` - body: { userId, examId } -> starts exam and returns session/questions
- `POST /api/submit` - body: { userId, examId, answers, timeTakenMinutes } -> submits answers and returns suggestions
- `GET /api/history?userId=...` - user history

Note: Replace the Gemini API call endpoint with your actual provider endpoint and response parsing logic.
