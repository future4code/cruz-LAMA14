import { Request, Response } from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { BandDatabase } from "../data/BandDatabase";
import { BaseDatabase } from "../data/BaseDatabase";
import { ShowDatabase } from "../data/ShowDatabase";
import { Show, ShowInputDTO } from "../model/Show";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowController {

    async createShow(req: Request, res: Response) {
        try {

            const weekDay = Show.toWeekDayEnum(req.body.week_day);

            const input: ShowInputDTO = {
                weekDay,
                band_id: req.body.band_id,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
            }

            const showBusiness = new ShowBusiness(
                new ShowDatabase,
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            );

            await showBusiness.createShow(input, req.headers.authorization as string);

            res.sendStatus(200);            
        } catch (error) {
            res.status(400).send(error.message);
        }

        await BaseDatabase.destroyConnection();
    };

    async getShowByDay(req: Request, res: Response) {
        try {
            const weekDay = Show.toWeekDayEnum(req.query.weekday as string);
            const showBusiness = new ShowBusiness(
                new ShowDatabase,
                new BandDatabase,
                new IdGenerator,
                new Authenticator
            )

            const shows = await showBusiness.getShowByDay(weekDay);

            res.status(200).send({shows})

        } catch (error) {
            res.status(error.sqlMessage || 400).send({message: error.message})
        }
    };

    
}