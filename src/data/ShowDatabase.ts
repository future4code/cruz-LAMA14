import { Show, ShowOutputDTO, WeekDay } from "../model/Show";
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
        start_time: number, 
        end_time: number,
        weekDay: WeekDay
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

};