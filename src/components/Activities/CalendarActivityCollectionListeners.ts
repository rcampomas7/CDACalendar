import { IActivity } from "./IActivity";
import { IActivityCollection } from "./IActivityCollection";
import { IActivityCollectionListener } from "./IActivityCollectionListener";
class CalendarActivityCollectionListeners implements IActivityCollectionListener {

    private collection:IActivityCollection;
    private listeners=new Array<IActivityCollectionListener>();

    // Interaccion con componentes asignados.
    ActivityAdded(AActivity:IActivity)
    {
        this.listeners.forEach((value)=> { value.ActivityAdded(AActivity)});
    };

    ActivityRemoved(AActivity:IActivity)
    {
        this.listeners.forEach((value)=> { value.ActivityRemoved(AActivity)});
    };

    ActivitiesCleared(ACollection:IActivityCollection)
    {
        this.listeners.forEach((value)=> { value.ActivitiesCleared(ACollection)});
    };
    ActivityChanged(AActivity:IActivity,AProperty:string)
    {
        this.listeners.forEach((value)=> { value.ActivityChanged(AActivity,AProperty);});
    }
    ActivityWillChange(AActivity:IActivity,AProperty:string,AValue:any)
    {
        this.listeners.forEach((value)=> { value.ActivityWillChange(AActivity,AProperty,AValue);});
    }
    // Interface de usuario.
    constructor (ACollection:IActivityCollection)
    {
        this.collection=ACollection;
    }
    get Collection()
    {
        return this.collection;
    }
    Add(AListener:IActivityCollectionListener)
    {
        let i=this.listeners.indexOf(AListener);
        if (i<0)
        {
            this.listeners.push(AListener);
            return true;
        }
        return false;
    }
    Remove(AListener:IActivityCollectionListener)
    {
        let i=this.listeners.indexOf(AListener);
        if (i>=0)
            return delete this.listeners[i];
        return false;
    }
}

export { CalendarActivityCollectionListeners};