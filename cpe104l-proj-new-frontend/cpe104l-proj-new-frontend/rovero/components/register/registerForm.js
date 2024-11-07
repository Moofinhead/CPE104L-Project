"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import handleSubmit from "@/components/register/handleSubmit";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }); // form data state
  const [error, setError] = useState(""); // error state
  const router = useRouter(); // router instance

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; // handle input change

  const onSubmit = (e) => {
    handleSubmit(e, formData, setError, router);
  }; // handle form submit

  return (
    <form className="register-form" onSubmit={onSubmit}> 
      <h2 className="mb-30">Create Your Account</h2> 
      {error && <div className="alert alert-danger">{error}</div>} {/* error message */}
      <FormInput
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      /> {/* username input */}
      <FormInput
        type="email"
        placeholder="Email Address"
        name="email"
        value={formData.email}
        onChange={handleChange}
      /> {/* email input */}
      <FormInput
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      /> {/* password input */}
      <FormInput
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      /> {/* confirm password input */}
      <div className="form-group mb-20">
        <button type="submit" className="btn theme-bg w-100">Register</button> {/* submit button */}
      </div> {/* end form group */}
      <p className="text-center">
        Already have an account? <Link href="/login">Login</Link> {/* login link */}
      </p> {/* end text center */}
    </form> 
  );
};

const FormInput = ({ type, placeholder, name, value, onChange, required = true }) => (
  <div className="form-group mb-20">
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    /> {/* input field */}
  </div>
);

export default RegisterForm;
