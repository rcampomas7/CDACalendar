import { IHoliday } 
        from "./components/Activities/IHoliday";

import { IHolidayCollection } 
        from "./components/Activities/IHolidayCollection";

import { CreateHolidayCollection } 
        from "./components/Activities/CalendarActivityCollection";

import { IActivity } 
        from "./components/Activities/IActivity";

import { IActivityCollection } 
        from "./components/Activities/IActivityCollection";

import { CreateActivityCollection } 
        from "./components/Activities/CalendarActivityCollection";

let holidayCollection:IHolidayCollection=null;
let activityCollection:IActivityCollection=null;

export function InitiateHolidayCollection():IHolidayCollection
{
    if (!holidayCollection)
    {
        holidayCollection=CreateHolidayCollection();
        holidayCollection.Add("Año Nuevo","01/01/2024",1);
        holidayCollection.Add("Carnaval","12/02/2024",2);
        holidayCollection.Add("Carnaval","13/02/2024",2);
        holidayCollection.Add("Día Nacional de la Memoria por la Verdad y la Justicia","24/03/2024",1);
        holidayCollection.Add("Viernes Santo","29/03/2024",1);
        holidayCollection.Add("Día del Veterano y los Caídos de la Guerra de Las Malvinas","02/04/2024",1);
        holidayCollection.Add("Pascua Judía","22/04/2024",1);
        holidayCollection.Add("Día del Trabajador","01/05/2024",1);
        holidayCollection.Add("Día de la Revolución de Mayo","25/05/2024",1);
        holidayCollection.Add("Paso a la Inmortalidad del General Don Martín Miguel de Güemes","17/06/2024",1);
        holidayCollection.Add("Paso a la Inmortalidad del General Manuel Belgrano","20/06/2024",1);
        holidayCollection.Add("Día de la Independencia","09/07/2024",1);
        holidayCollection.Add("Paso a la Inmortalidad del General Don José de San Martín","17/08/2024",1);
        holidayCollection.Add("Año Nuevo Judío","02/10/2024",1);
        holidayCollection.Add("Día del Perdón","11/10/2024",1);
        holidayCollection.Add("Día de la Soberanía Nacional","20/11/2024",1);
        holidayCollection.Add("Navidad","24/12/2024",1);
        holidayCollection.Add("Día de la Inmaculada Concepción de María","08/12/2024",1);
    }
    return holidayCollection;
}

export function InitiateActivityCollection():IActivityCollection
{
    if (!activityCollection)
    {
        activityCollection=CreateActivityCollection();
        activityCollection.Add("reunión 11hs con equipo RRHH CDA","07/01/2024",1);
        activityCollection.Add("dentista 18hs","09/01/2024",1);
        activityCollection.Add("presentación CLIENTE","17/01/2024",1);
        activityCollection.Add("SALIDA VACACIONES","20/01/2024",1);
        activityCollection.Add("VUELTA VACACIONES","03/02/2024",1);
    }
    return activityCollection;
}