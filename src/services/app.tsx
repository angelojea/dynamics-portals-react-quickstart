import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { createUseStyles, DefaultTheme, Styles } from 'react-jss';

import { AppContext, AppContextProps } from '../app.context';
import { generateRandomStr, notification, NotificationType } from '.';
import { Route } from '../contants';

let history: History;
let destructor: (() => void) | undefined;
export let appContext: AppContextProps;

//========================
// Routing
//========================
export const useInitHistory = () => {
  history = useHistory();
  appContext = useContext(AppContext);
}

export const useRegisterDestructor = (handler: () => void) => {
  destructor = handler;
}

export const navigateTo = (route: Route) => {
  if (destructor) { destructor(); destructor = undefined; }
  history.push(route);
  appContext.setLoading(false);
  appContext.reRenderApp();
}
//========================



//========================
// Styles
//========================
export function useStyles<C extends string = string, Props = unknown, Theme = DefaultTheme>(styles: Styles<C, Props, Theme> | ((theme: Theme) => Styles<C, Props, undefined>)) {
  return createUseStyles(styles,
  {
    generateId: () => 'aoj-' + generateRandomStr(10)
  });
}

export const getTheme = () => {
  return appContext.theme;
}
//========================


//========================
// Error Handling
//========================
export class CustomError {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export function handleError(error: any) {
  if (error && error.constructor.name === 'CustomError') {
    notification((error as CustomError).message, NotificationType.Error);
  }
  else {
    notification('An error occurred. Please contact the system admin', NotificationType.Error);
  }
}
//========================