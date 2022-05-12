import Cookies from "js-cookie";

const TokenKey = "Admin-Tokenvideoadmin";
const Permission = "Permission";
const ISadmin = "ISadmin";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function setPermission(num) {
  return Cookies.set(Permission, num);
}
export function getPermission() {
  return Cookies.get(Permission);
}
export function removePermission() {
  return Cookies.remove(Permission);
}

export function setISadmin(num) {
  return Cookies.set(ISadmin, num);
}
export function getISadmin() {
  return Cookies.get(ISadmin);
}
export function removeISadmin() {
  return Cookies.remove(ISadmin);
}
