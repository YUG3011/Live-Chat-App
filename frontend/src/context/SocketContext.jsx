import { createContext,useState,useEffect,useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const usesocketContext= ()=>{
        return useContext(SocketContext);
};

export const SocketContextProvider=({children})=>{
    const [Socket, setSocket] = useState(null)

    const [OnlineUser, setOnlineUser] = useState([]);

    const {authUser}= useAuth();

    useEffect(() => {
            if(authUser){
                const Socket = io("http://localhost:3000/",{

                    query:{
                        userId:authUser?._id,
                    }
                })

                Socket.on("getonlineuser",(users)=>{
                    setOnlineUser(users)
                });
                setSocket(Socket);
                return()=>Socket.close();
             }
             else{
                if(Socket){
                    Socket.close();
                    setSocket(null)
                }
             }
    }, [authUser]);

    return(
    
    <SocketContext.Provider value={{Socket , OnlineUser}}>
        {children}
    </SocketContext.Provider>
    )
}
