// Ensamblaje de Scripts.
import { IActivity } 
        from "./components/Activities/IActivity.ts";

import { CalendarActivity }
        from "./components/Activities/CalendarActivity.ts";

import { ICalendar } 
        from "./components/Calendar/ICalendar.ts";

import { Calendar }
        from "./components/Calendar/Calendar.ts";

import { InitiateSettings } 
        from "./CalendarSettings.ts";

import { InitiateCalendar } 
        from "./CalendarCore.ts";

import { InitiateActivityEditor } 
        from "./CalendarActivityEditorForm.ts";

import { InitiateActivityBinder, InitiateActivityForm } 
        from "./CalendarActivityForm.ts";

import { CalendarCountry } 
        from "./components/Settings/CalendarCountry.ts";

import { CalendarTheme } 
        from "./components/Settings/CalendarTheme.ts";

import {    GoNextMonth,
            GoPreviousMonth,
            GoNextYear,
            GoPreviousYear
        } from "./CalendarCore.ts";

import { InitiateActivityCollection } 
        from "./CalendarHolidays.ts";

import { InitiateHolidayCollection }
         from "./CalendarHolidays.ts";

import { InitiateThemes }
        from "./CalendarThemes.ts";

import { InitiateThemeList }
        from "./CalendarSettings.ts";

import { CloseSettingsForm } 
        from "./CalendarSettings.ts";

import { ShowDate,
         ShowMonthActivities } 
        from "./CalendarActivityForm.ts";

import { TimeToText, ZeroLeft }
        from "./Components/Common/Generic.js";

import { activityBinder,
         activityBinderMini }        
         from "./CalendarActivityForm.ts";

import { EditActivity,
         SetCurrentEditDate } 
        from "./CalendarActivityEditorForm.ts";

import { SaveActivities } from "./CalendarFiles.ts";

import { NewActivity } from "./CalendarActivityEditorForm.ts";
// Componentes comunes.
let showMini:boolean=false;
let bundledActivityForm:HTMLFormElement|null=null;
let country:CalendarCountry=null;
let currentTheme:CalendarTheme=null;
let calendar:Calendar|null=null;
let monthDisplay:HTMLLabelElement|null=null;
let yearDisplay:HTMLLabelElement|null=null;
let currentActivity:CalendarActivity;
let hList:HTMLTableElement= <HTMLTableElement> document.getElementById("HolidayTable");

// Creación de controles y componentes.
function InitiateLocal()
{
    if (!monthDisplay)
        monthDisplay=<HTMLLabelElement>document.getElementById("MonthLabel");
    if (!yearDisplay)
        yearDisplay=<HTMLLabelElement>document.getElementById("YearLabel");

    yearDisplay.addEventListener("wheel",event=>{
        event.preventDefault();
        if (event.deltaY<0) GoNextYear();
        if (event.deltaY>0) GoPreviousYear();
    })

    monthDisplay.addEventListener("wheel",event=>{
        event.preventDefault();
        if (event.deltaY<0) GoNextMonth();
        if (event.deltaY>0) GoPreviousMonth();
    })

    document.getElementById("miniNewActivity").addEventListener("click",event=>
    {
        event.preventDefault();
        NewActivity();
    }
    )
}
function Initiate()
{
    InitiateSettings();
    InitiateLocal();
    calendar=InitiateCalendar(<HTMLCanvasElement> document.getElementById("Calendar"));
    InitiateActivityForm();
    country=InitiateThemes();
    currentTheme=country.Theme(0);
    InitiateThemeList(country);
    InitiateActivityBinder();
    
    let activities=InitiateActivityCollection();
    let holidays=InitiateHolidayCollection();
    SaveActivities(activities);
    calendar.OnChange=DisplayCurrentMonth;
    calendar.OnDblClick=DoShowDate;
    activityBinder.ActivityCollection=activities;
    activityBinder.OnItemRender=RenderActivityItem;
    activityBinderMini.ActivityCollection=activities;
    activityBinderMini.OnItemRender=RenderActivityItem;

    // Formulario de edicion de actividades.
    InitiateActivityEditor(activities);

    bundledActivityForm=<HTMLFormElement> document.getElementById("bundledActivityForm");

    let themeList:HTMLSelectElement=<HTMLSelectElement>document.getElementById("themes");    
    themeList.addEventListener("change", event=>
    {
        event.preventDefault();
        currentTheme=country.Theme(themeList.selectedIndex);
        DisplayCurrentMonth(calendar);
        CloseSettingsForm();
    })

    calendar.Activities=activities;
    calendar.Holidays=holidays;
}

function DoShowDate(AEvent)
{
    let ADate=calendar.DayMouseOn.Date;
    SetCurrentEditDate(ADate)
    ShowDate(ADate);
}

