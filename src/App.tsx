import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import useRedirectToLogin from "./hooks/useRedirectToLogin";
import ADRForm from "./components/ADRForm";
import PatientForm from "./components/PatientForm";
import {
  AppBar,
  IconButton,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import { Login } from "./components/Login";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    activeMenuItem: {
      backgroundColor: "#dde",
      color: "#3f51b5",
      "&:hover": { backgroundColor: "#dde" },
    },
    menuContainer: { display: "flex", flex: 1, justifyContent: "center" },
    menuItem: { flex: "0 1 250px", justifyContent: "center" },
  })
);

const gotoHome = () => (window.location.href = "/");

const App = () => {
  const classes = useStyles();

  window
    .fetch("http://localhost:2048/api/v4/patient")
    // .then((response) => console.log(response))
    .then((response: any) => response.json())
    .then((data) => console.log(data));

  return (
    <AuthProvider>
      <Router>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={gotoHome}>
              <HomeIcon style={{ color: "#fff" }} />
            </IconButton>
            <div className={classes.menuContainer}>
              <MenuItem
                component={NavLink}
                to="/adverse-drug-reactions"
                className={classes.menuItem}
                activeClassName={classes.activeMenuItem}
              >
                Adverse Drug Reactions
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/patients"
                className={classes.menuItem}
                activeClassName={classes.activeMenuItem}
              >
                Patients
              </MenuItem>
            </div>
            <IconButton component={Link} to="/login">
              <AccountCircle style={{ color: "#fff" }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div style={{ padding: 20 }}>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/adverse-drug-reactions">
              <ADRForm />
            </Route>
            <Route path="/patients">
              <PatientForm />
            </Route>
            <Route path="/">
              <Home />
            </Route>
            <Route path="*">
              <Typography>Page Not Found</Typography>
            </Route>
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

const Home = () => {
  // const { authFetch } = useAuthFetch();
  // getSchema(authFetch);
  useRedirectToLogin();

  return <Typography variant="h4">Welcome</Typography>;
};

export default App;
