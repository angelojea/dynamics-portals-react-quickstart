import i18next from "i18next";

export enum I18nTranslationKey {
    hello = 't-hello',
    ok = 't-ok',
    accept = 't-accept',
    cancel = 't-cancel',
    englishLangName = 't-englishLangName',
    spanishLangName = 't-spanishLangName',
    navbarSignIn = 't-navbarSignIn',
    navbarSignUp = 't-navbarSignUp',
    navbarSignOut = 't-navbarSignOut',
    navbarEmail = 't-navbarEmail',
    navbarPassword = 't-navbarPassword',
    navbarFirstname = 't-navbarFirstname',
    navbarLastname = 't-navbarLastname',
    footerLinkHome = 't-footerLinkHome',
    footerLinkPage1 = 't-footerLinkPage1',
    footerLinkPage2 = 't-footerLinkPage2',
    footerLinkPage3 = 't-footerLinkPage3',
    footerLangLabel = 't-footerLangLabel',
}

export const translate = (key: I18nTranslationKey) => {
    return i18next.t(key);
  }