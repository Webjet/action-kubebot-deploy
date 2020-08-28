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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var fs = __importStar(require("fs"));
var utils_1 = require("./utils");
try {
    var environment = core.getInput('environment');
    var serviceName = core.getInput('service');
    var manifest = core.getInput('manifest');
    var repo = core.getInput('repository');
    var registry = core.getInput('registry') || process.env['CONTAINERREGISTRY'];
    var namespace = core.getInput('namespace') || process.env['NAMESPACE'];
    var tag = core.getInput('tag') || process.env['TAG'];
    var kubebot = process.env['KUBEBOT'];
    if (!kubebot) {
        throw new Error('kubebot url is needed!');
    }
    if (!fs.existsSync(manifest)) {
        throw new Error(manifest + " not found");
    }
    var url = kubebot + "/deploy/" + environment + "/" + namespace + "/" + serviceName + "/" + tag + "?registry=" + registry + "&repository=" + repo;
    utils_1.deploy(url, manifest);
}
catch (error) {
    core.setFailed(error.message);
}
//# sourceMappingURL=index.js.map