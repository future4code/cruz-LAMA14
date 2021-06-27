import { UserRole } from "../../src/model/User";

export class TokenGeneratorMock {
  public generate = (input: AuthenticationData): string => {
    return "token_mock"
  };

  public verify(token: string) {
    return {
      id: "id_mock",
      role: UserRole.NORMAL
    }
  }
}

export interface AuthenticationData {
  id: string;
  role: string;
}

export default new TokenGeneratorMock()
