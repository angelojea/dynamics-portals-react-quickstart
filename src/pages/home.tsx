import { Stack, Text } from "@fluentui/react";
import { useContext } from "react";
import { AppContext } from "../app.context";
import { I18nKey, translate } from "../i18n";
import { getUserInfo, useStyles } from "../services";

export function HomePage() {
    const app = useContext(AppContext);
    const styles = useStyles({
        home: {
        }
    })();


    return (
        <div className={styles.home}>
            <Stack tokens={{childrenGap:20}}>
                <Text><h1>{`${translate(I18nKey.generalHello)} ${getUserInfo().name}.`}</h1></Text>
                <Text><p>This is an example of text that is not translated</p></Text>
            </Stack>
        </div>
    )
}