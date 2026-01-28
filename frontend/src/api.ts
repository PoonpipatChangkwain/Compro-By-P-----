// API client for running code
export interface TestResult {
  input: string;
  expected: string;
  actual: string | null;
  passed: boolean;
  error?: string;
}

export interface RunResponse {
  setup_error?: string;
  error?: string;
  [key: number]: TestResult;
}

export async function runCode(code: string): Promise<RunResponse | TestResult[]> {
  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const err = await response.json() as any;
      throw new Error(err?.error || 'Server error');
    }

    const data = await response.json() as RunResponse | TestResult[];
    return data;
  } catch (error: unknown) {
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
