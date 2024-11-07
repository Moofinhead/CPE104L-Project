"use client";

import RoveroLayout from "@/layouts/RoveroLayout";
import Breadcrumb from "@/components/Breadcrumb";
import RegisterForm from "@/components/register/registerForm";
import GetBgImage from "@/components/GetBgImage";


const RegisterPage = () => {
  const bgImage = GetBgImage("/images/bg/booking-hero.jpg");

  return (
    <RoveroLayout>
      <Breadcrumb 
        pageName="Register" 
        bgImage={bgImage}
        pageTitle="Register" 
      /> {/* breadcrumb */}
      <div className="register-page-area mt-120 mb-120"> 
        <div className="container"> 
          <div className="row justify-content-center"> 
            <div className="col-xl-6 col-lg-8 col-md-10">
              <RegisterForm /> {/* register form */}
            </div> {/* end column */}
          </div> {/* end row */}
        </div> {/* end container */}
      </div> {/* end page area */}
    </RoveroLayout>
  );
};

export default RegisterPage;
