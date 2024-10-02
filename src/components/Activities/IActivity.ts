import {IActivityCollection} from "./IActivityCollection";

export interface IActivity{
    get Collection(): IActivityCollection|null;
    get ID():number;
    get Definition():string;
    set Definition(AValue:string);
    get Year():number;
    get Month():number;
    get Day():number;
    get Date():Date;
    set Date(ADate:Date);
    get Time():number;
    set Time(AValue:number);
    get Duration():number;
    get State():number;
    get RecordDate():Date;
    Remove():boolean;
}