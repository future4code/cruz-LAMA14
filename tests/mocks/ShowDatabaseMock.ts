import { Show, ShowOutputDTO, WeekDay } from "../../src/model/Show";
import { User } from "../../src/model/User";
import { userMockAdmin, userMockNormal } from "./UserMock";

export class ShowDatabase {

   public async createShow(show: Show): Promise<void> {}

   public async getUserByTime(
    weekDay: WeekDay,
    start_time: number, 
    end_time: number
   ): Promise<ShowOutputDTO | undefined> {

        await ShowDatabase.getShowByTime({ 
            weekDay: WeekDay,
            start_time: 10, 
            end_time: 16
        })
   }

   public async getUserByDay(
    weekDay: WeekDay
   ): Promise<ShowOutputDTO[] | undefined> {

        await ShowDatabase.getShowByTime({ 
            weekDay: WeekDay
        })
    }
}

export default new ShowDatabase()
