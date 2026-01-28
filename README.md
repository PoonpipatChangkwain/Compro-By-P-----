# 🎮 OX Game Winner Checker - Full Stack Application

โปรเจคเพื่อฝึกเขียนโค้ด Python โดยสร้างฟังก์ชันตรวจสอบผู้ชนะเกม OX

---

## 📋 Project Structure

```
Compro/
├── pyproject.toml              # Python dependencies (uv)
├── uv.lock                     # Python lockfile
├── README.md                   # This file
│
├── web_ui/                     # Backend + Pyodide UI
│   ├── index.html             # Pyodide-based editor (fallback)
│   ├── backend/
│   │   ├── app.py             # Flask backend server
│   │   └── requirements.txt    # Python deps (legacy)
│   └── __init__.py
│
├── frontend/                   # Modern Express + TypeScript Frontend
│   ├── package.json           # Node dependencies
│   ├── package-lock.json      # Node lockfile
│   ├── tsconfig.json          # TypeScript config
│   ├── src/
│   │   ├── server.ts          # Express server + proxy API
│   │   └── api.ts             # API types
│   ├── public/
│   │   ├── index.html         # Modern UI (Ace editor)
│   │   └── app.js             # Frontend logic
│   ├── dist/                  # Compiled JS (generated)
│   └── README.md
```

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Flask 2.3.3** — REST API server
- **flask-cors 4.0.0** — CORS support
- **uv** — Fast Python package manager

### Frontend
- **Node.js 16+**
- **Express.js 4.18** — Web server + API proxy
- **TypeScript 5.1** — Type safety
- **Ace Editor** — Code editor with Python syntax highlighting

---

## ⚙️ Architecture

```
Student Browser (localhost:8000)
         ↓
[Express Frontend Server] ← port 8000
         ↓
[API Proxy Routes]
         ↓
[Flask Backend] ← port 5000
         ↓
[Python Code Executor + Test Runner]
```

**Flow:**
1. Student opens `http://localhost:8000`
2. Edits code in Ace editor
3. Clicks "Run Tests"
4. Frontend sends code to `/api/run` (Express)
5. Express proxies to Flask `/api/run` (port 5000)
6. Flask executes code + compares test results
7. Returns verdict (AC/WA/RE/TLE) with details

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- uv (Python package manager)

### 1. Clone / Open Workspace
```bash
cd c:\Users\User\Desktop\ProjectAllMoth\Compro
```

### 2. Setup Backend (Python)
```bash
# Install dependencies using uv
uv sync

# Or manually with pip
pip install Flask flask-cors
```

### 3. Setup Frontend (Node.js)
```bash
cd frontend

# Install dependencies
npm install

# Build TypeScript
npm run build
```

---

## 🎯 Run Local

### Terminal 1: Start Backend (Flask)
```bash
python web_ui/backend/app.py
```
- Server runs on `http://localhost:5000`
- Endpoints:
  - `POST /api/run` — Execute student code + run tests
  - `POST /testfinal` — Get solution (auth required)

### Terminal 2: Start Frontend (Express)
```bash
cd frontend
npm start
```
- Server runs on `http://localhost:8000`
- Open browser → `http://localhost:8000`
- Endpoints:
  - `POST /api/run` — Proxy to Flask
  - `POST /api/solution` — Proxy solution endpoint

### Terminal 3 (Optional): Auto-rebuild Frontend
```bash
cd frontend
npm run dev
```
- Uses `ts-node` for live reload

---

## 📝 How to Use

### For Students
1. Open `http://localhost:8000`
2. See code skeleton:
   ```python
   def check_winner(board_str):
       """
       Input: String 3x3 (newline \\n separated)
       Output: "X is a winner" | "O is a winner" | "This duel is a draw" | "Error please try again"
       """
       # TODO: Write your code
       pass
   ```
3. Implement the function
4. Click "**Run Tests**"
5. See results:
   - ✅ **AC (Accepted)** — All tests passed
   - ❌ **WA (Wrong Answer)** — Shows which test failed
   - ⚠️ **RE (Runtime Error)** — Code crashed
   - ⏱️ **TLE (Time Limit Exceeded)** — Too slow

### For Admin (Solution View)
1. Click "**📖 View Solution (Admin Only)**" button
2. Enter credentials:
   - Username: `moth123`
   - Password: `MChangkwain0`
3. See full solution code

---

## 🧪 Test Cases

Backend tests 10 cases automatically:

| # | Input | Expected Output | Description |
|---|-------|-----------------|-------------|
| 1 | `xxx\noox\noox` | `X is a winner` | X wins (horizontal) |
| 2 | `oox\noxo\nxxx` | `X is a winner` | X wins (horizontal) |
| 3 | `oxo\nxox\nxox` | `This duel is a draw` | Board full, no winner |
| 4 | `OOO\nxox\nxxo` | `O is a winner` | O wins (horizontal) + case insensitive |
| 5 | `oXo\nXXo\nXoX` | `This duel is a draw` | Mixed case, draw |
| 6 | `Ait\n03a\nxOx` | `Error please try again` | Invalid characters |
| 7 | `OOO\nEzz\nlol` | `Error please try again` | Invalid characters |
| 8 | `U can do it na i trust in you fighto!` | `Error please try again` | Invalid characters (too long) |
| 9 | (empty) | `Error please try again` | Empty input |
| 10 | `OOO` | `Error please try again` | Incomplete (not 3x3) |

---

## 🌐 Deploy with ngrok (Share with Students)

### Step 1: Run both servers locally (see above)

### Step 2: Expose Frontend with ngrok
```bash
ngrok http 8000
```

### Step 3: Share ngrok URL
- Students visit: `https://xxxx-yyyy-zzzz.ngrok.io`
- They can submit code from anywhere
- Backend runs securely on your machine

**Security Note:** Only expose frontend with ngrok. Backend stays internal.

---

## 📦 Dependencies

### Python (Backend)
| Package | Version |
|---------|---------|
| Flask | 2.3.3 |
| flask-cors | 4.0.0 |

### Node.js (Frontend)
| Package | Version |
|---------|---------|
| express | 4.18.2 |
| axios | 1.6.0 |
| cors | 2.8.5 |
| typescript | 5.1.3 |
| @types/express | 4.17.17 |
| @types/node | 20.3.1 |

---

## 🛠️ Troubleshooting

### Frontend won't load
- Check if Express is running: `http://localhost:8000`
- Check browser console for errors

### Tests fail with "Invalid output"
- Make sure student code doesn't have `print()` statements
- Backend strips stdout to capture only JSON

### Backend returns 500 error
- Check if Flask is running on port 5000
- Check `python web_ui/backend/app.py` terminal for errors

### CORS errors
- Make sure Flask CORS is enabled
- Express should proxy correctly if running

---

## 🔧 Development

### Add more test cases
Edit `web_ui/backend/app.py`:
```python
TESTS = [
    ["test_input_1", "expected_output_1"],
    ["test_input_2", "expected_output_2"],
    # Add more here
]
```

### Update solution code
Edit `web_ui/backend/app.py`:
```python
SOLUTION = '''
def check_winner(board_str):
    # Your solution here
    pass
'''
```

### Change admin credentials
Edit `web_ui/backend/app.py`:
```python
VALID_USER = "new_username"
VALID_PASS = "new_password"
```

---

## 📧 Contacts

- **Admin Login**: moth123 / MChangkwain0
- **Backend Port**: 5000
- **Frontend Port**: 8000

---

**Created with ❤️ for learning Python**
