import React, {useState} from "react";

const NavbarContext = React.createContext({});

function ProviderNavbar(props) {
    const [navbarActive, setNavbarActive] = useState(false);

    return <NavbarContext.Provider value={{
        navbarActive,
        setNavbarActive}}>
        {props.children}
    </NavbarContext.Provider>;
}

function useNavbar() {
    return React.useContext(NavbarContext);
}

export {ProviderNavbar, useNavbar};