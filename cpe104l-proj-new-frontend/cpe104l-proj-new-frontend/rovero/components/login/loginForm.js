import Link from "next/link";

const LoginForm = ({ email, password, setEmail, setPassword, error, onSubmit }) => (
    <form className="login-form" onSubmit={onSubmit}> 
      <h2 className="mb-30">Login to Your Account</h2> 
      {error && <div className="alert alert-danger">{error}</div>} 
      <InputField 
        type="email" 
        placeholder="Email Address" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      /> {/* email input */}
      <InputField 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      /> {/* password input */}
      <div className="form-group mb-20">
        <button type="submit" className="btn theme-bg w-100"> 
          Login
        </button> {/* button */}
      </div> {/* button container */}
      <p className="text-center"> 
        Don't have an account? <Link href="/login/register">Register</Link> {/* registration link */}
      </p> 
    </form> // form
  );
  
  const InputField = ({ type, placeholder, value, onChange, required }) => (
    <div className="form-group mb-20"> 
      <input
        type={type} 
        className="form-control" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        required={required} 
      />
    </div> // input container
  );

export default LoginForm;