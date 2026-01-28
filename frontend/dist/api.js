"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = runCode;
async function runCode(code) {
    try {
        const response = await fetch('/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err?.error || 'Server error');
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Network error';
        return [{
                input: '',
                expected: '',
                actual: null,
                passed: false,
                error: errorMsg
            }];
    }
}
//# sourceMappingURL=api.js.map