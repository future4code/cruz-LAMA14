import { Request, Response } from "express";
import { BandBusiness } from "../business/BandBusiness";
import { BandDatabase } from "../data/BandDatabase";
import { BaseDatabase } from "../data/BaseDatabase";
import { BandInputDTO } from "../model/Band";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class BandController {

    async createBand(req: Request, res: Response) {

        try {

            const input: BandInputDTO = {
                name: req.body.name,
                music_genre: req.body.music_genre,
                responsible: req.body.responsible
            };

            const bandBusiness = new BandBusiness(
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            );

           await bandBusiness.createBand(input, req.headers.authorization as string);

            res.status(200);

        } catch (error) {
            res.status(400).send({ error: error.message });            
        }

        await BaseDatabase.destroyConnection();

    };

    async getBandByDetail(req: Request, res: Response) {
        try {

            const band = (req.query.id ?? req.query.name) as string;

            const bandBusiness = new BandBusiness(
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            );
            
            const bandResult = await bandBusiness.getBandByIdOrName(band);

            res.status(200).send(bandResult);

        } catch (error) {
            res.status(400).send({ error: error.message });   
        }

        await BaseDatabase.destroyConnection();
    };

};