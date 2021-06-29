import { BaseError } from "../error/BaseError";
import { Show, ShowOutputDTO, WeekDay } from "../model/Show";
import { BandDatabase } from "./BandDatabase";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {

    public static TABLE_NAME = "Shows";

    public async createShow(
        show: Show
    ): Promise<void> {
        await this.getConnection()
        .insert({
            id:show.getId(),
            band_id:show.getBandId(),
            start_time:show.getStartTime(),
            end_time:show.getEndTime(),
            week_day: show.getWeekDay()
        })
        .into(ShowDatabase.TABLE_NAME)
    };

    public async getShowByTime(
        weekDay: WeekDay,
        start_time: number, 
        end_time: number
    ): Promise<ShowOutputDTO[]> {

        const shows = await this.getConnection()
        .select("*")
        .where("end_time", ">", `${start_time}`)
        .andWhere("start_time", "<", `${end_time}`)
        .from(ShowDatabase.TABLE_NAME)

        return shows.map((show: any) => {
            return {
                id: show.id,
                band_id: show.band_id,
                start_time: show.start_time,
                end_time: show.end_time,
                week_day: show.weekDay
            }
        })
    };

    public async getShowsByDay(weekDay: WeekDay): Promise<ShowOutputDTO[]> {
        const shows = await this.getConnection().raw(`
            SELECT show.id as id,
            band.id as bandId,
            band.name as bandName,
            show.start_time as startTime,
            show.end_time as endTime,
            show.week_day as weekDay,
            band.music_genre as mainGenre,
            FROM ${ShowDatabase.TABLE_NAME} show
            LEFT JOIN ${BandDatabase.TABLE_NAME} band ON band.id = show.band_id
            WHERE show.week_day = "${weekDay}"
            ORDER BY startTime ASC
        `)
        

        if(!shows.length) {
            throw new BaseError(`Unable to found show at ${weekDay}`, 400)
        }
    
        return shows[0].map((data: any) => ({
            id: data.id,
            bandId: data.bandId,
            startTime: data.startTime,
            endTime: data.endTime,
            weekDay: data.weekDay,
            mainGenre: data.mainGenre,
        })
        )
    };

}