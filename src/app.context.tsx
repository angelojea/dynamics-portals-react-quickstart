import React, { useEffect, useState } from "react";
import { ITheme, createTheme, loadTheme } from "@fluentui/react";
import i18next from "i18next";

import { englishTranslations, spanishTranslations, I18nLanguage } from "./i18n";
import { Globals, Route } from "./contants";
import { isUserSignedIn } from "./services";

export const AppContext = React.createContext<AppContextProps>({} as any);

export interface AppContextProps {
  reRenderApp: () => void,
  toggleTheme: () => void,
  setLoading: (loading: boolean) => void,
  setLanguage: (newLang: I18nLanguage) => void,
  isDarkTheme: boolean,
  loading: boolean,
  language: I18nLanguage,
  theme: ITheme
}

export function AppContextProvider(props: AppContextProviderProps) {
  if (!isUserSignedIn() && window.location.pathname !== Route.Home) {
    window.location.href = Route.Home;
    return <></>;
  }
  
  const themeKey = localStorage.getItem(Globals.themeDark);
  const languageKey = localStorage.getItem(Globals.languageKey);

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(themeKey && themeKey === 'true' || false);
  const [loadingState, setLoadingState] = useState(false);
  const [language, setLanguage] =
    useState(languageKey && (Object.values(I18nLanguage).filter(x => languageKey === x)) ?
      languageKey
      :
      I18nLanguage.English);

  const body = document.body;
  if (isDarkTheme) body.classList.add(Globals.darkClass);
  else body.classList.remove(Globals.darkClass);

  const lightTheme = createTheme({
    palette: {
      themePrimary: '#0078d4',
      themeLighterAlt: '#eff6fc',
      themeLighter: '#deecf9',
      themeLight: '#c7e0f4',
      themeTertiary: '#71afe5',
      themeSecondary: '#2b88d8',
      themeDarkAlt: '#106ebe',
      themeDark: '#005a9e',
      themeDarker: '#004578',
      neutralLighterAlt: '#faf9f8',
      neutralLighter: '#ffffff',
      neutralLight: '#edebe9',
      neutralQuaternaryAlt: '#e1dfdd',
      neutralQuaternary: '#d0d0d0',
      neutralTertiaryAlt: '#c8c6c4',
      neutralTertiary: '#a19f9d',
      neutralSecondary: '#605e5c',
      neutralPrimaryAlt: '#3b3a39',
      neutralPrimary: '#323130',
      neutralDark: '#201f1e',
      black: '#000000',
      white: '#ffffff',
    }
  });
  const darkTheme = createTheme({
    palette: {
      themePrimary: '#b4009e',
      themeLighterAlt: '#070006',
      themeLighter: '#1d001a',
      themeLight: '#360030',
      themeTertiary: '#6d0060',
      themeSecondary: '#9f008d',
      themeDarkAlt: '#bc13a9',
      themeDark: '#c730b5',
      themeDarker: '#d65ec8',
      neutralLighterAlt: '#201f1e',
      neutralLighter: '#201f1e',
      neutralLight: '#1e1e1d',
      neutralQuaternaryAlt: '#1c1b1b',
      neutralQuaternary: '#8a8886',
      neutralTertiaryAlt: '#1a1918',
      neutralTertiary: '#c8c8c8',
      neutralSecondary: '#d0d0d0',
      neutralPrimaryAlt: '#dadada',
      neutralPrimary: '#ffffff',
      neutralDark: '#f4f4f4',
      black: '#f8f8f8',
      white: '#201f1e',
    }
  });

  loadTheme(isDarkTheme ? darkTheme : lightTheme);

  const appContextValue: AppContextProps = {
    reRenderApp: () => setRefresh(!refresh),
    toggleTheme: () => {
      localStorage.setItem(Globals.themeDark, !isDarkTheme + '');
      setIsDarkTheme(!isDarkTheme);
      setLoading(!loading);
    },
    setLoading: (loading) => {
      if (loading) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'auto';
      setLoadingState(loading);
    },
    setLanguage: (newLang) => {
      localStorage.setItem(Globals.languageKey, newLang);
      i18next.changeLanguage(newLang);
      setLanguage(newLang)
    },
    isDarkTheme: isDarkTheme,
    loading: loadingState,
    language: language as I18nLanguage,
    theme: isDarkTheme ? darkTheme : lightTheme
  }


  useEffect(() => {
    const load = async () => {
      
      await i18next.init({
        lng: language,
        resources: {
          en: { translation: englishTranslations },
          es: { translation: spanishTranslations },
        }
      });
      setLoading(false);
    };
    if (loading) load();
  }, [loading]);
  
  if (loading) return <></>;

  return <AppContext.Provider value={appContextValue}>
    {props.children}
  </AppContext.Provider>;
}

export interface AppContextProviderProps {
  children: any
}
