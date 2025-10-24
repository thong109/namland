import Cookies from 'js-cookie';
export const setAuthCookie = (token) => {
  Cookies.set('authToken', JSON.stringify(token), { expires: 1 }); // Expires in 3 hours (1/8 of a day)
};

// Get the authentication token from the cookie
export const getAuthCookie = () => {
  const tokenString = Cookies.get('authToken');

  try {
    return tokenString ? JSON.parse(tokenString) : null;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

// Remove the authentication cookie
export const removeAuthCookie = () => {
  Cookies.remove('authToken');
};
