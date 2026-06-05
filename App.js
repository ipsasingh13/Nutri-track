
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [meal,setMeal] = useState("");
  const [calories,setCalories] = useState("");

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register",{email,password});
    alert("Registered");
  };

  const login = async () => {
    await axios.post("http://localhost:5000/api/auth/login",{email,password});
    alert("Logged in");
  };

  const addMeal = async () => {
    await axios.post("http://localhost:5000/api/meals",{
      userId: email,
      name: meal,
      calories
    });
    alert("Meal added");
  };

  return (
    <div style={{padding:20}}>
      <h2>Nutrition App</h2>

      <input placeholder="email" onChange={e=>setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />

      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>

      <hr/>

      <input placeholder="meal" onChange={e=>setMeal(e.target.value)} />
      <input placeholder="calories" onChange={e=>setCalories(e.target.value)} />

      <button onClick={addMeal}>Add Meal</button>
    </div>
  );
}

export default App;
