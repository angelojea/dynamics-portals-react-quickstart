import { Stack, Text } from "@fluentui/react";
import { useContext, useEffect } from "react";
import { AppContext } from "../app.context";
import { Globals, Route } from "../contants";
import { I18nTranslationKey, translate } from "../i18n";
import { Entity } from "../models";
import { getParameterByName, getUserInfo, navigateTo, updateEntity, useStyles } from "../services";

export function RegisterCallbackPage() {
    const app = useContext(AppContext);
    useEffect(() => {
        const run = async () => {
            app.setLoading(true);

            const firstname = getParameterByName(Globals.firstnameParam);
            const lastname = getParameterByName(Globals.lastnameParam);

            await updateEntity([{
                entity: Entity.Contact,
                id: getUserInfo().id,
                payload: {
                    firstname: firstname,
                    lastname: lastname
                }
            }]);
            window.location.href = `${window.location.origin}${Route.Home}`;
        };
        run();
    });

    return <></>;
}