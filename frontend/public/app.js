let editor;

// Initialize Ace editor
window.addEventListener('DOMContentLoaded', () => {
  editor = ace.edit('editor');
  editor.setTheme('ace/theme/atom_dark');
  editor.session.setMode('ace/mode/python');
  editor.setFontSize(14);
  editor.setShowPrintMargin(false);
  editor.setHighlightActiveLine(true);
  
  const defaultCode = `def check_winner(board_str):
    """
    ฟังก์ชัน: ตรวจสอบผู้ชนะในเกม OX
    
    Input: String 3x3 (นำ newline \\n คั่นระหว่างแถว)
    Output: 
      - "X is a winner" ถ้า X ชนะ
      - "O is a winner" ถ้า O ชนะ
      - "This duel is a draw" ถ้าเสมอ
      - "Error please try again" ถ้ามีข้อมูลผิด
    """
    # TODO: เขียนโค้ดด้านล่าง
    # 1. แปลง String เป็น 2D Grid
    # 2. ตรวจสอบว่า input ถูกต้อง (3x3, มี x/o/space เท่านั้น)
    # 3. ตรวจสอบผู้ชนะ (rows, columns, diagonals)
    # 4. คืนค่าผลลัพธ์
    
    pass
`;
  editor.setValue(defaultCode);
  editor.clearSelection();
});

