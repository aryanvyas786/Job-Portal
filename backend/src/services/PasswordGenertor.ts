const generatePassword = (): string => {
    return Math.random().toString(36).slice(-8); // Generates a random password of length 8
  };
  
  export default generatePassword;