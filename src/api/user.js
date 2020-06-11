import http from "../utils/request";
import bcrypt from "bcryptjs";

export function code(data) {
  return http({
    url: "/user/code",
    method: "post",
    data
  });
}

export function register(data) {
  return http({
    url: "/user/register",
    method: "post",
    data: {
      email: data.email,
      password: bcrypt.hashSync(data.password, 10),
      code: data.code
    }
  });
}
