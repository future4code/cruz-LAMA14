import { User, UserRole } from "../../src/model/User";

export const userMockAdmin = new User(
  "id_mock_admin",
  "astrodev",
  "astrodev@gmail.com",
  "astrodev123",
  UserRole.ADMIN
  // USER_ROLES.ADMIN
)

export const userMockNormal = new User(
  "id_mock_normal",
  "bananinha",
  "bananinha@gmail.com",
  "bananinha123",
  UserRole.NORMAL,
  // USER_ROLES.NORMAL
)
