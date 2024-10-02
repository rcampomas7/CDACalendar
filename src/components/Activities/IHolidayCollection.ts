import { IHoliday } from "./IHoliday.ts";
import { IActivity } from "./IActivity.ts";
import { IActivityCollectionListener } from "./IActivityCollectionListener.ts";

export interface IHolidayCollection{
    Add(ADefinition:string,ADate:Date|string,ADuration:number):number;
    List(AYear:number,AMonth:number,ADay:number);
    GetAt(AYear:number,AMonth:number,ADay:number,AIndex:number):IHoliday|null;
    CountAt(AYear:number,AMonth:number,ADay:number):number;
    AddListener(ACollection:IActivityCollectionListener);
    ReleaseListener(AColleciton:IActivityCollectionListener);
    Count:number;
}
