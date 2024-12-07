export const publicRoutes = [
  "/",
  "/search",
  "/product/",
  "/contact",
  "/blog",
  "/blog/",
];

export const authRoutes = [
  "/register",
  "/signIn",
  "/verify",
  "/forgot-password",
];

// admin routes
export const adminRoutes = [
  // "/admin",
  // "/admin/product",
  // "/admin/product/add",
  // "/admin/product/edit/",
  // "/admin/employee",
  // "/admin/employee/add",
  // "/admin/employee/edit/",
  // "/admin/order",
  // "/admin/order/",
  // "/admin/import",
  // "/admin/import/add",
  // "/admin/order/return",
  // "/admin/order/delivery",
  // "/admin/order/rating",
  "/admin",
  "/admin/blog",
  "/admin/blog/handle",
  "/admin/blog/handle/",
  "/admin/employee",
  "/admin/employee/handle",
  "/admin/employee/handle/",
  "/admin/import",
  "/admin/import/add",
  "/admin/import/edit/",
  "/admin/role",
  "/admin/report",
  "/admin/product",
  "/admin/product/add",
  "/admin/product/edit/",
  "/admin/product/category",
  "/admin/order",
  "/admin/order/", //
  "/admin/order/rating",
  "/admin/order/delivery",
  "/admin/order/return",
  "/admin/order/return/",
];

export const apiAuthPrefix = [
  "/api/auth",
  "/api/auth/signout",
  "/api/auth/csrf",
  "/api/auth/callback/google",
  "/api/auth/callback/github",
  "/api/send-email",
  "/api/product/remove",
  "/api/auth/imagekit",
];

export const DEFAULT_LOGIN_REDIRECT = "/";