function DisplayCurrentMonth(ACalendar:ICalendar)
{
    monthDisplay.innerHTML=ACalendar.CurrentMonthName.toUpperCase();
    yearDisplay.innerHTML=ACalendar.Year.toString();

    FillHolidayTable();
    FillActivityMiniList(ACalendar);
    if (currentTheme)
        UpdateImage(currentTheme.GetItem(ACalendar.Month).Image);
}

function FillActivityMiniList(ACalendar:ICalendar)
{
    activityBinderMini.LoadMonth(ACalendar.Year,ACalendar.Month);

}
function HolidayDate(ADate:Date)
{
    if (ADate)
        return ZeroLeft(ADate.getDate(),2) + " " + calendar.GetMonthName(ADate.getMonth()+1).toLowerCase();
    return "";
}
function FillHolidayTable()
{
    let holidays=calendar.Holidays.List(calendar.Year,calendar.Month-1,-1);
    let row;
    let cell;
    hList.innerHTML="";
    for(let i=0;i<holidays.length;i++)
    {
        row=hList.insertRow(-1);
        cell=row.insertCell(0);
        cell.style.class="holiday-bold";
        cell.innerHTML=HolidayDate(holidays[i].Date);
        cell=row.insertCell(1);
        cell.style.class="holiday";
        cell.innerHTML=holidays[i].Definition;
    }
}
function UpdateImage(AImage:string)
{
    document.body.style.backgroundImage="url('"+AImage+"')";
}
function RefreshControls()
{
    DisplayCurrentMonth(calendar);
}

function ActivityDateText(AActivity:IActivity)
{
    return ZeroLeft(AActivity.Day)+" "+calendar.GetMonthName(AActivity.Month+1)+", "+TimeToText(AActivity.Time);
}

function RenderActivityItem(AItem,AActivity:IActivity)
{
    AItem.innerHTML="<div class='activityItem'>"+
                    "<div class='activityButtonPanel'>"+
                    "<img class='activityEditButton' src='./settings/images/edit2Icon.png' width='12px'>"+
                    "<img class='activityRemoveButton' src='./settings/images/deleteIcon.png' width='12px'>"+
                    "</div>"+
                    "<label class='activityEditCaption' style='font-weight:bold'>"+ActivityDateText(AActivity)+"</label>"+
                    "<br><label>"+AActivity.Definition+"</label></div>";

    // Asocia eventos de edición/eliminación de actividades.
    let editCommand=AItem.getElementsByClassName("activityEditButton")[0];
    editCommand.addEventListener("click", event=>
    {
        event.preventDefault();
        EditActivityFromItem(AItem);
    });

    let deleteCommand=AItem.getElementsByClassName("activityRemoveButton")[0];
    deleteCommand.addEventListener("click",event=>
    {
        event.preventDefault();
        RemoveActivity(AItem);
    });
}

function RenderActivityItemMini(AItem,AActivity:IActivity)
{
    AItem.innerHTML="<div class='activityItem'>"+
                    "<div class='activityButtonPanel'>"+
                    "<img class='activityEditButton' src='./settings/images/edit2Icon.png' width='12px'>"+
                    "<img class='activityRemoveButton' src='./settings/images/deleteIcon.png' width='12px'>"+
                    "</div>"+
                    "<label class='activityEditCaption' style='font-weight:bold'>"+ActivityDateText(AActivity)+"</label>"+
                    "<br><label>"+AActivity.Definition+"</label></div>";

    // Asocia eventos de edición/eliminación de actividades.
    let editCommand=AItem.getElementsByClassName("activityEditButton")[0];
    editCommand.addEventListener("click", event=>
    {
        event.preventDefault();
        EditActivityFromItem(AItem);
    });

    let deleteCommand=AItem.getElementsByClassName("activityRemoveButton")[0];
    deleteCommand.addEventListener("click",event=>
    {
        event.preventDefault();
        RemoveActivity(AItem);
    });
}


document.getElementById("ShowAllActivities").addEventListener("click", event=>
    {
        event.preventDefault();
        //ShowMonthActivities(calendar.Year,calendar.Month);
        ToggleMiniList();
    }
)

function ToggleMiniList()
{
    showMini=!showMini;
    bundledActivityForm.style.display= showMini ? "block":"none";
}
function RemoveActivity(AItem)
{
    // Elimina una actividad basada en el objeto HTMLElement
    // vinculado a ella.
    let activity:IActivity=activityBinder.GetActivityOf(AItem);
    if (activity) activity.Remove();
}

export function EditActivityFromItem(AItem:HTMLElement)
{
    // Edita una actividad basada en el objeto HTMLElement
    // vinculado a ella.
    if (AItem)
    {
        let activity=activityBinder.GetActivityOf(AItem);
        if (activity) EditActivity(activity)
    }
}

// Controles del formulario.
Initiate();
RefreshControls();