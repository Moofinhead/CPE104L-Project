"use client";
import RoveroLayout from "@/layouts/RoveroLayout"; 
import Breadcrumb from "@/components/Breadcrumb"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { useAuth } from '@/contexts/AuthContext'; 
import { handleSubmit } from "@/components/login/handleSubmit"; 
import LoginForm from "@/components/login/loginForm";
import GetBgImage from "@/components/GetBgImage";

const LoginPage = () => {
  const [email, setEmail] = useState(""); // state of inputs
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  
  const router = useRouter(); // router instance, auth context, and bg img
  const { login } = useAuth(); 
  const bgImage = GetBgImage("/images/bg/booking-hero.jpg");

  const onSubmit = (e) => {
    handleSubmit(e, email, password, setError, login, router);
  }; // form submission

  return (
    <RoveroLayout>
      <Breadcrumb
        pageName="Login" 
        bgImage={bgImage}
        pageTitle="Login" 
        pageSubTitle="Enter Your FHC Account and Start Booking" 
      /> {/* breadcumbs */}
      <div className="login-page-area mt-120 mb-120">
        <div className="container"> 
          <div className="row justify-content-center"> 
            <div className="col-xl-6 col-lg-8 col-md-10">
              <LoginForm 
                email={email} 
                password={password} 
                setEmail={setEmail} 
                setPassword={setPassword} 
                error={error} 
                onSubmit={onSubmit} 
              /> {/* login form */}
            </div> {/* column */}
          </div> {/* row */}
        </div> {/* container */}
      </div> {/* login area */}
    </RoveroLayout>
  );
};

export default LoginPage;