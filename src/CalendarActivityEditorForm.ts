import { IActivity } 
        from "./components/Activities/IActivity.ts";

import { IActivityCollection } 
        from "./components/Activities/IActivityCollection.ts";

import { CalendarDay }
        from "./components/Calendar/CalendarDay.ts";

import { StandardTimeToText,
         SpanishDateToDate,
         SpanishDate,
         TimeToText,
         TimeTextToTime } 
         from "./components/Common/Generic.js";

// Editor de actividades.
let currentDate:Date=new Date();
let currentActivity:IActivity=null;
let activityList:IActivityCollection;
let activityEditorForm;
let activityEditorDate:HTMLInputElement|null=null;
let activityEditorTime:HTMLInputElement|null=null;
let activityEditorDefinition:HTMLInputElement|null=null;
let activityEditorUpdateButton:HTMLButtonElement;
let activityEditorCloseButton:HTMLButtonElement;

export function InitiateActivityEditor(AActivityList:IActivityCollection)
{
    // Editor de actividades.
    activityList=AActivityList;
    activityEditorForm=document.getElementById("activityEditorForm");
    activityEditorCloseButton=<HTMLButtonElement>document.getElementById("cancelActivityButton");
    activityEditorUpdateButton=<HTMLButtonElement>document.getElementById("updateActivityButton");
        
    // Obtiene objetos de edición
    // de la página.
    if (!activityEditorDate)
        activityEditorDate=<HTMLInputElement>document.getElementById("editorDate");

    if (!activityEditorTime)
        activityEditorTime=<HTMLInputElement>document.getElementById("editorTime");
    
    if (!activityEditorDefinition)
        activityEditorDefinition=<HTMLInputElement>document.getElementById("editorDefinition");

    // Teclas Enter y Escape en el formulario.
    activityEditorDefinition.addEventListener("keypress",event=>
    {
        if (event.keyCode==13)
            UpdateActivity();

        else if (event.keyCode==27)
            CloseActivityEditorForm();
    })

    activityEditorUpdateButton.addEventListener("click",event=>{
        event.preventDefault();
        UpdateActivity();
    })

    activityEditorCloseButton.addEventListener("click",event=>{
        event.preventDefault();
        CloseActivityEditorForm();
    })
}
export function SetCurrentEditDate(ADate:Date)
{
    // Fija el nuevo dia para edicion.
    currentDate=ADate;
}
export function ResetCurrentDate()
{
    // Libera el nuevo dia marcado para edición.
    currentDate=new Date();
}
export function NewActivity()
{
    if (activityEditorForm)
    {
        let adate:Date=currentDate;
        currentActivity=null;
        activityEditorDate.value=SpanishDate(adate);
        activityEditorTime.value=StandardTimeToText(adate);
        activityEditorDefinition.value="";
        activityEditorForm.style.display="block";
        activityEditorDefinition.focus();
    }
}

export function EditActivity(AActivity:IActivity)
{
    // Inicia edicion de una actividad en el formulario.
    if (AActivity && activityEditorForm)
    {
        currentActivity=AActivity;
        activityEditorDate.value=SpanishDate(AActivity.Date);
        activityEditorTime.value=TimeToText(AActivity.Time);
        activityEditorDefinition.value=AActivity.Definition;
        activityEditorForm.style.display="block";
    }
}

function UpdateActivity()
{
    // Actualiza actividad registrada.
    if (currentActivity)
        DoUpdateActivity();

    else DoRecordNewActivity();
    CloseActivityEditorForm();
}

function DoRecordNewActivity()
{
    if (activityList)
    {
        activityList.Add(
                            activityEditorDefinition.value,
                            SpanishDateToDate(activityEditorDate.value),
                            TimeTextToTime(activityEditorTime.value)
                            );
    }
}

function DoUpdateActivity()
{
    if (currentActivity)
    {
        currentActivity.Date=SpanishDateToDate(activityEditorDate.value);
        currentActivity.Time=TimeTextToTime(activityEditorTime.value);
        currentActivity.Definition=activityEditorDefinition.value;
    }
}

export function CloseActivityEditorForm()
{
    activityEditorForm.style.display="none";
    ClearActivityEditorForm();
}

export function ClearActivityEditorForm()
{
    activityEditorDate.value=null;
    activityEditorTime.value=null;
    activityEditorDefinition.value=null;
}

