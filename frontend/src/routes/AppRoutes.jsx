import { BrowserRouter, Routes, Route} from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EventList from "../pages/events/EventList";
import CreateEvent from "../pages/events/CreateEvent";
import Register from "../pages/auth/Register"
import Navbar from "../Component/navbar/Navbar";

function AppRoutes(){
return(
    <BrowserRouter>
    <Routes>
       <Route path ="/" element= {<Login/>}/>
       <Route path ="/dashboard" element= {<Dashboard/>}/>
       <Route path ="/events" element={<EventList/>}/>
       <Route path = "/events/create" element ={<CreateEvent/>}/>
       <Route path = "/register" element={<Register/>}/>
       <Route path = "/navbar" element={<Navbar/>}/>
    </Routes>
    </BrowserRouter>
);
}

export default AppRoutes;
