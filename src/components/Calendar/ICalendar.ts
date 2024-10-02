"use strict";

import { IActivityCollection } from "../Activities/IActivityCollection";
import { IHolidayCollection } from "../Activities/IHolidayCollection";

export interface ICalendar
{
    Canvas: HTMLCanvasElement|null;
    Holidays: IHolidayCollection;
    Activities: IActivityCollection;
    Year: number;
    Month: number;
    TrackMouse: boolean;
    CurrentMonthName: String;
    GetMonthName(AMonth:number):string;
    SetCurrentMonth(AYear:number,AMonth:number);

    // Eventos
    OnChange;
    OnClick;
    OnDblClick;
    OnMouseMove;
    OnMouseDown;
    OnMouseUp;
}