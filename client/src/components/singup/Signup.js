import React from "react";
import './Signup.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
function Signup() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  let navigate = useNavigate();
  let [err, setErr] = useState("");

  async function formSubmit(user) {
    console.log(user);
    let res;
    if (user.userType === 'user') {
      res = await axios.post('http://localhost:4000/user-api/users', user);
    } else {
      res = await axios.post('http://localhost:4000/author-api/authors', user);
    }
    console.log(res.data);
    if (res.data.message === 'user created' || res.data.message === 'author created') {
      navigate('/signin');
    } else {
      console.log(res.data.message);
      setErr(res.data.message);
    }
  }
  return (
    <div className="signup-container">
      <div className="text-center">
        <h1 className="mb-4 text-danger">Sign Up</h1>
        <form className="form-inline" onSubmit={handleSubmit(formSubmit)}>
          <div className="radiobut mb-4 text-center">
            <input type="radio" id="user" name="userType" value="user" defaultChecked {...register("userType")} />
            <label htmlFor="user" className="me-3">User</label>
            <input type="radio" id="author" name="userType" value="author" {...register("userType")} />
            <label htmlFor="author" className="me-3">Author</label>
          </div>
          {err.length !== 0 && <h1 className="lead text-center text-danger">{err}</h1>}
          <div className="form-group mb-4">
            <label htmlFor='username' className='form-label text-danger'>Username</label>
            <input type='text' className='form-control' id="username" placeholder="Username" {...register('username', { required: true, minLength: 4 })} />
            {errors.username?.type === 'required' && <p className="lead text-danger">Username is required</p>}
            {errors.username?.type === 'minLength' && <p className="lead text-danger">Minimum length of 4</p>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor='email' className='form-label text-danger'>Email</label>
            <input type='email' className='form-control' id="email" placeholder="Email" {...register('email', { required: true })} />
            {errors.email?.type === 'required' && <p className="lead text-danger">Email is required</p>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor='password' className='form-label text-danger'>Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" {...register('password', { required: true })} />
            {errors.password?.type === 'required' && <p className="lead text-danger">Password is required</p>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor='phonenumber' className='form-label text-danger'>Phone Number</label>
            <input type="number" className="form-control" id="phonenumber" placeholder="Phone Number" {...register('phonenumber', { required: true, minLength: 10, maxLength: 10 })} />
            {errors.phonenumber?.type === 'required' && <p className="lead text-danger">Phone number is required</p>}
            {errors.phonenumber?.type === 'minLength' && <p className="lead text-danger">Phone number must contain 10 digits</p>}
            {errors.phonenumber?.type === 'maxLength' && <p className="lead text-danger">Phone number must contain 10 digits</p>}
          </div>

          <button type="submit" className="btn btn-primarybtn btn-outline-success mb-3">Sign Up</button>
        </form>
        <p>Already registered? <Link to='/signin'>Sign In</Link></p>
      </div>
    </div>
  );
}

export default Signup;
