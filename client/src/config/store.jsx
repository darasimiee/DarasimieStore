import jwt_decode from "jwt-decode"
import {
  AiOutlineUnorderedList,
  AiOutlineUser,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BsBriefcaseFill } from "react-icons/bs";
import { FiSettings, FiServer } from "react-icons/fi";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const context = createContext();

let initialUser = "";
let initialCart = [];
let shippingData = {}
let paymentData = ''



export const StateContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [cartItems, setCartItems] = useState(initialCart);
  const [show, setShow] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(paymentData)
  const [shippingDetails, setShippingDetails] = useState(shippingData)

useEffect(() => {
  const checkJwtExpiry = async()=>
  {
    const token = JSON.parse(localStorage.getItem('userinfo'))
    if(token)
    {
      const {exp} = jwt_decode(token.access_token)
      if(exp * 1000 < Date.now()){
        localStorage.removeItem('userinfo')
        location.replace('/')
        toast.error('Token expired, please sign in to get access')
      }
    }
  }
  checkJwtExpiry()
})

// save payment method
useEffect(() => {
  if (paymentMethod !== paymentData) {
    localStorage.setItem("paymentType", JSON.stringify(paymentMethod));
  }
}, [paymentMethod]);

//get paymentMethod
useEffect(() => {
  const getPaymentMethod = JSON.parse(localStorage.getItem("paymentType"));
  if (getPaymentMethod) {
    setPaymentMethod(getPaymentMethod);
  }
}, []);

//save shipping details
useEffect(() => {
  if (shippingDetails !== shippingData) {
    localStorage.setItem("shippingInfo", JSON.stringify(shippingDetails));
  }
}, [shippingDetails]);

//get shippingdetails
useEffect(() => {
  const shipData = JSON.parse(localStorage.getItem("shippingInfo"));
  if (shipData) {
    setShippingDetails(shipData);
  }
}, []);


  //save user to local storage
  useEffect(() => {
    if (currentUser !== initialUser) {
      localStorage.setItem("userinfo", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  //retrieve user from local storage
  useEffect(() => {
    const retrieveUser = JSON.parse(localStorage.getItem("userinfo"));
    if (retrieveUser) {
      setCurrentUser(retrieveUser);
    }
  }, []);

  //retrieve cart from local storage
  useEffect(() => {
    const retrieveCart = JSON.parse(localStorage.getItem("shoppingbag"));
    if (retrieveCart) {
      setCartItems(retrieveCart);
    }
  }, []);
   //save cart to local storage
   useEffect(() => {
    if (cartItems !== initialCart) {
      localStorage.setItem("shoppingbag", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  //Add to cart/ increment
  const increaseCartQty = (id) => {
    setCartItems((currentItem) => {
      if (currentItem.find((item) => item._id === id._id) == null) {
        return [...currentItem, { ...id, quantity: 1 }];
      } else {
        return currentItem.map((item) => {
          if (item._id === id._id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };
  const decreaseCartQty = (id) => {
    setCartItems((currentItem) => {
      if (currentItem.find((item) => item._id === id._id).quantity === 1) {
        return currentItem.filter((item) => item._id !== id._id);
      } else {
        return currentItem.map((item) => {
          if (item._id === id._id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const deleteCartItems = (id) => {
    setCartItems((currentItem) => {
      return currentItem.filter((item) => item._id !== id);
    });
  };

  const cartQuantity = cartItems?.reduce((quantity, item) => item.quantity + quantity,
    0
  );

  const priceTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  //At default let the counter start from zero hence the reason for 0 in the declaration

  const logOut = () => {
    localStorage.removeItem("userinfo");
    location.replace("/");
    toast.success("Logged out successfully.");
  };

  const links = [
    {
      name: "Orders",
      path: `${currentUser?.user?.username}/orders`,
      icon: <AiOutlineUnorderedList />,
    },

    {
      name: "Profile",
      path: `user-profile/${currentUser?.user?.username}`,
      icon: <AiOutlineUser />,
    },

    {
      name: "Saved Items",
      path: `${currentUser?.user?.username}/saveditems`,
      icon: <AiOutlineShoppingCart />,
    },
  ];

  const adminLinks = [
    {
      name: "Shop orders",
      path: "allorders",
      icon: <BsBriefcaseFill />,
    },

    {
      name: "Manage Product",
      path: "manage-product",
      icon: <FiSettings />,
    },

    {
      name: "Add-product",
      path: "add-new-product",
      icon: <FiServer />,
    },
  ];

  return (
    <context.Provider
      value={{
        currentUser,
        setCurrentUser,
        logOut,
        increaseCartQty,
        decreaseCartQty,
        deleteCartItems,
        cartQuantity,
        priceTotal,
        show,
        setShow,
        cartItems,
        shippingDetails,
        setShippingDetails,
        paymentMethod,
        setPaymentMethod,
        setCartItems,
        links,
        adminLinks
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useStore = () => useContext(context);
