from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile, subprocess, sys, os, json

app = Flask(__name__)
CORS(app)

TESTS = [
    ["xxx\noox\noox", "X is a winner"],
    ["oox\noxo\nxxx", "X is a winner"],
    ["oxo\nxox\nxox", "This duel is a draw"]
]

# Solution code
SOLUTION = '''def check_winner(board_str):
    """
    ฟังก์ชัน: ตรวจสอบผู้ชนะในเกม OX
    Input: String 3x3 (นำ newline คั่น)
    Output: "X is a winner" | "O is a winner" | "This duel is a draw" | "Error please try again"
    """
    try:
        rows = board_str.strip().split('\\n')
        if len(rows) != 3:
            return "Error please try again"
        
        grid = [list(row.lower()) for row in rows]
        if any(len(row) != 3 for row in grid):
            return "Error please try again"
    except:
        return "Error please try again"

    # สร้างเส้น 8 รูปแบบ (3 แนวนอน + 3 แนวตั้ง + 2 แนวทแยง)
    lines = []
    for i in range(3):
        lines.append(grid[i])  # แนวนอน
        lines.append([grid[0][i], grid[1][i], grid[2][i]])  # แนวตั้ง
    
    lines.append([grid[0][0], grid[1][1], grid[2][2]])  # แนวทแยงหลัก
    lines.append([grid[0][2], grid[1][1], grid[2][0]])  # แนวทแยงรอง

    # ตรวจสอบผู้ชนะ
    x_wins = any(line == ['x', 'x', 'x'] for line in lines)
    o_wins = any(line == ['o', 'o', 'o'] for line in lines)

    # ลองิก: ถ้าทั้งสองชนะก็ error (ไม่ได้)
    if x_wins and o_wins:
        return "Error please try again"
    
    if x_wins:
        return "X is a winner"
    if o_wins:
        return "O is a winner"
    
    # ตรวจสอบว่าเสมอ (บอร์ดเต็มแต่ไม่มีใครชนะ)
    is_full = all(cell in ['x', 'o'] for row in grid for cell in row)
    if is_full:
        return "This duel is a draw"
    
    return "Error please try again"
'''

# Credentials
VALID_USER = "moth123"
VALID_PASS = "MChangkwain0"


@app.route('/api/run', methods=['POST'])
def run_code():
    """
    Grading flowchart:
    1. Load test cases
    2. Loop: Execute code with each test case
    3. Check: Runtime error? → RE | Wrong output? → WA | All passed? → AC
    4. Report verdict & details
    """
    payload = request.get_json(force=True)
    code = payload.get('code', '')
    if not isinstance(code, str):
        return jsonify({'verdict': 'ERROR', 'error': 'code must be a string'}), 400
    if len(code) > 20000:
        return jsonify({'verdict': 'ERROR', 'error': 'code too large'}), 400

    runner = []
    runner.append('import json,traceback,sys,io')
    runner.append(f'tests = {json.dumps(TESTS)}')
    runner.append('result = []')
    runner.append('# Capture any output')
    runner.append('old_stdout = sys.stdout')
    runner.append('sys.stdout = io.StringIO()')
    runner.append('try:')
    # insert user's code WITH proper indentation
    for line in code.splitlines():
        runner.append('    ' + line)
    runner.append("    if 'check_winner' not in globals():")
    runner.append("        raise NameError('check_winner not defined')")
    runner.append('    func = check_winner')
    runner.append('    for inp, expected in tests:')
    runner.append('        try:')
    runner.append('            out = func(inp)')
    runner.append("            result.append({'input':inp,'expected':expected,'actual':out,'passed': out==expected})")
    runner.append('        except Exception:')
    runner.append('            tb = traceback.format_exc()')
    runner.append("            result.append({'input':inp,'expected':expected,'actual':None,'passed':False,'error':tb})")
    runner.append('except Exception:')
    runner.append('    tb = traceback.format_exc()')
    runner.append("    result = {'setup_error':tb}")
    runner.append('finally:')
    runner.append('    sys.stdout = old_stdout')
    runner.append('print(json.dumps(result))')

    script = '\n'.join(runner)

    tmp = None
    try:
        tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8')
        tmp.write(script)
        tmp.flush()
        tmp.close()
        proc = subprocess.run([sys.executable, tmp.name], capture_output=True, text=True, timeout=4)
        stdout = proc.stdout.strip()
        if not stdout:
            return jsonify({'verdict': 'RE', 'error': 'Runtime Error', 'details': proc.stderr}), 200
        try:
            parsed = json.loads(stdout)
            # Determine verdict based on test results
            verdict, details = determine_verdict(parsed)
            result = {'verdict': verdict, 'details': details}
            if isinstance(parsed, list):
                result['tests'] = parsed
            elif isinstance(parsed, dict) and 'setup_error' in parsed:
                result['error'] = parsed['setup_error']
            return jsonify(result)
        except Exception:
            return jsonify({'verdict': 'RE', 'error': 'Invalid output', 'stderr': proc.stderr}), 200
    except subprocess.TimeoutExpired:
        return jsonify({'verdict': 'TLE', 'error': 'Time Limit Exceeded', 'details': 'Code took too long to execute'}), 200
    except Exception as e:
        return jsonify({'verdict': 'RE', 'error': 'Internal error', 'exception': str(e)}), 500
    finally:
        if tmp is not None:
            try:
                os.unlink(tmp.name)
            except Exception:
                pass


def determine_verdict(parsed):
    """
    Flowchart logic:
    1. Check for setup error → RE
    2. Loop through test cases:
       - If has error field → RE (first error)
       - If not passed → WA (first failure)
    3. If all passed → AC
    """
    if isinstance(parsed, dict) and 'setup_error' in parsed:
        return 'RE', 'Runtime Error during setup: ' + str(parsed['setup_error'])[:200]
    
    if not isinstance(parsed, list):
        return 'RE', 'Unexpected response format'
    
    # Loop through test cases (flowchart step 3)
    for i, test in enumerate(parsed, 1):
        if not isinstance(test, dict):
            return 'RE', f'Test case {i}: Invalid format'
        
        # Check for runtime error (flowchart: Did it crash?)
        if test.get('error'):
            error_msg = str(test['error'])[:300]
            return 'RE', f'Runtime Error on Test {i}:\n{error_msg}'
        
        # Check for wrong answer (flowchart: Output mismatch?)
        if not test.get('passed', False):
            return 'WA', {
                'test_num': i,
                'input': test.get('input', ''),
                'expected': test.get('expected', ''),
                'actual': test.get('actual', ''),
                'total_tests': len(parsed)
            }
    
    # All tests passed (flowchart: Is it the last test case? Yes → AC)
    return 'AC', f'All {len(parsed)} test cases passed!'


@app.route('/testfinal', methods=['POST'])
def testfinal():
    """
    Backend office endpoint - authenticate and get solution
    POST body: { "username": "...", "password": "..." }
    """
    payload = request.get_json(force=True)
    username = payload.get('username', '')
    password = payload.get('password', '')
    
    if username == VALID_USER and password == VALID_PASS:
        return jsonify({'authorized': True, 'solution': SOLUTION})
    else:
        return jsonify({'authorized': False, 'error': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
