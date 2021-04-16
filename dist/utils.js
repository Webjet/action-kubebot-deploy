"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deploy = void 0;
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
exports.deploy = (url, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = fs.readFileSync(file, 'utf-8');
        const req = buildReq(url, data);
        core.info(`${req.method} ${req.url}`);
        core.info(`manifest: ${file}`);
        core.info('----------');
        const res = yield axios_1.default(req);
        logOutput(res);
    }
    catch (err) {
        // append error message
        err.message = `Something went wrong with the deployment, query the Kb-Trace-Id in sumo for more details.\n${err.message}`;
        throw err;
    }
});
const buildReq = (url, data) => {
    return {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/yaml'
        },
        data: data
    };
};
const logOutput = (res) => {
    core.info(JSON.stringify({
        "status_code": res.status,
        "headers": res.headers,
        "data": res.data
    }, null, 2));
};
//# sourceMappingURL=utils.js.map