async function runTests() {
  const btn = document.getElementById('runBtn');
  const code = editor.getValue();
  const resultsDiv = document.getElementById('results');

  btn.disabled = true;
  btn.innerHTML = '<span class="loading-spinner"></span> Running...';

  resultsDiv.innerHTML = '';

  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    // Display verdict card
    if (data.verdict) {
      const verdictCard = renderVerdictCard(data);
      resultsDiv.innerHTML = verdictCard;
      
      // Display test details if available
      if (data.tests && Array.isArray(data.tests)) {
        resultsDiv.innerHTML += '<hr style="margin: 16px 0; border: none; border-top: 1px solid #e3e7ee;">';
        resultsDiv.innerHTML += '<div style="padding-top: 16px;"><h3 style="font-size: 14px; margin-bottom: 12px;">Test Details</h3>';
        resultsDiv.innerHTML += data.tests.map((test, idx) => renderTestCase(test, idx + 1)).join('');
        resultsDiv.innerHTML += '</div>';
      }
    } else if (data.setup_error) {
      resultsDiv.innerHTML = `<div class="test-case fail">
        <div class="test-label"><span class="status fail"></span>Setup Error</div>
        <div class="test-error">${escapeHtml(data.setup_error)}</div>
      </div>`;
    } else if (data.error) {
      resultsDiv.innerHTML = `<div class="test-case fail">
        <div class="test-label"><span class="status fail"></span>Error</div>
        <div class="test-error">${escapeHtml(data.error)}</div>
      </div>`;
    } else {
      resultsDiv.innerHTML = `<div class="test-case fail">
        <div class="test-label"><span class="status fail"></span>Unexpected Response</div>
        <div class="test-error">${escapeHtml(JSON.stringify(data))}</div>
      </div>`;
    }
  } catch (error) {
    resultsDiv.innerHTML = `<div class="test-case fail">
      <div class="test-label"><span class="status fail"></span>Network Error</div>
      <div class="test-error">${escapeHtml(error.message)}</div>
    </div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Run Tests';
  }
}

function renderVerdictCard(data) {
  const verdict = data.verdict;
  let verdictClass, verdictLabel, verdictEmoji;
  
  switch(verdict) {
    case 'AC':
      verdictClass = 'verdict-ac';
      verdictLabel = 'Accepted (AC)';
      verdictEmoji = '✓';
      break;
    case 'WA':
      verdictClass = 'verdict-wa';
      verdictLabel = 'Wrong Answer (WA)';
      verdictEmoji = '✗';
      break;
    case 'RE':
      verdictClass = 'verdict-re';
      verdictLabel = 'Runtime Error (RE)';
      verdictEmoji = '⚠';
      break;
    case 'TLE':
      verdictClass = 'verdict-tle';
      verdictLabel = 'Time Limit Exceeded (TLE)';
      verdictEmoji = '⏱';
      break;
    default:
      verdictClass = 'verdict-err';
      verdictLabel = 'Error';
      verdictEmoji = '!';
  }

  let html = `<div class="verdict-card ${verdictClass}">
    <div class="verdict-header">
      <span class="verdict-emoji">${verdictEmoji}</span>
      <span class="verdict-title">${verdictLabel}</span>
    </div>`;

  if (verdict === 'WA' && typeof data.details === 'object') {
    const d = data.details;
    html += `<div class="verdict-body">
      <div class="wa-detail">
        <div class="wa-label">Failed on Test ${d.test_num} / ${d.total_tests}</div>
        <div style="margin-top: 8px;">
          <div class="test-input"><strong>Input:</strong> ${escapeHtml(d.input)}</div>
          <div class="test-expected"><strong>Expected:</strong> ${escapeHtml(d.expected)}</div>
          <div class="test-actual"><strong>Actual:</strong> ${escapeHtml(d.actual)}</div>
        </div>
      </div>
    </div>`;
  } else if (data.details) {
    html += `<div class="verdict-body">${escapeHtml(String(data.details))}</div>`;
  } else if (data.error) {
    html += `<div class="verdict-body error">${escapeHtml(data.error)}</div>`;
  }

  html += '</div>';
  return html;
}

function renderTestCase(test, index) {
  const status = test.passed ? 'pass' : 'fail';
  const statusIcon = test.passed ? '✓' : '✗';
  const statusText = test.passed ? 'Passed' : 'Failed';

  let html = `<div class="test-case ${status}">
    <div class="test-label"><span class="status ${status}"></span>Test ${index}: ${statusText}</div>
    <div class="test-input">${escapeHtml(test.input)}</div>
    <div class="test-expected"><strong>Expected:</strong> ${escapeHtml(test.expected)}</div>
    <div class="test-actual"><strong>Actual:</strong> ${escapeHtml(test.actual === null ? 'Error' : test.actual)}</div>`;

  if (test.error) {
    html += `<div class="test-error">${escapeHtml(test.error)}</div>`;
  }

  html += '</div>';
  return html;
}

function resetCode() {
  editor.setValue(`def check_winner(board_str):
    """
    รับสตริง 3x3 (ใช้ \\n เป็น new line) และคืนค่า:
    - "X is a winner" ถ้า X ชนะ
    - "O is a winner" ถ้า O ชนะ
    - "This duel is a draw" ถ้าเสมอ
    - "Error please try again" ถ้ามีข้อมูลไม่ถูกต้อง
    """
    # ✏️ แก้ไขโค้ดด้านล่างนี้
    pass
`);
  editor.clearSelection();
  document.getElementById('results').innerHTML = '<div class="empty-state"><p>กด "Run Tests" เพื่อดูผลลัพธ์</p></div>';
}

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function openLoginModal() {
  document.getElementById('loginModal').classList.add('active');
  document.getElementById('loginError').textContent = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('username').focus();
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
}

async function loginAndGetSolution() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  if (!username || !password) {
    errorDiv.textContent = 'Please enter username and password';
    return;
  }

  try {
    const response = await fetch('/api/solution', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      errorDiv.textContent = 'Invalid username or password';
      return;
    }

    const data = await response.json();
    if (data.authorized && data.solution) {
      document.getElementById('solutionCode').textContent = data.solution;
      document.getElementById('solutionPanel').classList.add('active');
      closeLoginModal();
    } else {
      errorDiv.textContent = data.error || 'Authentication failed';
    }
  } catch (error) {
    errorDiv.textContent = 'Network error: ' + error.message;
  }
}

function closeSolution() {
  document.getElementById('solutionPanel').classList.remove('active');
}
