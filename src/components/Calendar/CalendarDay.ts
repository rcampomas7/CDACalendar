import { Calendar } from "./Calendar.ts";
import { CalendarTextStyle } from "../Common/CalendarTextStyle.ts";

// Día de Calendario
export class CalendarDay
{
    private calendar:Calendar|null;
    private date:Date;
    private weekDay:number;
    private value;
    private holiday;
    private activities:number;
    private isWeekDayHeader=false;
    private currentMonth:boolean=false;

    // Variables de control de visualizacion.
    private rectangle=null;
    private highlightSize:number=0;
    private highlightWidth:number=0;
    private highlightStyle:string|null=null;
    private highlighted:boolean=false;
    private highlightBehind:boolean=false;
    private textAlign:CanvasTextAlign|null=null;
    private textBaseline:CanvasTextBaseline|null=null;
    private backgroundFillStyle:string|null=null;
    private holidayFillStyle:string|null=null;
    private backgroundGraphic=null;

    // Fuentes.
    private textStyle:CalendarTextStyle|null=null;
    private weekdayTextStyle:CalendarTextStyle|null=null;
    private holidayTextStyle:CalendarTextStyle|null=null;
    private activityTextStyle:CalendarTextStyle|null=null;
    private noCurrentMonthTextStyle:CalendarTextStyle|null=null;

    // Invocación a eventos.
    protected getIsCurrentMonth():boolean
    {
        return this.currentMonth;
    }
    private canHighlight():boolean
    {
        // Devuelve si esta celda puede
        // ser seleccionada.
        return !this.isWeekDayHeader && this.currentMonth;
    }
    // Notificaciones de eventos.
    private notifyHighlightChanged()
    {
        if (this.calendar)
            this.calendar.DoHighlightChanged(this);
    }

    private getHighlightWidth()
    {
        if (!this.highlightWidth || this.highlightWidth<1)
            return this.calendar.HighlightWidth;
        return this.highlightWidth;
    }

    // Variables de visualizacion.
    protected getTextAlign():CanvasTextAlign|null
    {
        if (!this.textAlign)
            return this.calendar.TextAlign;
        return this.textAlign;
    }
    private getTextBaseline():CanvasTextBaseline|null
    {
        if (!this.textBaseline)
            return this.calendar.TextBaseline;
        return this.textBaseline;
    }

    protected getBackgroundFillStyle()
    {
        if (!this.backgroundFillStyle)
            return this.calendar.BackgroundFillStyle;
        return this.backgroundFillStyle;
    }

    protected getTextStyle():CalendarTextStyle
    {
        if (!this.textStyle)
            return this.calendar.TextStyle;
        return this.textStyle;
    }

    protected getWeekdayTextStyle():CalendarTextStyle
    {
        if (!this.weekdayTextStyle)
            return this.calendar.WeekDayTextStyle;
        return this.weekdayTextStyle;
    }

    protected getHolidayTextStyle():CalendarTextStyle
    {
        if (!this.holidayTextStyle)
            return this.calendar.HolidayTextStyle;
        return this.holidayTextStyle;
    }

    protected getActivityTextStyle():CalendarTextStyle
    {
        if (!this.activityTextStyle)
            return this.calendar.ActivityTextStyle
        return this.activityTextStyle
    }

    protected getNoCurrentMonthTextStyle():CalendarTextStyle
    {
        if (!this.noCurrentMonthTextStyle)
            return this.calendar.NoCurrentMonthTextStyle
        return this.noCurrentMonthTextStyle;    
    }

    private getHighlightStyle():string
    {
        if (!this.highlightStyle)
            return this.calendar.HighlightStyle;
        return this.highlightStyle;
    }
    private getHighlightBehind():boolean
    {
        if (!this.highlightBehind)
            return this.calendar.HighlightBehind;
        return this.highlightBehind;
    }

    private getHolidayFillStyle()
    {
        if (!this.holidayFillStyle)
            return this.calendar.HolidayFillStyle;
        return this.holidayFillStyle;
    }

    private getHighlightSize():number
    {
        if (!this.highlightSize)
            return this.calendar.HighlightSize;
        return this.highlightSize;
    }

