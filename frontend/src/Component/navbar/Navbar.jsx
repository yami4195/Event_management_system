import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link> |
            <Link to="/events">Events</Link> |
            <Link to="/events/create">Create Event</Link>
        </nav>
    );
}
export default Navbar;