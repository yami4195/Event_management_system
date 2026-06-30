import Navbar from "../../Component/navbar/Navbar";

function Dashboard(){
return(
    <div>
        <h1>Event Management System</h1>
     <Navbar/>
        <h2>Dashboard</h2> 

        <div> 
            <h3>Total Events</h3>
            <p>0</p>
        </div>

        <div> 
            <h3>Upcoming Events</h3>
            <p>0</p>
        </div>

         <div> 
            <h3>Registered Events</h3>
            <p>0</p>
           </div>
    </div>
);
}
 export default Dashboard;