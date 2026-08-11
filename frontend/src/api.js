export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function encodeBasicCredentials(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

async function request(
  path,
  { method = "GET", body, authCredentials } = {},
) {
  const headers = {
    Accept: "application/json, text/plain",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (authCredentials) {
    headers.Authorization = `Basic ${encodeBasicCredentials(
      authCredentials.username,
      authCredentials.password,
    )}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Make sure the Spring Boot API is running on port 8080.",
      0,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const rawBody = response.status === 204 ? null : await response.text();
  let responseBody = rawBody;

  // Only JSON-parse when the body is actually valid JSON; otherwise keep it as text.
  // (Login returns plain text "Login successful", so a strict json() parse would throw.)
  if (rawBody && contentType.includes("application/json")) {
    try {
      responseBody = JSON.parse(rawBody);
    } catch {
      responseBody = rawBody;
    }
  }

  if (!response.ok) {
    const message =
      (typeof responseBody === "object" &&
        (responseBody?.message || responseBody?.error)) ||
      (typeof responseBody === "string" && responseBody) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody;
}

export const authApi = {
  register(credentials) {
    return request("/register", {
      method: "POST",
      body: credentials,
    });
  },

  async login(credentials) {
    const result = await request("/login", {
      method: "POST",
      body: credentials,
    });

    if (result !== "Login successful") {
      throw new ApiError("Invalid username or password.", 401, result);
    }

    return result;
  },
};

export const opportunityApi = {
  list(authCredentials) {
    return request("/opportunities", { authCredentials });
  },

  create(opportunity, authCredentials) {
    return request("/opportunities", {
      method: "POST",
      body: opportunity,
      authCredentials,
    });
  },

  update(id, opportunity, authCredentials) {
    return request(`/opportunities/${id}`, {
      method: "PUT",
      body: opportunity,
      authCredentials,
    });
  },

  remove(id, authCredentials) {
    return request(`/opportunities/${id}`, {
      method: "DELETE",
      authCredentials,
    });
  },
};
