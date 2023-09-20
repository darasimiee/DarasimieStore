import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_URL, instance } from "./connect";
import axios from "axios";

export const getCategories = async () => {
  const res = await instance.get("/api/v1/categories");
  return res;
};

export const getFeaturedProducts = async () => {
  const res = await instance.get("/api/v1/products/featured/product");
  return res;
};

export const getProductsByCondition = async () => {
  const res = await instance.get("/api/v1/products/condition");
  return res;
};

export const getPreOrderProducts = async () => {
  const res = await instance.get("/api/v1/products/condition/preorder");
  return res;
};

export const getProductByCategory = async (categoryName) => {
  const res = await instance.get(`/api/v1/products/${categoryName}`);
  return res;
};
export const getAllProducts = async () => {
  const res = await instance.get("/api/v1/products/allproducts");
  return res;
};

export const getOneProduct = async (slugTitle) => {
  const res = await instance.get(`/api/v1/products/title/${slugTitle}`);
  return res;
};

export const likeProduct = async (productId, userId, token) => {
  const res = await instance.put(
    `/api/v1/products/${productId}/likes`,
    userId,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res;
};

export const dislikeProduct = async (productId, userId, token) => {
  const res = await instance.put(
    `/api/v1/products/${productId}/dislikes`,
    userId,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res;
};

export const getSavedProducts = async (username, token) => {
  const res = await instance.get(`/api/v1/products/usersaved/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const deleteProduct = async(productId, token) =>
{
  const res = await instance.delete(`/api/v1/products/delete/${productId}`, {
    headers: {Authorization: `Bearer ${token}`}
  })
  return res
}

export const createNewProduct = async(product, token) =>
{
  const res = await instance.post(`/api/v1/products/create/`, product,  {
    headers: {Authorization: `Bearer ${token}`},
  })
  return res
}

export const searchProduct = async(searchQuery) =>
{
  const res = await instance.get(`api/v1/products/search/product?q=${searchQuery}`)
  return res
}

//Authentication
export const registerUser = async (username, email, password) => {
  const res = await instance.post("/api/v1/auth/register", {
    username,
    email,
    password,
  });
  return res;
};

export const loginUser = async (username, password) => {
  const res = await instance.post("/api/v1/auth/login", { username, password });
  return res;
};

export const getUserProfile = async (username, token) => {
  const res = await instance.get(`/api/v1/auth/user-profile/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const updateUserProfile = async (profile, token) => {
  const res = await instance.put(`/api/v1/auth/update-profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

//orders

export const createOrder = async (order, token) => {
  const res = await instance.post("/api/v1/orders/createorder", order, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
export const getUserOrders = async (token) => {
  const res = await instance.get("/api/v1/orders/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
export const getAllOrders = async (token) => {
  const res = await instance.get("/api/v1/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};
export const getOrderDetail = async (orderId, token) => {
  const res = await instance.get(`/api/v1/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const trackOrders = async (id, status, token) => {
  const res = await instance.put(`/api/v1/orders/${id}/tracking`, status, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const data = await axios.post(CLOUDINARY_URL, formData);
  return data;
};
