import i18next from "i18next";

export enum I18nLanguage {
    English = 'en',
    Spanish = 'es',
}

export enum I18nKey {
    generalHello = 'general.hello',
    generalOk = 'general.ok',
    generalAccept = 'general.accept',
    generalCancel = 'general.cancel',
    generalEnglish = 'general.english',
    generalSpanish = 'general.spanish',

    navbarSignIn = 'navbar.signIn',
    navbarSignUp = 'navbar.signUp',
    navbarSignOut = 'navbar.signOut',
    navbarEmail = 'navbar.email',
    navbarPassword = 'navbar.password',
    navbarFirstname = 'navbar.firstname',
    navbarLastname = 'navbar.lastname',

    footerLinkHome = 'footer.linkHome',
    footerLinkPage1 = 'footer.linkPage1',
    footerLinkPage2 = 'footer.linkPage2',
    footerLinkPage3 = 'footer.linkPage3',
    footerLangLabel = 'footer.langLabel',
}

export const translate = (key: I18nKey) => {
    return i18next.t(key);
  }