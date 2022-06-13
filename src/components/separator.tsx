import { ISeparatorProps, Separator as OldSeparator } from "@fluentui/react";
import { useContext } from "react";
import { AppContext } from "../app.context";

export function Separator(props: ISeparatorProps) {
    const appContext = useContext(AppContext);
    appContext.theme.palette.neutralLighter = appContext.theme.palette.neutralTertiary;
    return <OldSeparator {...props} theme={appContext.theme}  />;
}