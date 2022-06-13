import { Callout, DefaultButton, IconButton, Modal, Pivot, PivotItem, Stack, Text, TextField } from "@fluentui/react";
import { useContext, useState } from "react";
import { AppContext } from "../app.context";
import { I18nTranslationKey, translate } from "../i18n";
import { handleError, isUserSignedIn, signIn, signOut, signUp, useStyles } from "../services";

export function Navbar() {
    const app = useContext(AppContext);
    const palette = app.theme.palette;

    const [showCallout, setShowCallout] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const styles = useStyles({
        header: {
            width: '100%',
            height: '80px',
            backgroundColor: palette.themePrimary,
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center'
        },
        headerContainer: {
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingLeft: '15px',
            paddingRight: '15px',
        },
        '@media(min-width: 768px)': { headerContainer: { width: '750px' } },
        '@media(min-width: 992px)': { headerContainer: { width: '970px' } },
        '@media(min-width: 1200px)': { headerContainer: { width: '1170px' } },
        pivot: {
            minWidth: '300px',
            width: '400px'
        },
    })();

    const signInButtonId = 'aoj-signin-btn';

    const signInEnabled = () => email && password;
    const signUpEnabled = () => firstname && lastname && email && password;

    return <div className={styles.header}>
        <div className={styles.headerContainer}>
            <Stack tokens={{ childrenGap: 10 }} horizontal reversed styles={{ root: { alignItems: 'center' } }}>
                {
                    isUserSignedIn() ?
                    <DefaultButton onClick={() => { app.setLoading(true);  signOut(); }}>{translate(I18nTranslationKey.navbarSignOut)}</DefaultButton>
                    :
                    <>
                    <DefaultButton id={signInButtonId} onClick={() => setShowCallout(true)}>
                        {translate(I18nTranslationKey.navbarSignIn)}
                    </DefaultButton>
                    {showCallout && (
                        <Modal styles={{ main: { padding: '10px 20px' } }}
                            isBlocking={true}
                            isOpen={showCallout}
                            onDismiss={() => setShowCallout(false)}
                        >
                            <Pivot className={styles.pivot} styles={{ itemContainer: { paddingTop: '15px' } }}>
                                <PivotItem headerText="Sign In">
                                    <Stack tokens={{ childrenGap: 20 }}>
                                        <TextField label={translate(I18nTranslationKey.navbarEmail)}
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.currentTarget.value)}
                                        />
                                        <TextField label={translate(I18nTranslationKey.navbarPassword)}
                                            required
                                            value={password}
                                            type="password"
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                        />
                                        <Stack tokens={{ childrenGap: 20 }} horizontal>
                                            <DefaultButton primary
                                                disabled={!signInEnabled()}
                                                onClick={() => {
                                                    setShowCallout(false);
                                                    app.setLoading(true);
                                                    signIn(email, password);
                                                }}
                                            >
                                                {translate(I18nTranslationKey.navbarSignIn)}
                                            </DefaultButton>
                                            <DefaultButton onClick={() => setShowCallout(false)}>Cancel</DefaultButton>
                                        </Stack>
                                    </Stack>
                                </PivotItem>
                                <PivotItem headerText="Sign Up">
                                    <Stack tokens={{ childrenGap: 20 }}>
                                        <Stack tokens={{ childrenGap: 20 }} horizontal>
                                            <TextField label={translate(I18nTranslationKey.navbarFirstname)}
                                                required value={firstname} onChange={(e) => setFirstname(e.currentTarget.value)}
                                            />
                                            <TextField label={translate(I18nTranslationKey.navbarLastname)}
                                                required value={lastname} onChange={(e) => setLastname(e.currentTarget.value)}
                                            />
                                        </Stack>
                                        <TextField label={translate(I18nTranslationKey.navbarEmail)}
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.currentTarget.value)}
                                        />
                                        <TextField label={translate(I18nTranslationKey.navbarPassword)}
                                            required
                                            value={password}
                                            type="password"
                                            onChange={(e) => setPassword(e.currentTarget.value)}
                                        />
                                        <Stack tokens={{ childrenGap: 20 }} horizontal>
                                            <DefaultButton primary
                                                disabled={!signUpEnabled()}
                                                onClick={() => {
                                                    setShowCallout(false);
                                                    app.setLoading(true);
                                                    try {
                                                        signUp(firstname, lastname, email, password);
                                                    }
                                                    catch (error) {
                                                        app.setLoading(false);
                                                    }
                                                }}
                                            >
                                                Sign Up
                                            </DefaultButton>
                                            <DefaultButton onClick={() => setShowCallout(false)}>Cancel</DefaultButton>
                                        </Stack>
                                    </Stack>
                                </PivotItem>
                            </Pivot>
                        </Modal>
                    )}
                    </>
                }
                <IconButton iconProps={{ iconName: 'Light' }} onClick={() => app.toggleTheme()}
                    styles={{
                        root: { color: palette.neutralLight },
                    }}
                />
            </Stack>
        </div>
    </div>;
}