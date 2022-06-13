import { useContext } from "react";
import {
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import { cssTransition, ToastContainer } from "react-toastify";
import { AppContext } from "../app.context";

import { Footer, Loading, Navbar } from "../components";
import { Globals, Routes } from "../contants";
import { generateRandomStr, useInitHistory, useStyles } from "../services";

export function DefaultLayout() {
    useInitHistory();
    
    const app = useContext(AppContext);
    const styles = useStyles({
        aojContainer: {
            minHeight: '300px',
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingLeft: '15px',
            paddingRight: '15px',
        },
            
        '@media(min-width: 768px)': { aojContainer: { width: '750px' } },
        '@media(min-width: 992px)': { aojContainer: { width: '970px' } },
        '@media(min-width: 1200px)': { aojContainer: { width: '1170px' } }
    })();
  
    return <div className={app.isDarkTheme ? Globals.darkClass : ''}
        style={{minHeight:'100%', backgroundColor: app.theme.palette.neutralLighterAlt}}>
            <ToastContainer className={'animated'}
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={cssTransition({ enter: 'animated slideInDown', exit: 'animated slideOutUp', })}
            />
        <Loading/>
        <Navbar />
        <div className={styles.aojContainer}>
            <Switch>
                {
                    Object.values(Routes).map(x =>
                        <Route key={generateRandomStr(10)}
                            exact={true}
                            path={x.path}
                            component={x.component}></Route>)
                }
                <Redirect to={Routes.Home.path} />
            </Switch>
        </div>
        <Footer />
    </div>;
}