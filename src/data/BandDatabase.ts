import { BaseError } from "../error/BaseError";
import { Band } from "../model/Band";
import { BaseDatabase } from "./BaseDatabase";


export class BandDatabase extends BaseDatabase {

    public static TABLE_NAME = "Bands";

    public async createBand(
        id: string,
        name: string,
        music_genre: string,
        responsible: string
    ): Promise<void> {
        try {

            await this.getConnection()
                .insert({
                    id,
                    name,
                    music_genre,
                    responsible
                })
                .into(BandDatabase.TABLE_NAME);
            
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)  
        }
    };

    public async getBandByIdOrName(
        band: string
    ): Promise<Band>{
        const [bandResult] = await this.getConnection()
            .select("*")
            .from(BandDatabase.TABLE_NAME)
            .where({id: band})
            .orWhere({name: band});

        if(!bandResult) {
            throw new BaseError('Band not found. Please check info provided', 404)
        }

        return Band.toBandModel(bandResult)!;
    };
};