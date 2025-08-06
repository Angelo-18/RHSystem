import { Navigate, Route, Routes } from "react-router-dom"
import { HRDashboardPage } from "../pages/HRDashboardPage"


export const JournalRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <HRDashboardPage /> } />

        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )
}
