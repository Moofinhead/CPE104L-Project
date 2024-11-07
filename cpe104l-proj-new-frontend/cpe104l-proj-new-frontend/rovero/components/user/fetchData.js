export const fetchUserInfo = async (email, setUserInfo, setEditedInfo) => {
    try {
      const response = await fetchUserData(email);
      setUserInfo(response);
      setEditedInfo(response); // Initialize with fetched data
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

const fetchUserData = async (email) => {
    const response = await fetch(`http://localhost:8080/user/info?email=${email}`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    return await response.json();
  };
  