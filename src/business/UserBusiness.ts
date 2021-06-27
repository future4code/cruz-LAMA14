import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";

export class UserBusiness {

    async createUser(user: UserInputDTO) {

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const hashManager = new HashManager();
        const hashPassword = await hashManager.hash(user.password);

        const userDatabase = new UserDatabase();
        await userDatabase.createUser(id, user.email, user.name, hashPassword, user.role);

        const authenticator = new Authenticator();
        const accessToken = authenticator.generateToken({ id, role: user.role });

        return accessToken;
    }

   async login(email: string, password: string) {

    try {
       if (!email || !password) {
          throw new BaseError("Missing input", 422);
       }

       const userDatabase = new UserDatabase();
       const user = await userDatabase.getUserByEmail(email);

       if (!user) {
          throw new BaseError("Invalid credentials", 401);
       }

       const hashManager = new HashManager();
       const isPasswordCorrect = await hashManager.compare(
          password,
          user.getPassword()
       );

       if (!isPasswordCorrect) {
          throw new BaseError("Invalid credentials", 401);
       }

       const authenticator = new Authenticator();
       const accessToken = authenticator.generateToken({
          id: user.getId(),
          role: user.getRole(),
       });

       return { accessToken };
    } catch (error) {
       throw new BaseError(error.statusCode, error.message)
    }
 }

    async getUserByEmail(user: LoginInputDTO) {

        const userDatabase = new UserDatabase();
        const userFromDB = await userDatabase.getUserByEmail(user.email);

        const hashManager = new HashManager();
        const hashCompare = await hashManager.compare(user.password, userFromDB.getPassword());

        const authenticator = new Authenticator();
        const accessToken = authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });

        if (!hashCompare) {
            throw new Error("Invalid Password!");
        }

        return accessToken;
    }
}