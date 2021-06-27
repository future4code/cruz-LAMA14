import moment from "moment";


export class Show {
    constructor(
        private id: string,
        private week_day: WeekDay,
        private start_time: number,
        private end_time: number,
        private band_id: string
    ){};

    getId(): string{
        return this.id;
    }

    getWeekDay(): WeekDay {
        return this.week_day;
    }

    getStartTime(): number{
        return this.start_time;
    }

    getEndTime(): number{
        return this.end_time;
    }

    getBandId(): string{
        return this.band_id;
    }

    setId(id:string){
        this.id = id;
    }

    setWeekDay(weekDay: WeekDay){
        this.week_day = weekDay;
    }

    setStartTime(startTime:number) {
        this.start_time = startTime;
    }

    setEndTime(endTime:number){
        this.end_time = endTime;
    }

    static toShowModel(show: any): Show {
        return new Show(
            show.id,
            show.week_day,
            show.start_time,
            show.end_time,
            show.band_id
        )
    }

    public static toWeekDayEnum(data? :any): WeekDay {
        switch(data) {
            case 'FRIDAY':
                return WeekDay.FRIDAY;
            case 'SATURDAY':
                return WeekDay.SATURDAY;
            case 'SUNDAY':
                return WeekDay.SUNDAY;
            default: 
                throw new Error("Invalid week day");
        }
    }

    public static toShow(data?: any) {
        return (
            data && new Show(
                data.id,
                Show.toWeekDayEnum(
                    data.weekDay || 
                    data.week_day 
                    ),
                data.band_id || 
                data.bandId,
                data.startDate || 
                data.start_date,
                data.endTime || 
                data.end_time
            )
        )
    }
};

export enum WeekDay{
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface ShowOutputDTO{
    id: string;
    week_day: WeekDay;
    start_time: moment.Moment;
    end_time: number;
    band_id: string;
    mainGenre?: string;
    bandName?: string;
}

export interface ShowInputDTO{
    weekDay: WeekDay
    start_time: number
    end_time: number
    band_id: string
}