import * as core from '@actions/core'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import * as fs from 'fs'

export const deploy = (url: string, file: string, h: object) => {
    fs.readFile(file, async function (err, d) {
        try{
            const req = buildReq(url, d, h);
            core.info(`${req.method} ${req.url}`);
            core.info('----------');
            console.dir(req);
            core.info(`manifest: ${file}`);
            core.info('----------');
            const res = await axios(req);
            logOutput(res);
        } catch (err) {
            // core.setFailed("Something went wrong with the deployment: " + err);
            core.setFailed(JSON.stringify({ "message": "Please check your deployment logs in SumoLogic, and verify the cluster with KUBECTL", "innerException" : err}));
        }
    });
}

const buildReq = (url: string, data: any, h: object): AxiosRequestConfig => {
    return {
        url: url,
        method: 'POST',
        headers: h,
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