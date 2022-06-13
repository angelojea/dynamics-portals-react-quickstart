import { Text } from "@fluentui/react";
import { useContext } from "react";
import { AppContext } from "../app.context";
import { useStyles } from "../services";

export function Page2() {
    const app = useContext(AppContext);
    const styles = useStyles({
        page1: {
        }
    })();

    return (
        <div className={styles.page1}>
            <Text><h1>Page2</h1></Text>
        </div>
    )
}