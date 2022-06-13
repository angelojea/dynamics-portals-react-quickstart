import { Fetch, WebFile } from "../contants";
import { ActionPortalRequest, CreatePortalRequest, DeletePortalRequest, UpdatePortalRequest } from "../models";
import { getUserInfo } from "./user";

//=================================
const inputEntityForm = 'AOJ - Portal Request';
const nameField = "aoj_name";
const jsonField = "aoj_json";
const operationTypeField = "aoj_operationtype";
const operationTypes = { Create: 1, Update: 2, Delete: 3, Action: 4, }

enum OperationType {
    Create,
    Update,
    Delete,
    Action,
}
//=================================

export const getFetch = (fetch: Fetch, params = '') => {
    return new Promise<any>((res, rej) => {
        
        var req = new XMLHttpRequest();
        req.open("GET", window.location.origin + '/api/?template=' + fetch + params, true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    let results;
                    try { results = JSON.parse(this.response.trim()) }
                    catch { results = {} }
                    res(results);
                }
                else {
                    rej(this.statusText);
                }
            };
        }
        req.send();
    });
};

export const getFile = (file: WebFile) => {
    return new Promise<any>((res, rej) => {
        
        var req = new XMLHttpRequest();
        req.open("GET", `${window.location.origin}/${fetch}`, true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200)
                    res(this.response.trim());
                else
                    rej(this.statusText);
            };
        }
        req.send();
    });
};

export const createEntity = (payloads: CreatePortalRequest[]): Promise<any> => {
    if (payloads.length <= 0 ) return Promise.resolve();
    return portalRequest(OperationType.Create, payloads);
};

export const updateEntity = (payloads: UpdatePortalRequest[]): Promise<any> => {
    if (payloads.length <= 0 ) return Promise.resolve();
    return portalRequest(OperationType.Update, payloads);
};

export const deleteEntity = (payloads: DeletePortalRequest[]): Promise<any> => {
    if (payloads.length <= 0 ) return Promise.resolve();
    return portalRequest(OperationType.Delete, payloads);
};

export const action = (payloads: ActionPortalRequest[]): Promise<any> => {
    if (payloads.length <= 0 ) return Promise.resolve();
    return portalRequest(OperationType.Action, payloads);
};

const portalRequest = (operation: OperationType, payloads: Array<CreatePortalRequest | UpdatePortalRequest | DeletePortalRequest | ActionPortalRequest>): Promise<any>  => {

    return new Promise((res, rej) => {
        var req = new XMLHttpRequest();
        req.open("GET", window.location.origin + '/api/?entityform=' + inputEntityForm, true);
        req.setRequestHeader("Accept", "text/html");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var htmlString = this.responseText;
                            
                    var div = document.createElement('div');
                    div.innerHTML = htmlString.trim();
                    var newDoc = div.firstChild as any;
                    var buttonName = newDoc.querySelector('#InsertButton').name;
                    newDoc.querySelector('#__EVENTTARGET').value = buttonName;
                    newDoc.querySelector('#' + jsonField).value = JSON.stringify(payloads);

                    var optionSet;
                    var operationName;
                    switch (operation) {
                        case OperationType.Create:
                            optionSet = operationTypes.Create;
                            operationName = 'Create';
                            break;
                        case OperationType.Update:
                            optionSet = operationTypes.Update;
                            operationName = 'Update';
                            break;
                        case OperationType.Delete:
                            optionSet = operationTypes.Delete;
                            operationName = 'Delete';
                            break;
                        case OperationType.Action:
                            optionSet = operationTypes.Action;
                            operationName = 'Action';
                            break;
                    }
                    newDoc.querySelector('#' + nameField).value = `${getUserInfo().name} - ${operationName} - ${payloads[0].entity}`;
                    newDoc.querySelector('#' + operationTypeField).value = optionSet;

                    let iframeId = 'form-submission-' + Date.now();
                    let iframeHtml = `<iframe id="${iframeId}" name="${iframeId}" style="display:none"></iframe>`;
                    document.querySelector('body')?.insertAdjacentHTML('beforeend', iframeHtml);

                    let iframe = document.querySelector('#' + iframeId) as HTMLIFrameElement;
                    if (!iframe) return;
                    
                    iframe.contentWindow!.document.querySelector('body')!.insertAdjacentElement('beforeend', newDoc);
                    newDoc.submit();

                    iframe.addEventListener("load", function(e) {
                        let errorElements = iframe.contentWindow!.document.querySelectorAll('#MessagePanel.alert.alert-danger') as any;
                        if (errorElements.length > 0) {
                            let fragments = errorElements[0].textContent.split(':');
                            let errorMsg = fragments[fragments.length - 1];
                            rej(errorMsg);
                            res(iframe.contentWindow?.document.querySelector('body')?.innerText);
                            iframe?.remove();
                            return;
                        }
                        res(iframe.contentWindow?.document.querySelector('body')?.innerText.replace(/\n/g, '').trim());
                        iframe?.remove();
                        return;
                    });
                }
                else
                {
                    rej(this.statusText);
                }
            };
        }
        req.send();
    });
}