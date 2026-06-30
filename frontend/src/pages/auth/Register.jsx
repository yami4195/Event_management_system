import {useState} from "react";
import { Link } from "react-router-dom";

function Register(){
    const [Input, setInput] = useState({});
    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInput(values => ({...values, [name]: value}));
    };
    const handlesubmit = (e) => {
        e.preventDefault();
    };
     return(
        <form onSubmit={handlesubmit}>
          <label>First Name:
                <input
                  type="text"
                  name="firstname"
                  value={Input.firstname}
                  onChange={handlechange}
                ></input>
          </label><br/>

          <label>Last Name:
                <input
                  type="text"
                  name="lastname"
                  value={Input.lastname}
                  onChange={handlechange}
                ></input>
          </label><br/>

<label> Email:  
                  <input type="text"
                  name="email"
                  value={Input.email}
                  onChange={handlechange}
                 ></input>
                 </label><br/>
 
 <label>Password:
                <input
                  type="password"
                  name="password"
                  value={Input.password}
                  onChange={handlechange}
                ></input>
          </label><br/>
          <input type="submit" value="REGISTER NOW"/><br/>
          <label>Role:
                <select value={Input.role} onChange={handlechange}>
                    <option value="CUSTOMER" >CUSTOMER</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
          </label><br/>
 
            <p> 
            Already have an account? <Link to="/">Login</Link>
            </p>
        </form>
     );
    }
export default Register;