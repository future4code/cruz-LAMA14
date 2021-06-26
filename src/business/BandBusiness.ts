import { BandDatabase } from "../data/BandDatabase";
import { BaseError } from "../error/BaseError";
import { Band, BandInputDTO } from "../model/Band";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {

    constructor(
        private bandDatabase: BandDatabase, 
        private idGenerator: IdGenerator, 
        private authenticator: Authenticator 
        ){}

    async createBand(band: BandInputDTO, token: string) {
        
        const accessToken = this.authenticator.getData(token);
        
        if(accessToken.role !== UserRole.ADMIN ) {
            throw new BaseError("Only Admin users can create bands", 403);
        };

        if(!band.name || !band.music_genre || !band.responsible ) {
            throw new BaseError("You must inform 'name', 'music_genre', and 'responsible'", 406);
        }
        
        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const bandDatabase = new BandDatabase();
        await this.bandDatabase.createBand(
            id, 
            band.name, 
            band.music_genre, 
            band.responsible
            )
    };

    async getBandByIdOrName(band: string): Promise<Band>{

        if(!band) {
            throw new BaseError("Invalid input, try again", 400)
        }

        return this.bandDatabase.getBandByIdOrName(band);

    };
};