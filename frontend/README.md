# OX Game Frontend

A modern web-based code editor for practicing the OX Game Winner Checker challenge.

## Architecture

- **Frontend**: Express server + TypeScript @ localhost:8000
- **API Layer**: Node.js proxy at `/api/run` → routes to Flask backend
- **Backend**: Flask Python server @ localhost:5000 (runs code tests)
- **UI**: Ace code editor + real-time test results

## Setup

### Prerequisites
- Node.js 16+
- Python 3.7+
- Flask backend running on localhost:5000

### Install & Run

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Build TypeScript:
   ```bash
   npm run build
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

4. Open browser to `http://localhost:8000`

### Development Mode

For live reload while developing:
```bash
npm run dev
```

## Scripts

- `npm run build` — Compile TypeScript to JavaScript
- `npm run dev` — Run with ts-node (development)
- `npm start` — Run compiled JavaScript (production)
- `npm run clean` — Remove dist/ folder

## How to Use

1. Edit the `check_winner` function in the editor
2. Click "Run Tests" to execute against the three test cases
3. View pass/fail results instantly in the right panel
4. Reset code with the "Reset" button

## Sharing with ngrok

Once backend is running on port 5000, expose both services:

```bash
# Terminal 1: Backend
python web_ui/backend/app.py

# Terminal 2: Frontend
npm start

# Terminal 3: Expose frontend with ngrok
ngrok http 8000
```

Share the ngrok URL (e.g., `https://abc123.ngrok.io`) with students.

---

**Note:** Do not expose the backend directly to untrusted networks. Only the frontend should be public.
