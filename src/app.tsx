import { BrowserRouter as Router } from "react-router-dom";

import { DefaultLayout } from './layouts';
import { AppContextProvider } from "./app.context";
import { useStyles } from "./services";

export function App() {
  const styles = useStyles({
    app: { height: '100%', },
  })();
  
  return (
    <AppContextProvider>
      <div className={styles.app}>
        <Router>
          <DefaultLayout />
        </Router>
      </div>
    </AppContextProvider>);
}