    private getActivityList()
    {
        if (this.calendar)
            return this.calendar.getActivityList(this);
    }
    protected getContext()
    {
        if (this.calendar)
            return this.calendar.NoCurrentMonthTextStyle;
        return null;
    }
    // Interface de usuario.
    constructor(ACalendar)
    {
        this.calendar=ACalendar;
    }
    Clear()
    {
        this.value="";
    }
    get Context()
    {
        return this.getContext();
    }
    get Date():Date
    {
        return this.date;
    }
    get Year():number
    {
        if (this.date)
            return this.date.getFullYear();
        return 0;
    }
    get Month():number
    {
        if (this.date)
            return this.date.getMonth();
        return 0;
    }
    get Day():number
    {
        if (this.date)
            return this.date.getDate();
        return 0;
    }
    get DisplayValue():string
    {
        if (this.isWeekDayHeader)
            return this.calendar.GetWeekdayName(this.weekDay);
        else return this.Day.toString();
    }
    get TextAlign():CanvasTextAlign|null
    {
        return this.getTextAlign();
    }
    get TextBaseline():CanvasTextBaseline|null
    {
        return this.getTextBaseline();
    }
    get BackgroundFillStyle()
    {
        return this.getBackgroundFillStyle();
    }
    get BackgroundGraphic()
    {
        return this.backgroundGraphic;
    }
    set BackgroundGraphic(ABackgroundGraphic)
    {
        this.backgroundGraphic=ABackgroundGraphic;
    }
    get Rectangle()
    {
        return this.rectangle;
    }
    SetRectangle(ARectangle)
    {
        this.rectangle=ARectangle;
    }
    get IsWeekDayHeader()
    {
        return this.isWeekDayHeader;
    }
    SetIsWeekDayHeader(AValue)
    {
        this.isWeekDayHeader=AValue;
    }
    get WeekDay()
    {
        return this.weekDay;
    }
    SetWeekDay(AWeekDay)
    {
        this.weekDay=AWeekDay;
    }
    get Value()
    {
        return this.value;
    }
    SetValue(AValue)
    {
        this.value=AValue;
    }
    SetDate(ADate)
    {
        this.date=ADate;
    }
    get TextStyle():CalendarTextStyle
    {
        return this.getTextStyle();
    }
    get WeekDayTextStyle():CalendarTextStyle
    {
        return this.getWeekdayTextStyle();
    }
    get HolidayTextStyle():CalendarTextStyle
    {
        return this.getHolidayTextStyle();
    }
    get ActitivityTextStyle():CalendarTextStyle
    {
        return this.getActivityTextStyle();
    }
    get NoCurrentMonthTextStyle():CalendarTextStyle
    {
        return this.getNoCurrentMonthTextStyle();
    }
    get Highlighted():boolean
    {
        return this.highlighted;
    }
 
    set Highlighted(AHighlight:boolean)
    {
        if (this.highlighted!=AHighlight && this.canHighlight())
        {
            this.highlighted=AHighlight;
            this.notifyHighlightChanged();
        }
    }

    get HighlightWidth():number
    {
        return this.getHighlightWidth();
    }
    
    get HighlightStyle():string
    {
        return this.getHighlightStyle();
    }
    get HighlightBehind():boolean
    {
        return this.getHighlightBehind();
    }
    set HighlightBehind(AValue)
    {
        this.highlightBehind=AValue;
    }
    get HighlightSize():number
    {
        return this.getHighlightSize();
    }
    set HighlightSize(AValue)
    {
        this.highlightSize=AValue;
    }
    get IsCurrentMonth():boolean
    {
        return this.getIsCurrentMonth();
    }
    set IsCurrentMonth(AValue:boolean)
    {
        this.currentMonth=AValue;
    }
    get Holiday()
    {
        return this.holiday;
    }
    set Holiday(AHoliday)
    {
        if (this.holiday!=AHoliday)
        {
            this.holiday=AHoliday;
            //this.notifyHolidayChanged();
        }
    }
    
    get HolidayFillStyle()
    {
        return this.getHolidayFillStyle();
    }
    get Activities()
    {
        return this.activities;
    }
    set Activities(AValue)
    {
        this.activities=AValue;
    }
    get ActivityList()
    {
        return this.getActivityList();
    }
    Changed()
    {
        if (this.calendar)
            this.calendar.DoDayChanged(this);
    }
}