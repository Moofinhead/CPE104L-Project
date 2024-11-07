export const handleSubmit = async (e, email, password, setError, login, router) => {
    e.preventDefault(); // prevent default form submission and clear previous error
    setError("");
  
    try {
      const response = await fetch("http://localhost:8080/login", { // fetch request with POST method and content type
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ // request body with email and password
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) { // check response and parse JSON
        const data = await response.json();
        console.log("Login successful:", data.message); // log success message, nickname, and admin status
        console.log("Nickname:", data.nickname);
        console.log("Is Admin:", data.is_admin);
  
        login({ // store user data
          email,
          nickname: data.nickname,
          is_admin: data.is_admin,
        });
        
        router.push("/"); // redirect to home or dashboard
      } else {
        const errorText = await response.text(); // get and set error message
        setError(errorText);
      }
    } catch (error) {
      console.error("Login error:", error); // log error and set error message
      setError("An error occurred while logging in. Please try again.");
    }
  };
  