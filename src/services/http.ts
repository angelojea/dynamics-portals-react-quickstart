export const httpGet = (url: string): Promise<any> => {
    return new Promise((res, rej) => {
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                let response;
                if (this.status === 200) {
                    try {
                        response = JSON.parse(this.response) as any;
                    }
                    catch (error) {
                        response = this.response;
                    }
                }
                else {
                    rej(this.statusText);
                    return;
                }
                res(response);
            };
        }
        req.send();
    });
}

export const httpPost = (url: string, body: any, urlEncoded = false): Promise<any> => {
    return new Promise((res, rej) => {
        var req = new XMLHttpRequest();
        req.open("POST", url, true);
        req.withCredentials = false;
        req.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
        if (urlEncoded) 
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        else
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200 || this.status === 204) res(JSON.parse(this.response || '{}') as any);
                else if (this.status === 302) res(null);
                else rej(this.statusText);
            }
        };
        if (urlEncoded) req.send(body);
        else req.send(JSON.stringify(body));
    });
}