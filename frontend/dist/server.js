"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 8000;
const BACKEND_URL = 'http://localhost:5000';
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Proxy API endpoint
app.post('/api/run', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code || typeof code !== 'string') {
            return res.status(400).json({ error: 'code must be a string' });
        }
        const response = await axios_1.default.post(`${BACKEND_URL}/api/run`, { code }, {
            timeout: 10000
        });
        res.json(response.data);
    }
    catch (error) {
        const msg = error.response?.data?.error || error.message || 'Backend error';
        res.status(error.response?.status || 500).json({ error: msg });
    }
});
// Backend office endpoint - get solution
app.post('/api/solution', async (req, res) => {
    try {
        const { username, password } = req.body;
        const response = await axios_1.default.post(`${BACKEND_URL}/testfinal`, { username, password }, {
            timeout: 5000
        });
        res.json(response.data);
    }
    catch (error) {
        const msg = error.response?.data?.error || 'Authentication failed';
        res.status(error.response?.status || 401).json({ error: msg });
    }
});
// Serve index.html for all other routes
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
    console.log(`Backend configured at ${BACKEND_URL}`);
});
//# sourceMappingURL=server.js.map