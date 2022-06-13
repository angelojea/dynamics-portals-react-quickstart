import { ActionButton, CommandButton, Stack, Text } from "@fluentui/react";
import { useContext } from "react";
import { AppContext } from "../app.context";
import { Route } from "../contants";
import { I18nLanguage, I18nKey, translate } from "../i18n";
import { isUserSignedIn, navigateTo, useStyles } from "../services";
import { Separator } from "./separator";

export function Footer() {
    const app = useContext(AppContext);
    const palette = app.theme.palette;
    const styles = useStyles({
        footer: {
            width: '100%',
            height: '130px',
            backgroundColor: app.theme.palette.themeDark,
            marginTop: '30px',
            display: 'flex',
            alignItems: 'center'
        },
        footerContainer: {
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingLeft: '15px',
            paddingRight: '15px',
        },
        '@media(min-width: 768px)': { footerContainer: { width: '750px' } },
        '@media(min-width: 992px)': { footerContainer: { width: '970px' } },
        '@media(min-width: 1200px)': { footerContainer: { width: '1170px' } },
        link: {
            color: app.theme.palette.white,
        },
        langPickerContainer: {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row-reverse',
        }
    })();

    const changeLang = (e: any, i: any) => app.setLanguage(i.key as I18nLanguage);

    return <div className={styles.footer}>
        <div  className={styles.footerContainer}>
            <Stack tokens={{ childrenGap: 5 }} horizontal>
                <ActionButton className={styles.link} onClick={() => navigateTo(Route.Home)}>
                    {translate(I18nKey.footerLinkHome)}
                </ActionButton>
                {isUserSignedIn() &&
                <>
                    <Separator vertical />
                    <ActionButton className={styles.link} onClick={() => navigateTo(Route.Page1)}>
                        {translate(I18nKey.footerLinkPage1)}
                    </ActionButton>
                    <Separator vertical />
                    <ActionButton className={styles.link} onClick={() => navigateTo(Route.Page2)}>
                        {translate(I18nKey.footerLinkPage2)}
                    </ActionButton>
                    <Separator vertical />
                    <ActionButton className={styles.link} onClick={() => navigateTo(Route.Page3)}>
                        {translate(I18nKey.footerLinkPage3)}
                    </ActionButton>
                </>
                }
                <div className={styles.langPickerContainer}>
                    <CommandButton text={translate(I18nKey.footerLangLabel)}
                        styles={{ root: { color: palette.neutralLight }, menuIcon: { color: palette.neutralLight } }}
                        menuProps={{
                                items: [
                                    { key: I18nLanguage.Spanish, text: translate(I18nKey.generalSpanish), onClick: changeLang },
                                    { key: I18nLanguage.English, text: translate(I18nKey.generalEnglish), onClick: changeLang },
                                ],
                            }
                        }
                    />
                </div>
            </Stack>
        </div>
    </div>;
}