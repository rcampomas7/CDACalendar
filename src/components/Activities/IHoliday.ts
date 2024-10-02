import { IHolidayCollection } from "./IHolidayCollection";
export interface IHoliday{
    get Date():Date;
    get Definition():String;
    get IsCalculated():boolean;
}