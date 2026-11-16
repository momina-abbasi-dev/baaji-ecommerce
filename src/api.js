// Base URL from Vercel environment variable
export const API_URL = import.meta.env.VITE_API_URL;

// ✅ Helper: check response and show backend message if available
async function checkResponse(res, defaultErrorMsg) {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(defaultErrorMsg || "Request failed with no response body");
  }

  if (!res.ok) {
    // Show backend message if available
    throw new Error(data.message || defaultErrorMsg || "Request failed");
  }

  return data;
}

// ==========================
// Authentication
// ==========================

// Signup user
export const signupUser = async (userData) => {
  const res = await fetch(`${API_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return checkResponse(res, "Failed to signup user");
};

// Login user
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return checkResponse(res, "Failed to login user");
};

// ==========================
// Profile
// ==========================

export const getUserProfile = async (token) => {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to fetch user profile");
};

export const updateUserProfile = async (userData, token) => {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(userData),
  });
  return checkResponse(res, "Failed to update profile");
};

// ==========================
// Products API
// ==========================

export const getProducts = async (categoryName) => {
  const url = categoryName
    ? `${API_URL}/api/products?category=${encodeURIComponent(categoryName)}`
    : `${API_URL}/api/products`;

  const res = await fetch(url);
  return checkResponse(res, "Failed to fetch products");
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/api/products/${id}`);
  return checkResponse(res, "Failed to fetch product");
};

export const getProductsByCategory = async (category) => {
  let url = `${API_URL}/api/products`;
  if (category) url += `?category=${encodeURIComponent(category.replace(/-/g, " "))}`;
  const res = await fetch(url);
  return checkResponse(res, "Failed to fetch products by category");
};

export const getProductsBySearch = async (query) => {
  const res = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  return checkResponse(res, "Failed to search products");
};

export const getTrendingProducts = async () => {
  const res = await fetch(`${API_URL}/api/products/trending`);
  return checkResponse(res, "Failed to fetch trending products");
};

// ==========================
// Admin CRUD (Create / Update / Delete)
// ==========================

// ✅ Create new product
export const createProduct = async (formData, token) => {
  const res = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ⚠️ do NOT set 'Content-Type' manually for FormData
    },
    body: formData,
  });

  return checkResponse(res, "Failed to create product");
};

// ✅ Update existing product
export const updateProduct = async (id, formData, token) => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // ⚠️ same here, do not set 'Content-Type'
    },
    body: formData,
  });

  return checkResponse(res, "Failed to update product");
};

// ✅ Delete product
export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to delete product");
};

// ==========================
// Cart
// ==========================

export const addToCart = async (cartItem, token) => {
  const res = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(cartItem),
  });
  return checkResponse(res, "Failed to add item to cart");
};

export const getCart = async (token) => {
  const res = await fetch(`${API_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to fetch cart");
};

// ==========================
// Orders
// ==========================

export const createOrder = async (orderData, token) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });
  return checkResponse(res, "Failed to create order");
};

export const getOrders = async (token) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to fetch orders");
};

export const getMyOrders = async (token) => {
  const res = await fetch(`${API_URL}/api/orders/myorders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to fetch my orders");
};

// ==========================
// Categories
// ==========================
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/api/categories`);
  return checkResponse(res, "Failed to fetch categories");
};

// ==========================
// Banners (Admin)
// ==========================
export const getBanners = async () => {
  const res = await fetch(`${API_URL}/api/banners`);
  return checkResponse(res, "Failed to fetch banners");
};

export const saveBanners = async (images, token) => {
  const res = await fetch(`${API_URL}/api/banners`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ images }),
  });
  return checkResponse(res, "Failed to save banners");
};

// ==========================
// Videos (Admin)
// ==========================
export const getVideos = async () => {
  const res = await fetch(`${API_URL}/api/videos`);
  return checkResponse(res, "Failed to fetch videos");
};

export const saveVideo = async (videoUrl, token) => {
  const res = await fetch(`${API_URL}/api/videos`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ videoUrl }),
  });
  return checkResponse(res, "Failed to save video");
};

// ==========================
// Events (Admin)
// ==========================
export const getEvents = async () => {
  const res = await fetch(`${API_URL}/api/events`);
  return checkResponse(res, "Failed to fetch events");
};

export const createEvent = async (formData, token) => {
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // ⚠️ do not set Content-Type
    body: formData,
  });
  return checkResponse(res, "Failed to create event");
};

export const deleteEvent = async (id, token) => {
  const res = await fetch(`${API_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return checkResponse(res, "Failed to delete event");
};