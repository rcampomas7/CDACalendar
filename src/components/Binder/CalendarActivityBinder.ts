"use strict";
import { IActivity } from "../Activities/IActivity.ts";
import { IActivityCollection } from "../Activities/IActivityCollection.ts";
import { IActivityCollectionListener } from "../Activities/IActivityCollectionListener.ts";
import { ICalendarActivityBinderProvider } from "./ICalendarAcitivityBinderProvider.ts";
import { CalendarActivityCollection } from "../Activities/CalendarActivityCollection.ts";
import { CalendarActivityBinderList } from "./CalendarActivityBinderList.ts";
import { EqualDate } from "../Common/Generic.js";

export class CalendarActivityBinder implements IActivityCollectionListener
{
    private activityCollection:IActivityCollection|null=null;
    private currentActivity:IActivity|null=null;
    private currentDate:Date|null=null;
    private currentList:CalendarActivityBinderList|null=null;
    private objectProvider:ICalendarActivityBinderProvider|null=null;
    private modified=false;

    // Eventos.
    private onItemRender=null;
    private onItemMouseDown=null;
    private onItemMouseUp=null;
    private onItemClick=null;
    private onItemDblClick=null;
    private onObjectSetClass=null;
    private onActivitySelected=null;
    private onActivityUpdated=null;

    // Implementación.
    protected getActivityCollection():IActivityCollection
    {
        return this.activityCollection;
    }
    protected setActivityCollection(AActivityCollection:IActivityCollection)
    {
        if (this.activityCollection!=AActivityCollection)
        {
            this.activityCollection=AActivityCollection;
            return true;
        }
        return false;
    }
    
    protected doDateChanged()
    {
        if (this.activityCollection)
        {
            this.doTriggerList();
        }
    }
    protected getDate()
    {
        return this.currentDate;
    }
    protected setDate(ADate)
    {
        // Se espera objeto {year,month,day}.
        if (!EqualDate(ADate,this.currentDate))
        {
            this.currentDate=ADate;
            this.doDateChanged();
        }
    }
    protected getActivityList(ADate:Date)
    {   
        // Obtiene lista de actividades por fecha.
        let result=null;

        if (this.activityCollection)
            result=this.activityCollection.ListByDate(ADate);

        return result;
    }
    protected getActivitiesByMonth(AYear,AMonth)
    {
        let result=null;
        if (this.activityCollection)
            result=this.activityCollection.List(AYear,AMonth,-1);
        return result;
    }
    protected getCurrentActivityList()
    {
        if (this.currentDate)
            return this.getActivityList(this.currentDate);
        return null;
    }
    protected getAllActivities()
    {
        if (this.activityCollection)
            return this.activityCollection.FullList();
        return null;
    }

    protected doCreateObject()
    {
        if (this.objectProvider)
           return this.objectProvider.CreateObject();
        return null;
    }
    
    protected doDestroyObject(AObject)
    {
        return this.objectProvider.DestroyObject(AObject);
    }
   
    protected doTriggerList()
    {
        if (this.objectProvider && this.activityCollection)
        {
            let activities;
            this.doCreateList();
            this.doClear();
            if (this.currentDate)
                activities=this.getCurrentActivityList();
            else activities=this.getAllActivities();
            this.doDeployList(activities,this.currentList);
        }
    }
    protected doCreateList()
    {
        if (!this.currentList)
            this.currentList=new CalendarActivityBinderList(this);
        return this.currentList;
    }
    protected doRenderActivity(AList,AActivity)
    {
        let aitem=this.doCreateItem();
        if (aitem)
        {
            let bind=AList.Add(AActivity,aitem);
            this.doRenderItem(bind.item,bind.activity);
        }
    }
    protected doRenderItem(AItem,AActivity)
    {
        // Invoca la realización de la fila
        // con los datos de la actividad.
        if (this.onItemRender)
            this.onItemRender(AItem,AActivity);
    }
    protected doDeployList(AActivities,AList)
    {
        if (AActivities && AList)
        {
            AList.Clear();
            if (this.objectProvider)
                this.objectProvider.CreateSentinel();
            
            for(let i=0;i<AActivities.length;i++)
                this.doRenderActivity(AList,AActivities[i]);
            
            this.doEndListDeploy(AActivities);
        }
    }
    protected doEndListDeploy(AActivities)
    {
        if (this.objectProvider)
            this.objectProvider.EndListDeploy(AActivities);
    }
    protected doActivityRemoved(AActivity)
    {
        // Elimina Actividad, Fila y vinculos.
        if (this.currentList && AActivity)
        {
            let bind=this.currentList.RemoveActivity(AActivity);
            this.doDestroyObject(bind.item);
            return true;
        }
        return false;
    }

