import React from "react";
import "./index.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Home from "./views/homePage";
import About from "./views/aboutPage";
import Login from "./views/loginPage";
import Register from "./views/registerPage";
import Detection from "./views/detectionPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AuthProvider>
          <Navbar />
          <Switch>
            <PrivateRoute component={Detection} path="/detection" exact />
            <Route component={Login} path="/login" />
            <Route component={Register} path="/register" />
            <Route component={About} path="/about" />
            <Route component={Home} path="/" />
          </Switch>
        </AuthProvider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
