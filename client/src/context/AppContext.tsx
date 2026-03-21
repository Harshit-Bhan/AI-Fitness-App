import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../configs/api";
import toast from "react-hot-toast";


const AppContext = createContext(initialState)

export const AppProvider = ({children} : {children: React.ReactNode}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(localStorage.getItem('token') ? false : true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials: Credentials) => {

        try {
            const {data} = await api.post('/api/auth/local/register',credentials)
            setUser({...data.user, token:data.jwt})
            if(data?.user.age && data?.user?.weight && data?.user?.goal) {
                setOnboardingCompleted(true);
            }
            localStorage.setItem('token', data.jwt);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
        } catch (error) {
            console.log(error);
            toast.error(getApiErrorMessage(error, 'Failed to sign up.'))  
        }
    }

    const login = async (credentials: Credentials) => {
        try {
            const { data } = await api.post('/api/auth/local', {
                identifier: credentials.email,
                password: credentials.password
            })
            setUser({...data.user, token: data.jwt})
            if(data?.user?.age && data?.user?.weight && data?.user?.goal){
                setOnboardingCompleted(true);
            }
            localStorage.setItem('token', data.jwt);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.jwt}`;
        } catch (error) {
            console.log(error);
            toast.error(getApiErrorMessage(error, 'Failed to log in.'));           
        }
    }

    const fetchUser = async (token: string) => {
        try {
            const { data } = await api.get('/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })  
            setUser({...data, token})
            if(data?.age && data?.weight && data?.goal){
                setOnboardingCompleted(true);
            }
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        } catch (error) {
            console.log(error);
            localStorage.removeItem('token');
            setUser(null);
            setOnboardingCompleted(false);
            delete api.defaults.headers.common['Authorization'];
            toast.error(getApiErrorMessage(error, 'Failed to fetch user.'));
            return false;
        } finally {
            setIsUserFetched(true);
        }
    }

    const fetchFoodLogs = async (token: string) => {
        try {
            const {data} = await api.get('/api/food-logs',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAllFoodLogs(data);
        } catch (error) {
            console.log(error);
            toast.error(getApiErrorMessage(error, 'Failed to fetch food logs.'));
        }
    }

    const fetchActivityLogs = async (token: string) => {
        try {
            const {data} = await api.get('/api/activity-logs',{headers:{
                Authorization: `Bearer ${token}`
            }})
            setAllActivityLogs(data);
        } catch (error) {
            console.log(error);
            toast.error(getApiErrorMessage(error, 'Failed to fetch activity logs.'));
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            setIsUserFetched(true);
            return;
        }

        void (async () => {
            const isAuthenticated = await fetchUser(token);
            if(!isAuthenticated) return;

            await Promise.all([
                fetchFoodLogs(token),
                fetchActivityLogs(token),
            ]);
        })();
        },[]);



    const value = {
        user , setUser , isUserFetched , fetchUser , fetchFoodLogs ,
        signup , login , logout , 
        onboardingCompleted , setOnboardingCompleted ,
        allFoodLogs , allActivityLogs ,
        setAllFoodLogs , setAllActivityLogs   
    }


    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(context === undefined){
        throw new Error('useAppContext must be used within a AppProvider')
    }
    return context;
}
