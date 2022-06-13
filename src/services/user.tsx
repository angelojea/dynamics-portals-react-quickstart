import { getEventListeners } from "events";
import { appContext, CustomError, handleError, notification, NotificationType, updateEntity } from ".";
import { Globals, Route } from "../contants";
import { ContactInfo, Entity } from "../models";
import { httpGet } from "./http";

export const isUserSignedIn = () => {
    const signedin = document.querySelector('#signedin') as HTMLInputElement;
    if (!signedin) return true;

    return signedin.value === 'true';
}

export const getUserInfo = (): ContactInfo => {
    const contactInfo = document.querySelector('#contact-info') as HTMLInputElement;
    if (!contactInfo) {
        return {
            email: 'test@test.com',
            firstname: 'John',
            id: '123456',
            lastname: 'Doe',
            name: 'stranger',
            phone: '999 999 9999',
            roles: []
        };
    }

    return JSON.parse(decodeURIComponent(contactInfo.value)) as ContactInfo;
}

export const signIn = (email: string, password: string) => {

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/SignIn';
    document.body.appendChild(iframe);

    iframe.addEventListener("load", () => {
        const innerWindow = iframe.contentWindow!;

        // Means it's succesfully logged in
        if (innerWindow.location.pathname === '/') {
            iframe.remove();
            window.location.reload();
            return;
        }

        // Means there's been an error
        const error = iframe.contentDocument?.querySelector('.alert-danger') as HTMLDivElement;
        if (error && error.innerText && error.innerText.trim()) {
            iframe.remove();
            notification(error.innerText.trim(), NotificationType.Error);
            appContext.setLoading(false);
            return;
        }

        const form = iframe.contentDocument?.querySelector('form[action="/SignIn"]') as HTMLFormElement;
        const emailInput = form.querySelector('#Username') as HTMLInputElement;
        const passwordInput = form.querySelector('#PasswordValue') as HTMLInputElement;
        emailInput.value = email;
        passwordInput.value = password;
        form.submit();
    });
}

export const signUp = async (firstname: string, lastname: string, email: string, password: string) => {
    try {
        const iframe = document.createElement('iframe');
        iframe.src = '/Account/Login/Register';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        iframe.addEventListener("load", async () => {
            const innerWindow = iframe.contentWindow!;
    
            // Means it's succesfully logged in
            if (innerWindow.location.pathname === '/') {
                iframe.remove();
                window.location.href = `${window.location.origin}${Route.RegisterCallback}?${Globals.firstnameParam}=${firstname}&${Globals.lastnameParam}=${lastname}`;
                return;
            }
    
            // Means there's been an error
            const error = iframe.contentDocument?.querySelector('.alert-danger') as HTMLDivElement;
            if (error && error.innerText && error.innerText.trim()) {
                iframe.remove();
                notification(error.innerText.trim(), NotificationType.Error);
                appContext.setLoading(false);
                return;
            }

            const form = iframe.contentDocument?.querySelector('form[action*="./Register"]') as HTMLFormElement;
            const emailInput = form.querySelector('#EmailTextBox') as HTMLInputElement;
            const usernameInput = form.querySelector('#UserNameTextBox') as HTMLInputElement;
            const passwordInput = form.querySelector('#PasswordTextBox') as HTMLInputElement;
            const confirmPasswordInput = form.querySelector('#ConfirmPasswordTextBox') as HTMLInputElement;
            emailInput.value = email;
            usernameInput.value = email;
            passwordInput.value = password;
            confirmPasswordInput.value = password;

            const submitBtn = iframe.contentDocument?.querySelector('#SubmitButton') as HTMLButtonElement;
            submitBtn.click();
        });
    }
    catch (error) {
        
    }
}

export const signOut = () => {
    window.location.href = window.location.origin + '/Account/Login/LogOff';
}