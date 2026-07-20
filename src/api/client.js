export const BASE_URL = "http://localhost:8080/";

function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)",
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

async function request(method, path, body, headers, withCsrf) {
  const options = {
    method,
    headers: {
      ...(withCsrf ? { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") } : {}),
      ...headers,
    },
    credentials: "include",
  };
  if (body !== undefined) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (res.ok) {
    return data;
  }
  throw { message: data?.message, status: res.status };
}

export function get(path, headers = {}) {
  return request("GET", path, undefined, headers, false);
}

export function post(path, body, headers) {
  return request("POST", path, body, headers, true);
}

export function patch(path, body, headers) {
  return request("PATCH", path, body, headers, true);
}

export function put(path, body, headers) {
  return request("PUT", path, body, headers, true);
}

export function del(path, headers) {
  return request("DELETE", path, undefined, headers, true);
}
