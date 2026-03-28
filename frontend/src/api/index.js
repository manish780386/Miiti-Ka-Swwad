import axios from "axios";

const BASE = import.meta.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: BASE, headers: { "Content-Type": "application/json" } });

/* ── Attach JWT ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ── Auto-refresh on 401 ── */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE}/auth/token/refresh/`, { refresh });
          localStorage.setItem("access_token", data.access);
          orig.headers.Authorization = `Bearer ${data.access}`;
          return api(orig);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

/* ── Auth ── */
export const authAPI = {
  register:      (d)     => api.post("/auth/register/", d),
  login:         (d)     => api.post("/auth/login/", d),
  getProfile:    ()      => api.get("/auth/profile/"),
  updateProfile: (d)     => api.patch("/auth/profile/", d, { headers: { "Content-Type": "multipart/form-data" } }),
  getAddresses:  ()      => api.get("/auth/addresses/"),
  addAddress:    (d)     => api.post("/auth/addresses/", d),
  updateAddress: (id, d) => api.patch(`/auth/addresses/${id}/`, d),
  deleteAddress: (id)    => api.delete(`/auth/addresses/${id}/`),
};

/* ── Foods ── */
export const foodsAPI = {
  list:       (params) => api.get("/foods/", { params }),
  detail:     (slug)   => api.get(`/foods/${slug}/`),
  featured:   ()       => api.get("/foods/featured/"),
  categories: ()       => api.get("/foods/categories/"),
  byRegion:   (r)      => api.get(`/foods/region/${r}/`),
  byFestival: (f)      => api.get(`/foods/festival/${f}/`),
};

/* ── Cart & Orders ── */
export const cartAPI = {
  get:       ()             => api.get("/orders/cart/"),
  addItem:   (id, qty = 1)  => api.post("/orders/cart/items/", { food_item_id: id, quantity: qty }),
  updateItem:(id, qty)      => api.patch(`/orders/cart/items/${id}/`, { quantity: qty }),
  removeItem:(id)           => api.delete(`/orders/cart/items/${id}/`),
  checkout:  (d)            => api.post("/orders/checkout/", d),
};

export const ordersAPI = {
  list:   ()   => api.get("/orders/"),
  detail: (id) => api.get(`/orders/${id}/`),
};

/* ── Payments ── */
export const paymentsAPI = {
  createOrder: (order_id) => api.post("/payments/create/", { order_id }),
  verify:      (d)        => api.post("/payments/verify/", d),
};

/* ── Reviews ── */
export const reviewsAPI = {
  list:   (slug) => api.get(`/reviews/${slug}/`),
  create: (slug, d) => api.post(`/reviews/${slug}/`, d),
};

/* ── Stories ── */
export const storiesAPI = {
  list:   (params) => api.get("/stories/", { params }),
  detail: (slug)   => api.get(`/stories/${slug}/`),
  create: (d)      => api.post("/stories/create/", d),
};

/* ── Vendor ── */
export const vendorAPI = {
  getProfile:        ()        => api.get("/vendors/profile/"),
  updateProfile:     (d)       => api.patch("/vendors/profile/", d),
  getFoods:          ()        => api.get("/vendors/foods/"),
  addFood:           (d)       => api.post("/vendors/foods/add/", d, { headers: { "Content-Type": "multipart/form-data" } }),
  getFood:           (pk)      => api.get(`/vendors/foods/${pk}/`),
  editFood:          (pk, d, hasFiles=false) => hasFiles
    ? api.patch(`/vendors/foods/${pk}/`, d, { headers: { "Content-Type": "multipart/form-data" } })
    : api.patch(`/vendors/foods/${pk}/`, d),
  deleteFood:        (pk)      => api.delete(`/vendors/foods/${pk}/`),
  toggleFood:        (pk, f)   => api.patch(`/vendors/foods/${pk}/toggle/`, { field: f }),
  getOrders:         ()        => api.get("/vendors/orders/"),
  updateOrderStatus: (id, s)   => api.patch(`/vendors/orders/${id}/status/`, { status: s }),
  getDashboard:      ()        => api.get("/vendors/dashboard/"),
};

export default api;