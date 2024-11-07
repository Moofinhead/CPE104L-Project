const handleSubmit = async (e, formData, setError, router) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });
  
      const responseText = await response.text();
  
      if (response.status === 201) {
        // registration successful
        console.log("Registration successful:", responseText);
        router.push("/login"); // redirect to login page
      } else if (response.status === 400) {
        // handle common error messages
        setError(
          responseText === "Passwords do not match"
            ? "Passwords do not match"
            : responseText === "User already exists"
            ? "Username or email already exists"
            : "Registration failed: " + responseText
        );
      } else {
        // unexpected status code
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again.");
    }
  };
  
  export default handleSubmit;
  