    protected doClearTable()
    {
        if (this.objectProvider)
        {
            this.objectProvider.Clear();
            return true;
        }
        return false;
    }

    protected doClear()
    {
        this.doClearTable();
    }


    // Rutinas de combinacion de Filas y Actividades.
    protected doActivityAdded(AActivity)
    {
        if (AActivity && this.currentList)
            this.doRenderActivity(this.currentList,AActivity);
    }

    protected doActivityChanged(AActivity)
    {}

    // Operaciones con Tabla.
    protected doObjectSetClass(AObject)
    {
        if (this.onObjectSetClass)
            this.onObjectSetClass(AObject);
    }

    protected doUpdateActivity(AActivity,ADefinition,ADate,ATime)
    {
        if (AActivity)
        {
            AActivity.Definition=ADefinition;
            AActivity.Date=ADate;
            AActivity.Time=ATime;
            return true;
        }
        return false;
    }
    protected doCreateActivity(ADefinition,ADate,ATime)
    {
        // Registra una nueva actividad.
        let activity=this.activityCollection.Add(ADefinition,ADate,1);//ATime,1,0);
        return activity;
    }
    protected doRemoveActivity(AActivity)
    {
        // Elimina una actividad registrada.
        if (this.currentList)
            return this.currentList.RemoveActivity(AActivity);
        return null;
    }
    protected doResetCurrentActivity()
    {
        this.currentActivity=null;
    }
    protected doActivityUpdated()
    {
        // Notifica que ha actualizado una actividad.
        this.modified=true;
        if (this.onActivityUpdated)
            this.onActivityUpdated(this);
    }
    // Eventos para el programador.
    protected doActivitiesChanged()
    {
        // Al cambiar a lista de actividades.
        this.doTriggerList();
    }
    protected doListChanged()
    {
        // Actualice la tabla con las actividades registradas.
        this.doTriggerList();
    }

    // Eventos de mouse.
    protected doItemMouseDown(AEvent)
    {
        if (this.onItemMouseDown)
            this.onItemMouseDown(AEvent);
    }
    protected doItemMouseUp(AEvent)
    {
        if (this.onItemMouseUp)
            this.onItemMouseUp(AEvent);
    }
    protected doItemClick(AEvent)
    {
        if (this.onItemClick)
            this.onItemClick(AEvent);
    }
    protected doItemDblClick(AEvent)
    {
        // Selecciona una actividad dada la fila
        // señalada.
        if (this.onItemDblClick)
            this.onItemDblClick(AEvent);
    }
    protected doActivitySelected(AActivity,AItem)
    {
        // Notifica la actividad que se ha seleccionado
        // para edicion.
        if (this.onActivitySelected)
            this.onActivitySelected(AActivity,AItem);
    }

    protected doCreateItem()
    {
        // Crea una nueva fila.
        let result=this.doCreateObject();
        if (result)
        {
            this.doObjectSetClass(result);
            
            // Eventos asociados al elemento.
            result.addEventListener("mousedown", event=>{
                event.preventDefault();
                this.doItemMouseDown(event);
            });
            
            result.addEventListener("mouseup", event=>{
                event.preventDefault();
                this.doItemMouseUp(event);
            });

            result.addEventListener("click", event=>
            {
                event.preventDefault();
                this.doItemClick(event);
            });

            result.addEventListener("dblclick", event=>{
                event.preventDefault();
                this.doItemDblClick(event);
            });
        };
        return result;
    } 

    // Implementacion Interface ICalendarActivitiesListener.
    activityAdded(AActivity)
    {
        // Se ha registrado una nueva actividad.
        // Medie para determinar si se admite o no
        // en esta lista.
        this.doActivityAdded(AActivity);
    }

    activityRemoved(AActivity)
    {
        // Se ha eliminado una actividad.
        // Eliminese de esta lista.
        this.doActivityRemoved(AActivity);
    }

    activityChanged(AActivity)
    {
        this.doActivityChanged(AActivity)
    }
    // Implementación.
    constructor()
    {}
    
