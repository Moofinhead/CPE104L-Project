export const prefillUserInfo = async (user, currentUserInfo, updateUserInfo) => {
  try {
    const response = await fetch(`http://localhost:8080/user/info?email=${user.email}`);
    if (!response.ok) throw new Error('Failed to fetch user info');
    
    const userData = await response.json();
    
    // Update all fields with user data
    const fieldsToUpdate = [
      'firstName',
      'lastName',
      'email',
      'phoneNo',
      'address',
      'city',
      'country',
      'zipCode'
    ];

    fieldsToUpdate.forEach(field => {
      // Update with user data or empty string if field doesn't exist
      updateUserInfo(field, userData[field] || '');
    });

  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};