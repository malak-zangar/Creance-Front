export const setaccess_token = (access_token) => {
    localStorage.setItem('access_token', access_token);
  };
  
  export const getaccess_token = () => {
    return localStorage.getItem('access_token');
  };
  
  export const removeaccess_token = () => {
    localStorage.removeItem('access_token');
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };
  