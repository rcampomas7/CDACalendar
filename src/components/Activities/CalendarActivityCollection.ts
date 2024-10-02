import { IActivity } from "./IActivity.ts";
import { IActivityCollection } from "./IActivityCollection.ts";
import { IActivityCollectionListener } from "./IActivityCollectionListener.ts";
import { IHoliday } from "./IHoliday.ts";
import { IHolidayCollection } from "./IHolidayCollection.ts";
import { CalendarActivity } from "./CalendarActivity.ts";
import { CalendarActivityCollectionListeners } from "./CalendarActivityCollectionListeners.ts";
import { SpanishDateToDate } from "../Common/Generic.js";

class CalendarActivityCollection implements IActivityCollection,IHolidayCollection
{
    private activity=new Map();
    private activityID=new Map();
    private currentID: number = 0;
    private listeners: CalendarActivityCollectionListeners|null=null;

    // Implementación.
    protected initiateListeners()
    {
        if (!this.listeners)
            this.listeners=new CalendarActivityCollectionListeners(this);
    }
    protected getListeners()
    {
        return this.listeners;
    }
    protected getCount()
    {
        // Devuelve cantidad de actividades registradas.
        return this.activityID.entries.length;
    }
    protected getActivityByID(AID:number)
    {
        let activity=this.activityID.get(AID);
        return activity;
    }
    protected getNextID()
    {
        this.currentID++;
        return this.currentID;
    } 
    protected resetID(AID:number)
    {
        // Ajusta el contador de IDs.
        if (AID>this.currentID)
            this.currentID=AID;
    }

    private getActivityMap(AYear:number,AMonth:number,ADay:number)
    {
        // Crea y/o devuelve un arreglo de actividades para una fecha determinada.
        // Devuelve la cantidad de actividades definidas por fecha.
        let year=this.activity.get(AYear);
        if (!year) return null;
        
        let month=year.get(AMonth)
        if (!month) return null;

        let day=month.get(ADay)
        if (!day) return null;

        // Devuelve arreglo con dias registrados.
        return day;
    }

    private createActivityMap(AYear:number,AMonth:number,ADay:number)
    {
        // Devuelve un arreglo asociado a Año, Mes y Día
        // para registrar objectos actividad.
        let yearMap;
        let monthMap;
        let list;

        // Existe Año registrado ?.
        yearMap=this.activity.get(AYear);
        if (!yearMap)
        {
            yearMap = new Map(); 
            this.activity.set(AYear,yearMap);
        }

        // Mes registrado ?
        monthMap=yearMap.get(AMonth);
        if (!monthMap)
        {
            monthMap = new Map();
            yearMap.set(AMonth,monthMap);
        }

        // Dia registado ?
        list=monthMap.get(ADay);
        if (!list)
        {
            list=new Array<CalendarActivity>();
            monthMap.set(ADay,list);
        } 
        return list;
    }
    protected createMapFor(AActivity:CalendarActivity)
    {
        let map = this.getMapFor(AActivity);
        if (!map)
        {
            map = this.createActivityMap(
                                            AActivity.Year,
                                            AActivity.Month,
                                            AActivity.Day
                                        )
        }
        return map;
    }
    protected getMapFor(AActivity:CalendarActivity)
    {
        // Obtiene el arreglo para la actividad
        // a registrar.
        return this.getActivityMap(
                                    AActivity.Year,
                                    AActivity.Month,
                                    AActivity.Day);
    }
    protected getCurrentMapOf(AActivity:CalendarActivity)
    {
        // Devuelve la lista a la que esta asociada
        // el objeto actividad.
        return this.getMapFor(AActivity);
    }
    protected releaseMapOf(AActivity:CalendarActivity)
    {
        let map=this.getCurrentMapOf(AActivity);
        if (map)
        {
            let i=map.indexOf(AActivity);
            if (i>=0) map.splice(i,1);
            return true;
        }
        return false;
    }
    protected doSetMapFor(AMap:Array<CalendarActivity>,AActivity:CalendarActivity)
    {
        AMap.push(AActivity);
    }
    protected setMapFor(AActivity:CalendarActivity)
    {
        let map=this.createMapFor(AActivity);
        if (map)
        {
            map.push(AActivity);
            return true;
        }
        return false;
    }
    protected resetMapOf(AActivity:CalendarActivity)
    {
        if (AActivity)
        {
            this.releaseMapOf(AActivity);
            return this.setMapFor(AActivity);
        }
        return false;
    }
    protected canAddActivity(AActivity:CalendarActivity)
    {
        if (!AActivity)
            return false;

        if (AActivity.Collection)
            return false;

        if (this.getActivityByID(AActivity.ID))
            return false;

        return true;
    }
    protected doCreateActivity(AID:number,ADefinition:string,ADate:Date,ATime,ADuration:number,AState:number,ARecordDate:Date)
    {
        let activity=new CalendarActivity(this,AID,ADefinition,ADate,ATime,ADuration,AState,ARecordDate);
        return activity;
    }
    protected doAddActivityPrimary(AActivity:CalendarActivity)
    {
        this.activityID.set(AActivity.ID,AActivity);
    }
    protected doAddActivity(AActivity:CalendarActivity)
    {
        this.resetID(AActivity.ID);
        this.doAddActivityPrimary(AActivity);
        this.doAddActivityMap(AActivity);
    }
    protected doAddActivityMap(AActivity:CalendarActivity)
    {
        this.setMapFor(AActivity);
    }
    protected doRemoveActivity(AActivity:CalendarActivity)
    {
        let result=this.releaseMapOf(AActivity)
        if (result)
            this.activityID.delete(AActivity.ID);
        return result;
    }

