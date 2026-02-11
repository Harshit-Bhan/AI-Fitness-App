import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";

const AppContext = createContext(initialState)

export const AppProvider = ({children} : {children: React.ReactNode}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials: Credentials) => {
        const {data} = await mockApi.auth.register(credentials)
        setUser({...data.user, token:data.jwt})
        if(data?.user.age && data?.user?.weight && data?.user?.goal) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    }

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials)
        setUser({...data.user, token: data.jwt})
        if(data?.user?.age && data?.user?.weight && data?.user?.goal){
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    }

    const fetchUser = async (token: string) => {
        const { data } = await mockApi.user.me(token)
        setUser({...data, token})
        if(data?.age && data?.weight && data?.goal){
            setOnboardingCompleted(true);
        }
        setIsUserFetched(true);
    }

    const fetchFoodLogs = async () => {
        const { data } = await mockApi.foodLogs.list()
        console.log("FETCHED FOOD:", data);
        setAllFoodLogs(data);
    }

    const fetchActivityLogs = async () => {
        const { data } = await mockApi.activityLogs.list()
        console.log("FETCHED ACTIVITY:", data);
        setAllActivityLogs(data);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        navigate('/login');
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(token){
            (async () => {
                await fetchUser(token);
                await fetchFoodLogs();
                await fetchActivityLogs();
            })(); 
        } else {
            setIsUserFetched(true);
        }
    },[]);



    const value = {
        user , setUser , isUserFetched , fetchUser , 
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