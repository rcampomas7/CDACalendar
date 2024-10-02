import { CalendarActivityBinderList } from "./CalendarActivityBinderList";
import { ICalendarActivityBinderProvider } from "./ICalendarAcitivityBinderProvider";

export class CalendarListItemProvider implements ICalendarActivityBinderProvider
{
    private list:HTMLUListElement|null=null;
    private sentinel:HTMLLIElement|null=null;
    private onCreateSentinel=null;

    // Implementacion
    constructor()
    {}
    Clear()
    {
        // Elimina todos los elementos creados
        // menos el centinela, si existe.
        if (this.list)
        {
            let aitem;
            let alength=this.list.children.length;
            for(let i=0;i<alength;i++)
            {
                aitem=this.list.children.item(0);
                if (aitem!=this.sentinel)
                    aitem.remove();
            }
        }
    }
    CreateSentinel()
    {
        if (!this.sentinel && this.onCreateSentinel)
            this.sentinel=this.OnCreateSentinel(this.list);
    }
    CreateObject()
    {
        let aitem=null;
        if (this.list)
        {
            aitem=document.createElement("li");
            if (!this.sentinel)
                this.list.appendChild(aitem);
            else this.list.insertBefore(aitem,this.sentinel);
        }
        return aitem;
    }
    DestroyObject(AObject)
    {
        if (this.list && AObject)
        {
            AObject.remove();
            return true;
        }
        return false;
    }
    EndListDeploy(AActivities)
    {}

    get List():HTMLUListElement|null
    {
        return this.list;
    }
    set List(AValue:HTMLUListElement|null)
    {
        this.list=AValue;
    }
    get OnCreateSentinel()
    {
        return this.onCreateSentinel;
    }
    set OnCreateSentinel(AEvent)
    {
        this.onCreateSentinel=AEvent;
    }
}

export function CreateListItemProvider()
{
    return new CalendarListItemProvider();
}