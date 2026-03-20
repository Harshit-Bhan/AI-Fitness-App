import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Profile from "./pages/Profile"
import Layout from "./pages/Layout"
import { useAppContext } from "./context/AppContext"
import Login from "./pages/Login"
import Loading from "./components/Loading"
import Onboarding from "./pages/Onboarding"
import { Toaster } from "react-hot-toast"

const App = () => {
  const {user,isUserFetched,onboardingCompleted} = useAppContext();

  if(!isUserFetched){
    return <Loading/>
  }

  return (
    <>
      <Toaster/>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={onboardingCompleted ? "/" : "/onboarding"} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : onboardingCompleted ? (
              <Navigate to="/" replace />
            ) : (
              <Onboarding />
            )
          }
        />
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : !onboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout />
            )
          }
        >
          <Route index element={<Dashboard/>}/>
          <Route path="food" element={<FoodLog/>}/>
          <Route path="activity" element={<ActivityLog/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to={!user ? "/login" : !onboardingCompleted ? "/onboarding" : "/"}
              replace
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
