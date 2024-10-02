import { IActivity } from "./IActivity";
import { IActivityCollection } from "./IActivityCollection";

export interface IActivityCollectionListener{
    ActivityWillChange(AActivity:IActivity,AProperty:string,AValue: any):void;
    ActivityChanged(AActivity:IActivity,APropert:string):void;
    ActivityAdded(AActivity:IActivity):void;
    ActivityRemoved(AActivity:IActivity):void;
    ActivitiesCleared(ACollection:IActivityCollection):void;
}
