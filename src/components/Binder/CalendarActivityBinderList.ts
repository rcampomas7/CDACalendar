import { CalendarActivityBinder } from "./CalendarActivityBinder";

export class CalendarActivityBinderList
{
    // Lista con enlaces entre Actividades y filas.
    private activityBinder:CalendarActivityBinder|null=null;
    private items=new Map();
    private activities=new Map();

    // Implementación.
    protected doAdd(AActivity,AItem)
    {
        // Agrega enlace entre actividad y fila.
        let bind={item:AItem,activity:AActivity};
        this.items.set(AItem,bind);
        this.activities.set(AActivity,bind);
        return bind;
    }
    protected doRemoveBind(ABind)
    {
        if (ABind)
        {
            this.activities.delete(ABind.Activity);
            this.items.delete(ABind.item);
            return ABind;
        }
        return null;
    }
    protected doRemoveItem(AItem)
    {
        if (AItem)
        {
            let bind=this.items.get(AItem);
            return this.doRemoveBind(bind);
        }
        return null;
    }
    protected doRemoveActivity(AActivity)
    {
        // Elimina el vinculo de actividad con el item.
        if (AActivity)
        {
            let bind=this.activities.get(AActivity);
            return this.doRemoveBind(bind);
        }
        return null;
    }
    protected getItemOf(AActivity)
    {
        if (AActivity)
        {
            let bind=this.activities.get(AActivity);
            if (bind) return bind.item;
        }
        return null;
    }
    protected getActivityOf(AItem)
    {
        if (AItem)
        {
            let bind=this.items.get(AItem);
            if (bind) return bind.activity;
        }
        return null;
    }
    protected getCount()
    {
        // Devuelve cantidad de registros.
        if (this.items)
            this.items.size;
        return 0;
    }
    protected doClear()
    {
        this.items.clear();
        this.activities.clear();
    }
z
    // Interface
    constructor(AActivityBinder:CalendarActivityBinder)
    {
        this.activityBinder=AActivityBinder;
    }
    get ActivityBinder():CalendarActivityBinder
    {
        return this.activityBinder;
    }
    get Count()
    {
        return this.getCount();
    }
    Clear()
    {
        this.doClear();
    }
    Add(AActivity,AItem)
    {
        if (AActivity && AItem)
        {
            if (this.activities.get(AActivity))
                return null;

            if (this.items.get(AItem))
                return null;
            
            // Registra finalmente el enlace entre
            // Actividad y elemento HTML.
            return this.doAdd(AActivity,AItem);
        }
        return null;
    }
    RemoveItem(AAItem)
    {
        return this.doRemoveItem(AAItem);
    }
    RemoveActivity(AActivity)
    {
        return this.doRemoveActivity(AActivity);
    }
    GetItemOf(AActivity)
    {
        return this.getItemOf(AActivity);
    }
    GetActivityOf(AItem)
    {
        return this.getActivityOf(AItem);
    }
}
