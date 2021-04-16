import * as core from '@actions/core'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import * as fs from 'fs'

export const deploy = async (url: string, file: string) => {
    try {
        const data = fs.readFileSync(file, 'utf-8');
        const req = buildReq(url, data);
        core.info(`${req.method} ${req.url}`);
        core.info(`manifest: ${file}`);
        core.info('----------');
        const res = await axios(req);
        logOutput(res);
    } catch (err) {
        logOutput(err.response);
        // append error message
        err.message = `Something went wrong with the deployment, query the Kb-Trace-Id in sumo for more details.\n#{err.message}`;
        throw err;
    }
}

const buildReq = (url: string, data: any): AxiosRequestConfig => {
    return {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/yaml'
        },
        data: data
    };
};

const logOutput = (res: AxiosResponse<any>) => {
    core.info(JSON.stringify({
        "status_code": res.status,
        "headers": res.headers,
        "data": res.data
    }, null, 2));
}