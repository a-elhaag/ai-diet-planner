"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mssql_1 = __importDefault(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();

const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false,
    },
};

app.get("/users", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mssql_1.default.connect(config);
        const result = yield mssql_1.default.query `SELECT * FROM Users`;
        res.json(result.recordset);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
    }
}));

const PORT = 3000;
const API_URL = `http://localhost:${PORT}`;

// Start server on all interfaces (so friends can connect)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server is running at ${API_URL}`);
});
