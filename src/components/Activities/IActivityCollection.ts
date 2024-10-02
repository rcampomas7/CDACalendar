import { IActivity } from "./IActivity";
import { IActivityCollectionListener } from "./IActivityCollectionListener";

export interface IActivityCollection{
    Activity(AID:number):IActivity|null;
    Add(ADefinition:string,ADate:Date|string,ADuration:number):number;
    AddActivityDirect(AID:number,ADefinition:string,ADate:Date,ATime:number,ADuration:number,AState:number,ARecordDate:Date)
    RemoveActivity(AActivity:IActivity):boolean;
    FullList():any;
    ListByDate(ADate:Date):any;
    List(AYear:number,AMonth:number,ADay:number):any;
    GetCount(AYear:number,AMonth:number,ADay:number):number;
    AddListener(AListener:IActivityCollectionListener):void;
    ReleaseListener(AListener:IActivityCollectionListener):void;
    Count:number;
}