    // Implementación IActivityCollection.
    ActivityWillChange(AActivity: CalendarActivity,AProperty:string,AValue:any)
    {
        this.doActivityWillChange(AActivity,AProperty,AValue);
    }

    ActivityChanged(AActivity: CalendarActivity,AProperty:string)
    {
        if (AProperty=="Date")
            this.resetMapOf(AActivity);
        this.doActivityChanged(AActivity,AProperty);
    }

    // Eventos a Listeners.
    protected doActivityWillChange(AActivity:CalendarActivity,AProperty:string,AValue:any)
    {
        if (this.listeners)
            this.listeners.ActivityWillChange(AActivity,AProperty,AValue);
    }
    protected doActivityChanged(AActivity:CalendarActivity,AProperty:string)
    {
        if (this.listeners)
            this.listeners.ActivityChanged(AActivity,AProperty);
    }
    protected doActivityAdded(AActivity: CalendarActivity)
    {
        // Reporta que ha agregado una nueva actividad.
        if (this.listeners)        
            this.listeners.ActivityAdded(AActivity);
    }
    protected doActivityRemoved(AActivity: CalendarActivity)
    {
        if (this.listeners)
            this.listeners.ActivityRemoved(AActivity)
    }
    protected doActivitiesCleared()
    {
        if (this.listeners)
            this.listeners.ActivitiesCleared(this);
    }

    // Implementación.
    constructor()
    {
        // Inicia la lsita de objetos escucha.
        this.initiateListeners();
    }

    get Listeners()
    {
        return this.getListeners();
    }

    AddActivityDirect(AID:number,ADefinition:string,ADate:Date,ATime:number,ADuration:number,AState:number,ARecordDate:Date)
    {
        let activity=null;
        if (!this.Activity(AID))
        {
            let activity=this.doCreateActivity(AID,ADefinition,ADate,ATime,ADuration,AState,ARecordDate);
            this.AddActivity(activity);
        }
        return activity;
    }
    AddActivity(AActivity:CalendarActivity)
    {
        // Registra un objeto AActivity completo.
        this.doAddActivity(AActivity);
        this.doActivityAdded(AActivity);
    }
    Remove(AActivity:CalendarActivity)
    {
        let result=this.doRemoveActivity(AActivity);
        if (result) this.doActivityRemoved(AActivity);
        return result;
    }
    RemoveActivity(AActivity:IActivity)
    {
        return this.RemoveActivityById(AActivity.ID);
    }
    RemoveActivityById(AID:number)
    {
        let activity=this.getActivityByID(AID);
        if (activity)
            return this.Remove(activity);
        return false;
    }
        
