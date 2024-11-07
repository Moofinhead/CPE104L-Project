export const updateUserInfo = async (email, info) => {
    const response = await fetch(`http://localhost:8080/user/update?email=${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info),
    });
    if (!response.ok) throw new Error('Failed to update user info');
  };