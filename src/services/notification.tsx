import { Icon, IStyle } from "@fluentui/react";
import { cssTransition, toast } from "react-toastify"
import { getTheme } from ".";

export const notification = (msg: any, type: NotificationType = NotificationType.Info) => {
  const theme = getTheme();

  const backgroundStyle: React.CSSProperties = {
    color: theme.palette.black,
    backgroundColor: theme.palette.neutralLighterAlt
  };
  const progressStyle: React.CSSProperties = { };
  const iconStyle: IStyle = { color: theme.palette.black };
  let icon = 'Delete';

  let func = null;
  switch (type) {
    case NotificationType.Success:
      func = toast.success;
      progressStyle.backgroundColor = theme.palette.green;
      iconStyle.color = theme.palette.green;
      icon = 'SkypeCircleCheck';
      break;
    case NotificationType.Error:
      func = toast.error;
      progressStyle.backgroundColor = theme.palette.red;
      iconStyle.color = theme.palette.red;
      icon = 'StatusErrorFull';
      break;
    case NotificationType.Warning:
      func = toast.warn;
      progressStyle.backgroundColor = theme.palette.yellowDark;
      iconStyle.color = theme.palette.yellowDark;
      icon = 'WarningSolid';
      break;
    case NotificationType.Info: 
    default:
      func = toast.info;
      progressStyle.backgroundColor = theme.palette.blue;
      iconStyle.color = theme.palette.blue;
      icon = 'InfoSolid';
      break;
  }

  func(msg, {
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    closeButton: <Icon iconName="ChromeClose" styles={{ root: { fontSize: 12 } }} />,
    style: backgroundStyle,
    bodyStyle: backgroundStyle,
    progressStyle: progressStyle,
    icon: <Icon iconName={icon} styles={{ root: iconStyle }} />
  });
}

export enum NotificationType {
  Info, Success, Warning, Error
}