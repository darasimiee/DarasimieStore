const registerOptions = {
  email: {
    required: "Email is required",
    validate: {
      maxLength: (v) =>
        v.length <= 50 || "The email should have at most 30 characters",
      matchPattern: (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "Invalid email address",
    },
  },
  password: {
    required: "Password Required!",
    validate: {
      minLength: (v) =>
        v.length >= 6 || "Password should not be less than 6 characters",
      matchPattern: (v) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v) ||
        "Password must have special character, number and uppercase",
    },
  },

  username: {
    required: "Username is required",
    validate: {
      minLength: (v) =>
        v.length >= 5 || "Username should have at least 5 characters",
      matchPattern: (v) =>
        /^[a-zA-Z0-9_]+$/.test(v) ||
        "Username must contain only letters, numbers and _",
    },
  },

  fullname: { required: "Fullname is required" },

  shippingAddress: { required: "ShippingAddress is required" },

  phone: { required: "Phone number is required" },

  state: { required: "State is required" },
};

export default registerOptions;
