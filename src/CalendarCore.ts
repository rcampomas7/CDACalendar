import { IActivity } from "./components/Activities/IActivity.ts";
import { IActivityCollection } from "./components/Activities/IActivityCollection.ts";
import { IHolidayCollection } from "./components/Activities/IHolidayCollection.ts";
import { ICalendar } from "./components/Calendar/ICalendar.ts";
import { Calendar } from "./components/Calendar/Calendar.ts";
import { CreateCalendar } from "./components/Calendar/Calendar.ts";
import { CreateHolidayCollection } from "./components/Activities/CalendarActivityCollection.ts";
import { CalendarActivityBinder } from "./components/Binder/CalendarActivityBinder.ts";
import { CalendarCountry } from "./components/Settings/CalendarCountry.ts";
import { CalendarTheme } from "./components/Settings/CalendarTheme.ts";
import { ZeroLeft,
         SpanishDateToDate,
         SpanishDate } from "./components/Common/Generic.js";

// Controles de muestra.
let calendar:Calendar;

export function InitiateCalendar(ACanvas:HTMLCanvasElement)
{
    calendar=InitiateCalendarComponent(ACanvas);
    ResetControls(calendar)
    return calendar;
}

function InitiateCalendarComponent(ACanvas:HTMLCanvasElement)
{
    // Crea el calendario y lo asocia
    // al lienzo espeficicado.
    if (ACanvas)
    {
        calendar=new Calendar();
        calendar.Canvas=ACanvas;
        calendar.Year=2024;
        calendar.Month=9;
        calendar.TrackMouse=true;
    }
    return calendar;
}

function ResetControls(ACalendar:ICalendar)
{
    if (ACalendar)
    {
        // Eventos.
        /*
        document.getElementById("MonthPrevious").addEventListener("click", event=>{
            event.preventDefault();
            GoPreviousMonth();
        })*/

        document.getElementById("MonthNext").addEventListener("click", event=>{
            event.preventDefault();
            GoNextMonth();
        })

        document.getElementById("YearPrevious").addEventListener("click", event=>{
            event.preventDefault();
            GoPreviousYear();
        })
/*
        document.getElementById("YearNext").addEventListener("click", event=>{
            event.preventDefault();
            GoNextYear();
        })*/
    }
}

export function GoNextMonth()
{
    if (calendar)
    {    
        let amonth=calendar.Month;
        let ayear=calendar.Year;
        amonth++;
        if (amonth>12)
        {
            amonth=1;
            ayear++;
        }
        calendar.SetCurrentMonth(ayear,amonth);
    }
}

export function GoPreviousMonth()
{
    if (calendar)
    {    
        let amonth=calendar.Month;
        let ayear=calendar.Year;
        amonth--;
        if (amonth<1)
        {
            amonth=12;
            ayear--;
        }
        calendar.SetCurrentMonth(ayear,amonth);
    }
}

export function GoNextYear()
{
    if (calendar)
    {    
        let amonth=calendar.Month;
        let ayear=calendar.Year;
        ayear++;
        calendar.SetCurrentMonth(ayear,amonth);
    }
}

export function GoPreviousYear()
{
    if (calendar)
    {    
        let amonth=calendar.Month;
        let ayear=calendar.Year;
        ayear--;
        calendar.SetCurrentMonth(ayear,amonth);
    }
}
