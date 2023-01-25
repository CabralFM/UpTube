import react, {useState, useEffect} from 'react';
import axios from "axios";

const UserContext = react.createContext({}); // creating context

const ProviderUser = (props) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [tags, setTags] = useState(null);
    const [loading, setLoading] = useState(true);

    function refresh() {
        axios.get(`http://localhost:3001/user/session`,
            {withCredentials: true})
            .then(res => {
                setUser(res.data?.user[0]);
                setAdmin(res.data?.user[0]?.admin);
                setTags(res.data?.tags);
                setLoading(false);
            }).catch((e)=>{
                console.log("erro de sessao")
                setLoading(false);
            })
    }

    useEffect(() => {
        refresh();
    }, [])

    return <UserContext.Provider value={{id_user: user?.id, user, admin, tags, loading, refresh}}>
        {props.children}
    </UserContext.Provider>
}

const useSession = () => {
    return react.useContext(UserContext)
}

export {useSession, ProviderUser};