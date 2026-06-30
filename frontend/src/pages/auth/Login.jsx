import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    
    const [Input, setInput] = useState({});
    const handlechange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInput(values => ({...values, [name]: value}));
    };
     const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(Input);
       navigate("/dashboard");
    };
    return(
       <form onSubmit={handleSubmit}>
            <label>Email:
                <input 
                  type = "text"
                  name ="email"
                  value = {Input.email}
                  onChange={handlechange}></input>
            </label><br/>
    <label> Passw:
<input type="password"
                       name="password"
                       value={Input.password}
                       onChange={handlechange}></input>

                </label><br/>
<input type="submit" value="Login"/> <br/>
<a href="#forgot-password">Forgot Password?</a>
    <p>
      Don't Have An Account <Link to="/register">Register</Link>
    </p>
        </form>
    );
} 
 export default Login;