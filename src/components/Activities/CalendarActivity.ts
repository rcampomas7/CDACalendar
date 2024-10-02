import { IActivity } from "./IActivity.ts";
import { IActivityCollection } from "./IActivityCollection.ts";
import { IHoliday } from "./IHoliday.ts";
import { IHolidayCollection } from "./IHolidayCollection.ts";
import { CalendarActivityCollection }  from "./CalendarActivityCollection.ts";

export class CalendarActivity implements IActivity,IHoliday
{
    private collection: CalendarActivityCollection;
    private id: number;
    private definition: string;
    private date: Date;
    private time: number;
    private duration:  number;
    private state: number;
    private recordDate: Date;

    // Implementación.
    protected canRemove()
    {
        return !this.IsCalculated && this.collection;
    }
    protected doRemove()
    {
        if (this.collection)
            return this.collection.Remove(this);
        return false;
    }
    protected doActivityWillChange(AProperty:string,AValue: string | number | Date)
    {
        if (this.collection)
            this.collection.ActivityWillChange(this,AProperty,AValue);
    }
    protected doActivityChanged(AProperty: string)
    {
        if (this.collection)
            this.collection.ActivityChanged(this,AProperty);
    }
    protected getYear()
    {
        return this.date.getFullYear();
    }
    protected getMonth()
    {
        return this.date.getMonth();
    }
    protected getDay()
    {
        return this.date.getDate();
    }

    // Interface publica
    constructor (ACollection: CalendarActivityCollection,AID:number,ADefinition: string, ADate:Date, ATime:number ,ADuration: number, AState: number, ARecordDate: Date)
    {
        this.collection=ACollection,
        this.definition=ADefinition;
        this.id=AID;
        this.date=ADate;
        this.time=ATime;
        this.duration=ADuration;
        this.state=AState;
        this.recordDate=ARecordDate;
    }
    get Collection():IActivityCollection|null
    {
        return this.collection;
    }
    get ID()
    {
        return this.id;
    }
    get Definition():string
    {
        return this.definition;
    }
    set Definition(ADefinition:string)
    {
        if (ADefinition!=this.definition)
        {
            this.doActivityWillChange("Definition",ADefinition);
            this.definition=ADefinition;
            this.doActivityChanged("Definition");
        }
    }
    get Year()
    {
        return this.getYear();
    }
    set Year(AYear:number)
    {
        if (this.getYear()!=AYear)
        {
            this.doActivityWillChange("Year",AYear);
            this.date.setFullYear(AYear);
            this.doActivityChanged("Date");
        }
    }
    get Month()
    {
        return this.getMonth();
    }
    set Month(AMonth:number)
    {
        if (this.getMonth()!=AMonth)
        {
            this.doActivityWillChange("AMonth",AMonth);
            this.date.setMonth(AMonth);
            this.doActivityChanged("AMonth");
        }
    }
    get Day()
    {
        return this.getDay();
    }
    set Day(ADay:number)
    {
        if (this.getDay()!=ADay)
        {
            this.doActivityWillChange("Day",ADay);
            this.date.setDate(ADay);
            this.doActivityChanged("Day");
        }
    }
    get Date()
    {
        return this.date;
    }
    set Date(ADate:Date)
    {
        if (this.date!=ADate)
        {
            this.doActivityWillChange("Date",ADate);
            this.date=ADate;
            this.doActivityChanged("Date");
        }
    }
    get Time()
    {
        return this.time;
    }
    set Time(ATime:number)
    {
        this.time=ATime;
    }
    get Duration()
    {
        return this.duration;
    }
    set Duration(ADuration:number)
    {
        this.doActivityWillChange("Duration",ADuration);
        this.duration=ADuration;
        this.doActivityChanged("Duration");
    }
    get State()
    {
        return this.state;
    }
    set State(AState:number)
    {
        if (this.state!=AState)
        {
            this.doActivityWillChange("State",AState);
            this.state=AState;
            this.doActivityChanged("State");
        }
    }
    get RecordDate()
    {
        return this.recordDate;
    }

    get IsCalculated():boolean
    {
        return false;
    }
    Remove():boolean
    {
        // Determina si puede eliminarse de la lista a la
        // que pertenece.
        if (this.canRemove())
            return this.doRemove();
        return false;
    }
}