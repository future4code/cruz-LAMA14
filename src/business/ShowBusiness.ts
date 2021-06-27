import { BandDatabase } from "../data/BandDatabase";
import { ShowDatabase } from "../data/ShowDatabase";
import { BaseError } from "../error/BaseError";
import { Show, ShowInputDTO, WeekDay } from "../model/Show";
import { UserRole } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {

    constructor(
        private showDatabase: ShowDatabase,
        private bandDatabase: BandDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){};

    async createShow(show: ShowInputDTO, token: string) {

        const accessToken = this.authenticator.getData(token);

        if(accessToken.role !== UserRole.ADMIN) {
            throw new BaseError("Only Admin users can create shows", 401)
        }

        if(!show.weekDay || !show.start_time || !show.end_time || !show.band_id) {
            throw new BaseError("You must inform 'band_id', 'week_day', 'start_time' and 'end_time'", 406)
        }

        if(show.start_time < 8 || show.end_time > 23 || show.start_time >= show.end_time) {
            throw new BaseError("Invalid time! You can't create shows, please review its validity", 406)
        }

        if(!Number.isInteger(show.start_time) || !Number.isInteger(show.end_time)) {
            throw new BaseError("Invalid time! You should input integer numbers only!", 406)
        }

        const band = await this.bandDatabase.getBandByIdOrName(show.band_id);

        if(!band) {
            throw new BaseError("Band not found", 404);
        }

        const seeShows = await this.showDatabase.getShowByTime(
            show.start_time,
            show.end_time,
            show.weekDay
        );

        if(seeShows.length) {
            throw new BaseError("no more shows can be registered at this time", 400)
        }

        await this.showDatabase.createShow(
            Show.toShow({
                id: this.idGenerator.generate(),
                ...show
            })
        )

    };
}