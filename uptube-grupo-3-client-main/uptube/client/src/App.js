import './App.css';
import {BrowserRouter, Redirect, Route, Switch, useLocation} from "react-router-dom";
import {ProviderUser, useSession} from "./providers/UserContext";
import User from "./components/pages/user/user";
import {SkeletonTheme} from "react-loading-skeleton";
import axios from "axios";
import HomePage from "./components/pages/homepage/Homepage";
import Register from "./components/pages/register/Register";
import Login from "./components/pages/login/Login";
import RecoverPw from "./components/pages/recoverPw/RecoverPw";
import Upload from "./components/pages/video/upload/upload.js";
import EditVideo from "./components/pages/video/edit/edit";
import VideoPage from "./components/pages/video/videopage";
import {Logout} from "./components/pages/login/Logout";
import {Login_bypass} from "./components/pages/login/login_bypass";
import Definitions from "./components/pages/definitions/definitions";
import History from "./components/pages/history/history";
import Playlists from "./components/pages/playlists/playlists";
import Subscriptions from "./components/pages/subscriptions/subscriptions";
import Trends from "./components/pages/trends/trends";
import Channels from "./components/pages/channels/channels";
import PlaylistPage from "./components/pages/playlistPage/playlistpage";
import {ProviderNavbar} from "./providers/NavbarContext";
import ChangePw from "./components/pages/recoverPw/ChangePw";
import Navbar from "./components/layout/navbar/navbar";
import React from "react";
import Search from "./components/layout/search/search";
import Admin from "./components/pages/admin/admin";
import Studiopage from "./components/pages/studio/studiopage";
import Reportpage from "./components/pages/report/reportpage";

axios.defaults.withCredentials = true;

// TODO: atualizar Routes depois de ter o useSession a FUNC

function Routes() {
    const {user, loading} = useSession();
    console.log(user, loading)
    if (loading) return <span>loading</span>;
    if (user) {
        return <Switch>
            <Route path="/logout" component={Logout}/>
            <Route path="/video/upload" component={Upload}/>
            <Route path="/studiopage" component={Studiopage}/>
            <Route path="/video/edit/:id_video" component={EditVideo}/>
            <Route path="/history" component={History}/>
            <Route path="/definitions" component={Definitions}/>
            <Route path="/subscriptions" component={Subscriptions}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/changePw" component={ChangePw}/>
            <Route path="/reportpage" component={Reportpage}/>

            <Route path="/homepage" component={HomePage}/>
            <Route path="/video/:id_video" component={VideoPage}/>
            <Route path="/user/:id_user" component={User}/>
            <Route path="/playlists" component={Playlists}/>
            <Route path="/trends" component={Trends}/>
            <Route path="/channels" component={Channels}/>
            <Route path="/playlist/:id_playlist" component={PlaylistPage}/>
            <Route path="/recover-password" component={RecoverPw}/>
            <Redirect to={"/homepage"}/>
        </Switch>
    }
    return <Switch>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/loginn" component={Login_bypass}/>
        <Route path="/recover-password" component={RecoverPw}/>
        <Route path="/changePw" component={ChangePw}/>

        <Route path="/homepage" component={HomePage}/>
        <Route path="/video/:id_video" component={VideoPage}/>
        <Route path="/user/:id_user" component={User}/>
        <Route path="/playlists" component={Playlists}/>
        <Route path="/trends" component={Trends}/>
        <Route path="/channels" component={Channels}/>
        <Route path="/playlist/:id_playlist" component={PlaylistPage}/>
        <Redirect to={"/homepage"}/>
    </Switch>
}

function Wrapper() {

    const location = useLocation();

    let showSidebar = !['/login', '/register', '/changePw', '/recover-password'].includes(location.pathname)


    return <SkeletonTheme baseColor="#202020" highlightColor="#444">
        {showSidebar && <Navbar/>}
        {showSidebar && <Search/>}
        <Routes/>
    </SkeletonTheme>
}

function App() {
    return <ProviderUser>
        <ProviderNavbar>
            <BrowserRouter>
                <div className="App">
                    <Wrapper/>
                </div>
            </BrowserRouter>
        </ProviderNavbar>
    </ProviderUser>
}

export default App;
