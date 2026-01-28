# OX Game Checker — Web UI

How to use
- Open the file `web_ui/index.html` in your browser (double-click or drag into browser).
- Wait for Pyodide to load (the Run button will enable), then edit the `check_winner` function in the editor.
- Click **Run tests** to execute the three provided test cases. Results show pass/fail and any error tracebacks.

Server mode (optional)
- A small Flask backend is included at `web_ui/backend/app.py` that exposes `/api/run` to run submitted code and return JSON results.
- Install dependencies and run the server:

```bash
python -m pip install -r web_ui/backend/requirements.txt
python web_ui/backend/app.py
```

- By default the server listens on port 5000. You can expose it with `ngrok http 5000` and provide the ngrok URL in the UI `Server URL` field.

Security note
- The backend executes submitted Python code. Do not expose it publicly without proper sandboxing. Use `ngrok` only for short, controlled sessions with trusted students.

Notes
- The UI runs Python in the browser via Pyodide — no server required.
- The editor is a simple textarea for quick practice. If you want syntax highlighting, integrate Monaco or CodeMirror.

Files
- `index.html` — the web UI and test runner.

If you want, I can add a small local server script or integrate a nicer code editor next. 
