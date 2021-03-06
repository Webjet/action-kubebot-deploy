import * as core from '@actions/core'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import * as fs from 'fs'

export const deploy = (url: string, file: string) => {
    fs.readFile(file, async function (err, d) {
        try{
            const req = buildReq(url, d);
            core.info(`${req.method} ${req.url}`);
            core.info(`manifest: ${file}`);
            core.info('----------');
            const res = await axios(req);
            logOutput(res);
        } catch (err) {
            logOutput(err.response);
            core.setFailed("Something went wrong with the deployment, query the Kb-Trace-Id in sumo for more details.");
        }
    });
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