    get Date()
    {
        return this.getDate();
    }
    set Date(ADate)
    {
        this.setDate(ADate);
    }
    get ActivityCollection():IActivityCollection
    {
        return this.getActivityCollection();
    }
    set ActivityCollection(AActivities:IActivityCollection)
    {
        if (AActivities)
        {
            if (this.setActivityCollection(AActivities))
            {
                AActivities.AddListener(this);
                this.doActivitiesChanged();
            }
        }
    }
    get CurrentActivity()
    {
        // Devuelve la última actividad seleccionada.
        return this.currentActivity;
    }
    get Modified()
    {
        return this.modified;
    }
    CancelCurrentActivity()
    {
        this.currentActivity=null;
    }
    UpdateCurrentActivity(ADefinition,ADate,ATime)
    {
        // Actualiza/Registra una actividad.
        // Si ya tiene seleccionada una actividad, la actualiza.
        if (this.currentActivity && this.currentList)
        {
            let aitem=this.currentList.GetItemOf(this.currentActivity);
            this.doUpdateActivity(this.currentActivity,ADefinition,ADate,ATime);
            if (aitem) this.doRenderItem(aitem,this.currentActivity);
            this.doResetCurrentActivity();
            this.doActivityUpdated();
            return true;
        }
        return false;
    }

    CreateActivity(ADefinition,ADate,ATime)
    {
        let result=null;
        if (ADefinition)
        {
            result=this.doCreateActivity(ADefinition,ADate,ATime);
            this.doActivityUpdated();
        }
        return result;
    }
    RemoveActivity(AActivity:IActivity):boolean
    {
        if (AActivity)
            if (this.activityCollection)
                return this.activityCollection.RemoveActivity(AActivity);
        return false;
    }
    LoadDate(ADate:Date)
    {
        this.doClear();
        let alist=this.getActivityList(ADate);
        if (alist) this.doDeployList(alist,this.currentList);
    }
    LoadMonth(AYear,AMonth)
    {
        this.doClear();
        let alist=this.getActivitiesByMonth(AYear,AMonth-1);
        if (alist) this.doDeployList(alist,this.currentList);
    }
    LoadAll()
    {
        this.currentDate=null;
        this.doTriggerList();
    }
    GetActivityOf(AItem)
    {
        if (this.currentList)
            return this.currentList.GetActivityOf(AItem);
        return null;
    }
    GetItemOf(AActivity)
    {
        if (this.currentList)
            return this.currentList.GetItemOf(AActivity);
        return null;
    }
    ResetModified()
    {
        this.modified=false;
    }

    // Eventos de usuario.
    get ObjectProvider():ICalendarActivityBinderProvider|null
    {
        return this.objectProvider;
    }
    set ObjectProvider(AProvider:ICalendarActivityBinderProvider|null)
    {
        this.objectProvider=AProvider;
    }
    get OnActivitySelected()
    {
        return this.onActivitySelected;
    }
    set OnActivitySelected(AEvent)
    {
        this.onActivitySelected=AEvent;
    }
    get OnActivityUpdated()
    {
        return this.onActivityUpdated;
    }
    set OnActivityUpdated(AEvent)
    {
        this.onActivityUpdated=AEvent;
    }
    get OnItemRender()
    {
        return this.onItemRender;
    }
    set OnItemRender(AEvent)
    {
        this.onItemRender=AEvent;
    }
    get OnObjectSetClass()
    {
        return this.onObjectSetClass;
    }
    set OnObjectSetClass(AEvent)
    {
        this.onObjectSetClass=AEvent;
    }
    get OnItemClick()
    {
        return this.onItemClick;
    }
    set OnItemClick(AEvent)
    {
        this.onItemClick=AEvent;
    }
    get OnItemDblClick()
    {
        return this.onItemDblClick;
    }
    set OnItemDblClick(AEvent)
    {{
        this.onItemDblClick=AEvent;
    }}
    get OnItemMouseDown()
    {
        return this.onItemMouseDown;
    }
    set OnItemMouseDown(AEvent)
    {
        this.onItemMouseDown=AEvent;
    }
    get OnItemMouseUp()
    {
        return this.onItemMouseUp;
    }
    set OnItemMouseUp(AEvent)
    {
        this.onItemMouseUp=AEvent;
    }

    ActivityWillChange(AActivity:IActivity,AProperty:string,AValue: any)
    {}
    ActivityChanged(AActivity:IActivity,APropert:string)
    {}
    ActivityAdded(AActivity:IActivity)
    {
        this.doActivityAdded(AActivity);
    }
    ActivityRemoved(AActivity:IActivity)
    {
        this.doActivityRemoved(AActivity);
    }
    ActivitiesCleared(ACollection:IActivityCollection)
    {}
}   
