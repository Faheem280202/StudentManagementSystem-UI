const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://localhost:7112/api";

class ApiService {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getToken() {
    return localStorage.getItem("sms_token");
  }

  async request(method, path, body = null) {
    const token = this.getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${this.baseUrl}${path}`,
      config
    );

    // Redirect only if an authenticated user gets 401
    if (response.status === 401 && token) {
      localStorage.removeItem("sms_token");
      localStorage.removeItem("sms_user");

      window.location.href = "/login";
      return;
    }

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data?.message ??
            data?.title ??
            `Request failed: ${response.status}`
      );
    }

    return data;
  }

  get(path) {
    return this.request("GET", path);
  }

  post(path, body) {
    return this.request("POST", path, body);
  }

  put(path, body) {
    return this.request("PUT", path, body);
  }

  patch(path, body) {
    return this.request("PATCH", path, body);
  }

  delete(path) {
    return this.request("DELETE", path);
  }
}

export const api = new ApiService();

// ===========================
// Auth
// ===========================
export const authService = {
  login: (credentials) =>
    api.post("/auth/login", credentials),
};

// ===========================
// Users
// ===========================
export const userService = {
  getDashboard: () =>
    api.get("/users/dashboard"),

  getUsers: () =>
    api.get("/users"),

  getUser: (id) =>
    api.get(`/users/${id}`),

  createUser: (user) =>
    api.post("/users", user),

  createStudent: (data) =>
    api.post("/users/student", data),

  updateUser: (id, user) =>
    api.put(`/users/${id}`, user),

  deleteUser: (id) =>
    api.delete(`/users/${id}`),

  getTeachers: () =>
    api.get("/users/teachers"),

  getStudentsByClass: (classId) =>
    api.get(`/users/students/class/${classId}`),
};

// ===========================
// Classes
// ===========================
export const classService = {
  getClasses: () =>
    api.get("/classes"),
};