        // Interface IActivityCollection..
    Activity(AID:number):IActivity|null
    {
        return this.activityID.get(AID);
    }
    GetActivityListByDate(ADate:Date)
    {
        return this.GetActivityList(ADate.getFullYear(),ADate.getMonth(),ADate.getDate());
    }
    GetActivityList(AYear:number,AMonth:number,ADay:number)
    {
        return this.getActivityMap(AYear,AMonth,ADay);
    }
    get Count()
    {
        return this.getCount();
    }
    GetCount(AYear:number,AMonth:number,ADay:number)
    {
        let alist=this.GetActivityList(AYear,AMonth,ADay);
        if (alist)
            return alist.length;
        return 0;
    }
    AddListener(AListener:IActivityCollectionListener)
    {
        if (AListener && this.listeners)
            return this.listeners.Add(AListener);
        return false;
    }
    
    ReleaseListener(AListener:IActivityCollectionListener)
    {
        if (AListener && this.listeners)
            return this.listeners.Remove(AListener);
        return false;        
    }
    // Agregar acitividades/dias festivos.
    Add(ADefinition:string,ADate:Date|string,ATime:number,ADuration:number=1):number
    {
        // Agrega una actividad/dia festivo directamente
        // desde una funcion.
        if (ADefinition)
        {
            let adateParameter;

            // Verifica si necesita convertir una cadena
            // en una fecha correspondiente.
            if (typeof(ADate)=="string")
                adateParameter=SpanishDateToDate(ADate)

            // Procesa la fecha intacta.
            else adateParameter=ADate;

            // Si la fecha no es valida, se ignora el intento de registro.
            if (adateParameter)
            {
                let aid=this.getNextID();
                this.AddActivityDirect(aid,ADefinition,adateParameter,ATime,ADuration,0,new Date());
                return aid;
            }       
        }
        return null;
    }

    FullList()
    {
        return Array.from(this.activityID,([name,value])=>(value));
    }
    ListByDate(ADate:Date)
    {
        return this.List(ADate.getFullYear(),ADate.getMonth(),ADate.getDate());
    }
    List(AYear:number,AMonth:number,ADay:number)
    {
        // Obtiene un segmento de la lista filtrado por fecha.
        let alist=this.FullList();
        let result=null;

        if (alist)
        {
            result=new Array();
            let match=0;
            let element;
            let pattern=AYear>=0? 1<<2:0;
            pattern|= AMonth>=0? 1<<1:0;
            pattern|= ADay>=0? 1:0;

            for(let i=0;i<alist.length;i++)
            {
                element=alist[i];
                match=0;
                if (AYear>=0)
                    if (AYear==element.Year) match|=1<<2;
                
                if (AMonth>=0)
                    if (AMonth==element.Month) match|=1<<1;
                
                if (ADay>=0)
                    if (ADay==element.Day) match|=1;
                
                if (match==pattern)
                    result.push(element);
            };
        }
        return result;
    }
    CountAt(AYear: number, AMonth: number, ADay: number): number {
        throw new Error("Method not implemented.");
    }
    GetAt(AYear: number, AMonth: number, ADay: number, AIndex: number): IHoliday | null {
        throw new Error("Method not implemented.");
    }
}

export function CreateHolidayCollection():IHolidayCollection
{
    return new CalendarActivityCollection();
}

export function CreateActivityCollection():IActivityCollection
{
    return new CalendarActivityCollection();
}

export {CalendarActivityCollection};