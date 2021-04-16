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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const utils_1 = require("./utils");
try {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const environment = core.getInput('environment');
        const serviceName = core.getInput('service');
        const manifest = core.getInput('manifest');
        const repo = core.getInput('repository');
        const registry = core.getInput('registry') || process.env['CONTAINERREGISTRY'];
        const namespace = core.getInput('namespace') || process.env['NAMESPACE'];
        const tag = core.getInput('tag') || process.env['TAG'];
        const kubebot = process.env['KUBEBOT'];
        if (!kubebot) {
            throw new Error('kubebot url is needed!');
        }
        if (!fs.existsSync(manifest)) {
            throw new Error(`${manifest} not found`);
        }
        const url = `${kubebot}/deploy/${environment}/${namespace}/${serviceName}/${tag}?registry=${registry}&repository=${repo}`;
        yield utils_1.deploy(url, manifest);
    }))();
}
catch (error) {
    core.setFailed(error.message);
}
//# sourceMappingURL=index.js.map