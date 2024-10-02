import { IActivity } 
        from "./components/Activities/IActivity.ts";

import { IActivityCollection }  
        from "./components/Activities/IActivityCollection.ts";

import { CreateActivityCollection } 
        from "./components/Activities/CalendarActivityCollection.ts";

import { CalendarActivityBinder } 
        from "./components/Binder/CalendarActivityBinder.ts";

import { CalendarListItemProvider,
         CreateListItemProvider } 
        from "./components/Binder/CalendarListItemProvider.ts";

import { NewActivity } 
        from "./CalendarActivityEditorForm.ts";

let activityCollection:IActivityCollection=null;
let currentActivity:IActivity|null=null;
let activityList;
let activityListMini;
export let activityBinder:CalendarActivityBinder=null;
export let activityBinderMini:CalendarActivityBinder=null;
let listItemProvider:CalendarListItemProvider=null;
let listItemProviderMini:CalendarListItemProvider=null;
let activityForm;
let activityFormCloseButton;

export function InitiateActivityForm()
{
    // Lista de actividades.
    activityForm=document.getElementById("activityListForm");
    activityFormCloseButton=document.getElementById("CloseActivityForm");

    activityFormCloseButton.addEventListener("click",event=>{
        event.preventDefault();
        CloseActivityForm();
    })
}

function ListItemSetClass(AItem)
{
    AItem.className="activityLi prevent-select";
}

export function InitiateActivityBinder()
{
    if (!activityBinder)
    {
        InitiateListItemProvider();
        activityList=document.getElementById("activityList");
        activityBinder=new CalendarActivityBinder();
        activityBinder.ObjectProvider=listItemProvider;
        //activityBinder.OnItemRender=RenderActivityItem;
        activityBinder.OnObjectSetClass=ListItemSetClass;
        activityBinder.ActivityCollection=activityCollection;

        activityListMini=document.getElementById("activityListMini");
        activityBinderMini=new CalendarActivityBinder();
        activityBinderMini.ObjectProvider=listItemProviderMini;
        activityBinderMini.OnObjectSetClass=ListItemSetClass;
        activityBinderMini.ActivityCollection=activityCollection;
    }
}
function InitiateListItemProvider()
{
    if (!listItemProvider)
    {
        listItemProvider=CreateListItemProvider();
        listItemProvider.List=<HTMLUListElement>document.getElementById("activityList");
        listItemProvider.OnCreateSentinel=CreateSentinel;

        listItemProviderMini=CreateListItemProvider();
        listItemProviderMini.List=<HTMLUListElement>document.getElementById("activityListMini");
    }
}

function CreateSentinel(AList)
{
    // Crea una opción para registrar nuevas actividades.
    let result:HTMLLIElement=<HTMLLIElement>document.createElement("li");
    result.className="activityLi prevent-select";
    result.style.verticalAlign="middle";
    result.innerHTML="<img src=\"./src/blueAddIcon.png\" width=\"18px\"/>NOTAS";
    AList.appendChild(result);

    // Por el momento asocia el evento al centinela directamente.
    result.addEventListener("click",event=>{
        event.preventDefault();
        NewActivity();
    })
    return result;
}

function CloseActivityForm()
{
    activityForm.style.display="none";
}

export function ShowDate(ADate:Date)
{
    activityForm.style.display="block";
    activityBinder.LoadDate(ADate);
}

export function ShowMonthActivities(AYear:number,AMonth:number)
{
    activityBinder.LoadMonth(AYear,AMonth);
    activityForm.style.display="block";
}