import {    ICalendar } from "./ICalendar.ts";
import {    IActivity } from "../Activities/IActivity.ts";
import {    IActivityCollection } from "../Activities/IActivityCollection.ts";
import {    IActivityCollectionListener } from "../Activities/IActivityCollectionListener.ts";
import {    IHolidayCollection } from "../Activities/IHolidayCollection.ts";
import {    CalendarTextStyle } from "../Common/CalendarTextStyle.ts";
import {    CalendarDay } from "./CalendarDay.ts";
import {    GetMonthFirstWeekDay,
            GetMonthLastDay,
            MinMax,
            LocalizePoint,
            DaysBetween} from "../Common/Generic.js";
import {    DrawCircle} from "../Common/GenericGraphics.js";

const maxYear:number=2199;
const minYear:number=1970;

export class Calendar implements ICalendar, IActivityCollectionListener
{
    // Objetos Vinculados.
    private canvas:HTMLCanvasElement|null=null;
    private context:CanvasRenderingContext2D|null=null;
    private holidayCollection: IHolidayCollection|null=null;
    private activityCollection: IActivityCollection|null=null;
    private year:number=0;
    private month:number=0;
    private weekdayInitial:number=0;
    private monthLastDay:number=0;
    private currentDayOn:CalendarDay|null=null;
    private trackMouse:boolean=false;
    private mouseIn:boolean=false;
    private showActivityCount=true;
    private cursor:any=undefined;
    
    // Propiedades de visualización.
    // Datos iniciales.
    private day= new Array<CalendarDay>(7*7);
    private monthName = new Array<string>(
                                            "Enero",
                                            "Febrero",
                                            "Marzo",
                                            "Abril",
                                            "Mayo",
                                            "Junio",
                                            "Julio",
                                            "Agosto",
                                            "Septiembre",
                                            "Octubre",
                                            "Noviembre",
                                            "Diciembre"
                                            );
                                            
    private weekdayName= new Array<string>(
                                            "D",
                                            "L",
                                            "M",
                                            "MI",
                                            "J",
                                            "V",
                                            "S"
                                        );


    // Generales.
    private backgroundFillStyle:string="rgb(255,255,255)";
    private activityFillStyle:string="rgb(0,167,157)";
    private holidayFillStyle:string="rgb(0,125,169)";

    // Fuente.
    private textStyle:CalendarTextStyle = new CalendarTextStyle("20px Myriad PRO","rgb(35,31,32");
    private weekdayTextStyle:CalendarTextStyle = new CalendarTextStyle("bold 20px Myriad PRO","rgb(0,125,169)");
    private holidayTextStyle:CalendarTextStyle = new CalendarTextStyle("20px Myriad PRO","rgb(255,255,255)");
    private activityTextStyle:CalendarTextStyle = new CalendarTextStyle("10px Myriad PRO","rgb(255,255,255)");
    private noCurrentMonthTextStyle:CalendarTextStyle = new CalendarTextStyle("20px Myriad PRO","rgb(147,149,152)");

    // Texto
    private textAlign:CanvasTextAlign|null="center";
    private textBaseline:CanvasTextBaseline|null="middle";

    // Cursor de días.
    private highlightBehind:boolean=true;
    private highlightWidth:number=3;
    private highlightStyle:string|null="rgb(246,146,30)";
    private highlightSize:number=0;

    // Variables de calculo.
    private maxWidth:number=0;
    private maxHeight:number=0;
    private width:number=0;
    private height:number=0;
    private dayWidth:number=0;
    private dayHeight:number=0;

    // Eventos.
    private onClick=null;
    private onDblClick=null;
    private onMouseDown=null;
    private onMouseUp=null;
    private onMouseMove=null;
    private onMouseOut=null;
    private onChange=null;
    private onHighlight=null;

    // Gestion de gráficos
    protected onDrawBackgroundGraphic=null;

    // Implementación.
    protected getActivityCollection():IActivityCollection|null
    {
        return this.activityCollection;
    }

    protected setActivityCollection(AActivityCollection:IActivityCollection):boolean
    {
        if (this.activityCollection!=AActivityCollection)
        {
            if (this.activityCollection)
                this.activityCollection.ReleaseListener(this);

            this.activityCollection=AActivityCollection;
            if (this.activityCollection)
                this.activityCollection.AddListener(this);
            return true;
        }
        return false;
    }
    protected getHolidayCollection():IHolidayCollection|null
    {
        return this.holidayCollection;
    }
    protected setHolidayCollection(AHolidayCollection:IHolidayCollection|null):boolean
    {
        if (this.holidayCollection!=AHolidayCollection)
        {
            if (this.holidayCollection)
                this.holidayCollection.ReleaseListener(this);

            this.holidayCollection=AHolidayCollection;
            if (this.holidayCollection)
                this.holidayCollection.AddListener(this);
            return true;
        }
        return false;
    }
    protected resetMonthFirstLastDay(AYear:number,AMonth:number)
    {
        // Inicia variables con el dia de semana del primer dia
        // del mes y el ordinal del ultimo día del mes.
        this.weekdayInitial=GetMonthFirstWeekDay(AYear,AMonth);
        this.monthLastDay=GetMonthLastDay(AYear,AMonth);
    }

    protected getWeekDayByPosition(APosition:number):number
    {
        // Día de la semana en función de la 
        // posición del cursor.
        return APosition%7;
    }
    protected getWeekDayName(APosition:number)
    {
        if (APosition>=0 && APosition<7)
            return this.weekdayName[APosition];
        return null;
    }
    protected getWeekDayNameByPosition(APosition:number)
    {
        return this.getWeekDayName(APosition%7);
    }
    protected getDayByDate(ADate:Date):CalendarDay
    {
        let p=this.getPositionByDate(ADate);
        if (p>=0)
            return this.day[p];
        return null;
    }
    protected getPositionByDate(ADate:Date):number
    {
        // Obtenga el indice en la matriz de una fecha.
        let d=this.getPositionByDay(DaysBetween(new Date(this.Year,this.Month-1,1),ADate)+1);
        if (d<7 && d>this.day.length) d=-1;
        return d;
    }
    protected getPositionByDay(ADay:number):number
    {
        // Devuelve el indice en la matriz
        // del dia del mes por posición.
        return Number(ADay)+6+this.weekdayInitial;
    }
    protected getPositionAt(Ax:number,Ay:number)
    {
        // Indices (Ax,Ay) dentro de la matriz del calendario.
        // Desde arriba a abajo, izquierda a derecha.
        if (Ax>this.maxWidth || Ay>this.maxHeight)
            return -1;

        let px=Math.trunc(Ax/this.dayWidth);
        let py=Math.trunc(Ay/this.dayHeight);
        return (py*7)+px;        
    }
    protected getPointAt(APosition:number)
    {
        if (APosition>=0 && APosition<this.day.length)
        {
            let py = Math.trunc(APosition/7)*this.dayHeight;
            let px = Math.trunc(APosition%7)*this.dayWidth;
            return {x:px,
                    y:py}
        }
    }
    protected getRectangleAt(Ax:number,Ay:number)
    {
        // Obtiene el rectangulo mas cercano a una posición X,Y
        // dentro de la matriz del calendario.
        let px=Math.trunc(Ax/this.dayWidth)*this.dayWidth;
        let py=Math.trunc(Ay/this.dayHeight)*this.dayHeight;
        let cx=px+this.dayWidth/2;
        let cy=py+this.dayHeight/2;

        return {
                    x:px,
                    y:py,
                    width:this.dayWidth,
                    height:this.dayHeight,
                    center:{
                            x:cx,
                            y:cy
                    }
                }        
    }

    protected getRectangleByPosition(APosition:number)
    {
        // Devuelve el rectangulo que corresponde a una
        // posicion dentro de la matriz del calendario.
        let p=this.getPointAt(APosition);
        if (p!=null)
            return this.getRectangleAt(p.x,p.y);
        return null;        
    }

    protected getDayNumberByPosition(APosition:number):number
    {
        // Devuelve el dia del mes al que corresponde
        // una posicion determinada dentro de la matriz.
        if (APosition>=7 && this.weekdayInitial>=0)
            return APosition - 6 - this.weekdayInitial
        else return undefined;
    }
    protected getPositionInMonth(APosition:number):boolean
    {
        let p=this.getDayNumberByPosition(APosition);
        return p>=1 && p<=this.monthLastDay;
    }
    protected getDateByPosition(APosition:number|undefined)
    {
        // Devuelve la fecha que corresponde a una casilla
        // de la matriz del almanaque.
        if (APosition>=7)
        {
            let y=this.year;
            let m=this.month;
            let p=this.getDayNumberByPosition(APosition);
            let d=0;
            let l=GetMonthLastDay(y,m);
            if (p<1)
            {
                m--;
                if (m<1)
                {   m=12; y--; }
                l=GetMonthLastDay(y,m);
                d=l+p;
            }
            else if (p>l)
            {
                d=p-l;
                m++;
                if (m>12)
                {   m=1; y++; }
            }
            else d=p;
            return new Date(y,m-1,d);
        }
        return undefined;
    }

    protected getInfoByPosition(APosition:number)
    {
        let dayName;

        // Devuelve la informacion de datos de una fecha
        // por la posicion en la matriz del almanaque.
        if (APosition<0 && APosition>=this.day.length)
            return null;
        
        dayName =   (APosition>=0 && APosition<7) ? 
                    this.getWeekDayNameByPosition(APosition): this.getDayNumberByPosition(APosition);

        return {
                    weekDay:        this.getWeekDayByPosition(APosition),
                    day:            this.getDayNumberByPosition(APosition),
                    date:           this.getDateByPosition(APosition),
                    rectangle:      this.getRectangleByPosition(APosition),
                    currentInMonth: this.getPositionInMonth(APosition),
                    value:          dayName      
        }
    }

    protected doResetCalendarDay(ADay:CalendarDay,ADayIndex:number,AData)
    {
        // Fija los datos de visualizacion.
        ADay.SetIsWeekDayHeader(ADayIndex>=0 && ADayIndex<7);
        ADay.SetWeekDay(AData.weekDay);
        ADay.SetRectangle(AData.rectangle);
        ADay.SetValue(AData.value);
        ADay.SetDate(AData.date);
        ADay.IsCurrentMonth=AData.currentInMonth;
        ADay.Holiday=null;
        ADay.BackgroundGraphic=null;
        ADay.Highlighted=false;
        ADay.Activities=0;
    }

    protected resetCalendarMatrix()
    {
        // Inicia el calendario con informacion
        // para visualizar dias.
        let adata;

        // Inicia modifiación de datos.
        if (this.month>0 && this.year>0)
        {
            this.resetMonthFirstLastDay(this.year,this.month);
            for(let i=0;i<this.day.length;i++)
            {
                if (this.day[i]==null)
                    this.day[i]=new CalendarDay(this);
                
                // Obtiene info para configurar la visualizacion de cada dia.
                adata=this.getInfoByPosition(i);
                if (adata) this.doResetCalendarDay(this.day[i],i,adata);
            }
        }
    }

    protected getDayObjectAt(Ax:number,Ay:number)
    {
        let pos=this.getPositionAt(Ax,Ay);
        if (pos>=0 && pos<this.day.length)
            return this.day[pos];
        return null;
    }

    // Atributos del Calendario.
    protected getTextStyle():CalendarTextStyle
    {
        return this.textStyle;
    }

    protected getNoCurrentMonthTextStyle():CalendarTextStyle
    {
        return this.noCurrentMonthTextStyle;
    }

    protected getWeekDayTextStyle():CalendarTextStyle
    {
        return this.weekdayTextStyle;
    }

    protected getActivityTextStyle():CalendarTextStyle
    {
        return this.activityTextStyle;
    }


    // Rutinas de dibujo.
    protected releaseCanvasEvents()
    {
        if (this.canvas)
        {
            // Elimina los eventos asociados.
            this.canvas.removeEventListener("mousemove",this.MouseMove);
            this.canvas.removeEventListener("mousedown",this.MouseDown);
            this.canvas.removeEventListener("mouseout",this.MouseOut);
        }
    }
    protected releaseCanvas()
    {
        if (this.canvas)
        {
            this.releaseCanvasEvents();
            this.canvas=null;
            this.context=null;
        }
    }

    protected setCanvas(ACanvas:HTMLCanvasElement|null)
    {
        // Fija el Objeto Canvas para trabajar el calendario.
        if(!this.canvas && ACanvas)
        {
            this.canvas = ACanvas;
            this.context = ACanvas.getContext("2d");
            this.setCanvasEvents();
        }
    }
    protected setCanvasEvents()
    {
        if (this.canvas)
        {
            // Elimina los eventos asociados.
            this.canvas.addEventListener("mousemove",event=>
            {
                event.preventDefault();
                this.MouseMove(event)});

            this.canvas.addEventListener("mousedown",event=>
            {
                event.preventDefault();
                this.MouseDown(event)});

            this.canvas.addEventListener("mouseout", event=>
            {
                event.preventDefault();
                this.MouseOut(event)});

            this.canvas.addEventListener("click",event=>
            {
                event.preventDefault();
                this.MouseClick(event);
            })

            this.canvas.addEventListener("dblclick",event=>
            {
                event.preventDefault();
                this.MouseDblClick(event);
            })
        }
    }

    protected resetCanvas(ACanvas:HTMLCanvasElement|null)
    {
        this.releaseCanvas();
        this.setCanvas(ACanvas);
    }
    protected getContext():CanvasRenderingContext2D
    {
        return this.context!;
    }
    protected resetCanvasVariables()
    {
        this.width=this.canvas!.width;
        this.height=this.canvas!.height;
        this.dayWidth=Math.trunc(this.width/7);
        this.dayHeight=Math.trunc(this.height/7);
        this.maxWidth=this.dayWidth*7;
        this.maxHeight=this.dayHeight*7;
        this.highlightSize= this.dayHeight>this.dayWidth ? (this.dayWidth/3)+5:(this.dayHeight/3)+5;
    }
    protected reset()
    {
        this.resetCalendarMatrix();
        this.resetHolidays();
        this.resetActivities();
        this.CalendarFullDraw();
    }

    protected getTextAlign(ADay:CalendarDay)
    {
        return this.textAlign;
    }
    protected getTextBaseline(ADay:CalendarDay)
    {
        return this.textBaseline;
    }
    protected getCalendarDayTextStyle(ADayInfo:CalendarDay):CalendarTextStyle
    {
        // Selecciona que corresponde al estado actual
        // del día.
        if (ADayInfo.IsWeekDayHeader)
            return ADayInfo.WeekDayTextStyle;

        else if (!ADayInfo.IsCurrentMonth)
            return ADayInfo.NoCurrentMonthTextStyle;

        else if (ADayInfo.Holiday)
            return ADayInfo.HolidayTextStyle;

        return ADayInfo.TextStyle;
    }

    protected doDrawText(AValue:string,AFont:string,ATextFillStyle:string,ATextAlign:CanvasTextAlign,ATextBaseline:CanvasTextBaseline,Ax:number,Ay:number)
    {
        // Dibuja el texto correspondiente.
        this.context!.font=AFont;
        this.context!.textAlign=ATextAlign;
        this.context!.textBaseline=ATextBaseline;
        this.context!.fillStyle=ATextFillStyle;
        this.context!.fillText(AValue,Ax,Ay);
    }

    protected doDrawDayText(ADayInfo:CalendarDay)
    {
        let value=ADayInfo.DisplayValue;
        let style=this.getCalendarDayTextStyle(ADayInfo);
        let atextAlign=this.getTextAlign(ADayInfo);
        let atextBaseline=this.getTextBaseline(ADayInfo);
        this.doDrawText(value,style.Font,style.Style,atextAlign,atextBaseline,ADayInfo.Rectangle.center.x,ADayInfo.Rectangle.center.y);
    }

    protected doDrawHolidayBackground(ADay:CalendarDay)
    {
        let fillStyle=ADay.HolidayFillStyle;
        DrawCircle(
                    this.Context,
                    ADay.Rectangle.center.x,
                    ADay.Rectangle.center.y,
                    this.HighlightSize-3,
                    0,
                    fillStyle,
                    fillStyle,
                    true
                );
    }
    protected doDrawCalendarDay(ADay:CalendarDay)
    {
        // Dibuja el contenido de una celda.
        if (ADay)
        {
            this.onDrawBackgroundGraphic=ADay.BackgroundGraphic;
            this.doDrawDayBackground(ADay,this.context!);

            // Debe destacarse antes de dibujar ?.
            if (ADay.Highlighted)
                if (this.mouseIn && ADay.HighlightBehind)
                    this.doDrawDayHighlight(ADay);

            // Dibujar texto.
            if (this.onDrawBackgroundGraphic)
                this.onDrawBackgroundGraphic(ADay);
            this.doDrawDayText(ADay);
           
            // Cantidad de Actividades registradas.
            if (ADay.Activities>0 && this.showActivityCount)
                this.doDrawActivityCount(ADay);

            if (ADay.Highlighted)
                if (this.mouseIn && !ADay.HighlightBehind)
                    this.doDrawDayHighlight(ADay);
        }
    }

    // Dibujo de celda.
    protected doDrawDayBackground(ADay:CalendarDay,AContext:CanvasRenderingContext2D)
    {
        // Pinta el fondo del celda por día.
        AContext.fillStyle=ADay.BackgroundFillStyle;
        AContext.fillRect(
                            ADay.Rectangle.x,
                            ADay.Rectangle.y,
                            ADay.Rectangle.width,
                            ADay.Rectangle.height
                        );
    }
    protected doDrawDayHighlight(ADay:CalendarDay)
    {
        // Dibuja el señalador de la fecha.
        this.doDrawHighlight(ADay,this.highlightSize,this.highlightWidth);
    }
 
    protected CalendarFullDraw():boolean
    {
        if (!this.canvas) return false;
        if (!this.context) return false;
        if (this.year<minYear) return false;
        if (this.year>maxYear) return false;
        if (this.month<=0) return false;
        if (this.dayWidth<0) return false;
        if (this.dayHeight<0) return false;
        this.DoCalendarFullDraw();
        return true;
    }
    protected DoCalendarFullDraw()
    {
        // Dibuja el calendario completo.
        for(let i=0;i<this.day.length;i++)
            this.doDrawCalendarDay(this.day[i]);
    }

   // Operacion con el usuario.
   protected resetMouseIn(AValue)
   {
       // Reacción al evento de entrada o salida del 
       // mouse del area del componente.
       if (this.mouseIn!=AValue)
       {
           this.mouseIn=AValue;
          
           // Cursor dentro del area.
           if (this.currentDayOn)
               this.doDrawCalendarDay(this.currentDayOn);
       }
   }

   protected MouseDown(AEvent)
   {
        if (this.onMouseDown)
            this.onMouseDown(AEvent);
   }
   protected MouseUp(AEvent)
   {
        if (this.onMouseUp)
            this.onMouseUp(AEvent);
   }
   protected MouseMove(AEvent)
   {
       // Ocurrencias cuando el cursor incide
       // en el area visual del calendario.
       if(window.Event)
       {
           this.resetMouseIn(true);
           this.cursor=LocalizePoint(this.canvas,AEvent.x,AEvent.y);

           if (this.onMouseMove)
               this.onMouseMove(this.cursor);
            else this.DoMouseMove(this.cursor);
       }
   }
   protected MouseClick(AEvent)
   {    
        if (this.onClick)
            this.onClick(AEvent)
   }
   protected MouseDblClick(AEvent)
   {    
        if (this.onDblClick)
            this.onDblClick(AEvent)
   }
   
   protected MouseOut(AEvent)
   {
       // Notificación de que el cursor ha abandonado
       // el area visual del componente.
       this.resetMouseIn(false);
   }

   protected DoMouseOut(AEvent)
   {
       if (this.onMouseOut)
           this.onMouseOut(AEvent);
   }

   protected DoMouseMove(ACursor)
   {
      // Marca un día del calendario
      // sobre el que se haya el cursor del mouse.
        let ADay=this.getDayObjectAt(ACursor.x,ACursor.y);

        if (this.currentDayOn!=ADay)
            if (this.currentDayOn)
                this.currentDayOn.Highlighted=false;
      
        if (ADay!=null)
            ADay.Highlighted=true;

        this.currentDayOn=ADay;
        this.doOnHighlight();
   }

   protected ResetTrackMouse(ATrackMouse)
   {
       if (ATrackMouse!=this.trackMouse && this.canvas!=null)
       {
           if (this.trackMouse)
           {
               this.releaseCanvasEvents();
               this.cursor={x:null,y:null};
           }
           else this.setCanvasEvents();
           this.trackMouse=ATrackMouse;
       }
   }

        // Fuentes.
    protected doDrawHighlight(ADayInfo,ASize,ALineWidth)
    {
        // Dibuja el marcador de selección.
        DrawCircle( 
                    this.context!,
                    ADayInfo.Rectangle.center.x,
                    ADayInfo.Rectangle.center.y,
                    ASize,
                    ALineWidth,
                    ADayInfo.HighlightStyle,
                    "",
                    false
                );
    }

    protected doDrawActivityCount(ADayInfo:CalendarDay)
    {
        if (ADayInfo && ADayInfo.Activities>0)
        {
            let aw=(ADayInfo.Rectangle.width/4);
            let r=aw/2;
            let ax=ADayInfo.Rectangle.x+ADayInfo.Rectangle.width-aw;
            let ay=ADayInfo.Rectangle.y+ADayInfo.Rectangle.height-r;

            this.doDrawHighlight(ADayInfo,this.highlightSize,1);
            DrawCircle(this.context!,ax,ay,r,3,this.activityFillStyle,this.activityFillStyle,true);
            this.context!.fillStyle=this.activityTextStyle.Style;
            this.context!.font=this.activityTextStyle.Font;
            this.context!.fillText(String(ADayInfo.Activities),ax,ay);
        }
    }

    DrawHighlight(ADayInfo:CalendarDay)
    {
        // Intenta dibujar el marcador de 
        // seleccion sobre un dia especifico.
        this.doDrawHighlight(ADayInfo,this.highlightSize,3);
    }
    DrawActivity(ADayInfo:CalendarDay)
    {
            this.doDrawActivityCount(ADayInfo);
    }
    DoHighlightChanged(ADayInfo:CalendarDay)
    {
        this.doDrawCalendarDay(ADayInfo);
    }
    DoHolidayChanged(ADayInfo:CalendarDay)
    {
        this.doDrawCalendarDay(ADayInfo);
    }
    DoDayChanged(ADayInfo:CalendarDay)
    {
        this.doDrawCalendarDay(ADayInfo);
    }
    protected doOnChange()
    {
        if (this.onChange)
            this.onChange(this);
    }
    protected doOnHighlight()
    {
        if (this.onHighlight)
            this.onHighlight(this);
    }
    // Dias Festivos.
    protected resetHolidays()
    {
        // Actualiza los dias del mes
        // con las fechas festivas registradas.
        
        if (this.holidayCollection)
        {
            let holidays=this.holidayCollection.List(-1,this.month-1,-1);
            let holiday=null;
            let aday;
            let pos;
            for(let i=0;i<holidays.length;i++)
            {
                holiday=holidays[i];
                pos=this.getPositionByDay(holiday.Day);
                aday=this.day[pos];
                if (aday!=null)
                {
                    aday.Holiday=holiday;
                    aday.BackgroundGraphic=this.doDrawHolidayBackground;
                }
            }
        }
    }
    protected resetDayActivity(ADay:CalendarDay)
    {
        // Actualiza un día con la cantidad de
        // actividades registradas.
        if (this.activityCollection && ADay)
            ADay.Activities=this.activityCollection.GetCount(ADay.Year,ADay.Month,ADay.Day);
    }
    protected resetActivities()
    {
        // Inicia el conteo de actividades por día.
        if (this.activityCollection)
        {
            let pos,aday;
            for(let i=1;i<=this.monthLastDay;i++)
            {
                pos=this.getPositionByDay(i);
                aday=this.day[pos];
                this.resetDayActivity(aday);
            }
        }
    }
    protected resetCalendarDay(ADate:Date)
    {
        // Reinicia el status de un día en el calendario.
        let day=this.getDayByDate(ADate);
        if (day)
        {
            this.resetDayActivity(day);
            this.DoCalendarFullDraw();
        }
    }
    // Interface de Usuario --------------------------------------------------------------------------------------------------------
    // Constructor e Interface publica.
    constructor()
    {
    }
    get Holidays():IHolidayCollection|null
    {
        return this.getHolidayCollection();
    }
    set Holidays(AValue:IHolidayCollection)
    {
        if (this.setHolidayCollection(AValue))
            this.reset();
    }
    get Activities():IActivityCollection|null
    {
        return this.activityCollection;
    }
    set Activities(AValue:IActivityCollection|null)
    {
        if (this.setActivityCollection(AValue))
            this.reset();
    }
    get Year():number
    {
        return this.year;
    }
    set Year(AYear:number)
    {
        if (AYear!=this.year)
        {
            this.year=AYear;
            this.reset();
        }
    }
    get Month():number
    {
        return this.month;
    }
    set Month(AMonth:number)
    {
        if (AMonth!=this.month)
        {
            this.month=AMonth;
            this.reset();
        }
    }
    get MonthName():string
    {
        if (this.month && this.monthName)
            return this.monthName[this.month-1];
        return null;
    }

    get InitialWeekDay():number
    {
        return this.weekdayInitial;
    }

    get InitialWeekDayName():string
    {
        return this.getWeekDayNameByPosition[this.weekdayInitial];
    }

    GetWeekdayName(AIndex:number):string
    {
        if (AIndex>=0 && AIndex<7)
            return this.weekdayName[AIndex];
        return "";
    }
    SetWeekdayName(AIndex:number,AName:string)
    {
        if (AIndex>=0 && AIndex<7 && AName)
            this.weekdayName[AIndex]=AName;
    }

    GetMonthName(AMonth:number):string
    {{
        if (AMonth>=1 && AMonth<=12)
            return this.monthName[AMonth-1];
        return "";
    }}
    SetMonthName(AMonth:number,AName:string)
    {
        if (AMonth>=1 && AMonth<=12 && AName)
            this.monthName[AMonth]=AName;
    }
    set Canvas(ACanvas:HTMLCanvasElement|null)
    {
        this.resetCanvas(ACanvas);
        this.resetCanvasVariables();
        this.reset();
        this.doOnChange();
    }
    get Canvas():HTMLCanvasElement|null
    {
        return this.canvas;
    }    
    get Context():CanvasRenderingContext2D
    {
        return this.getContext();
    }
    get TrackMouse()
    {
        return this.trackMouse;
    }
    set TrackMouse(AValue)
    {
        this.ResetTrackMouse(AValue);
    }

    // Propiedades visuales.
    get DayMouseOn():CalendarDay
    {
        return this.currentDayOn;
    }

    get TextStyle():CalendarTextStyle
    {
        return this.textStyle;
    }
    get WeekDayTextStyle():CalendarTextStyle
    {
        return this.weekdayTextStyle;
    }
    get HolidayTextStyle():CalendarTextStyle
    {
        return this.holidayTextStyle;
    }
    get ActivityTextStyle():CalendarTextStyle
    {
        return this.activityTextStyle;
    }
    get NoCurrentMonthTextStyle():CalendarTextStyle
    {
        return this.noCurrentMonthTextStyle;
    }

    get HighlightWidth():number
    {
        // Devuelve valor de espesor
        // de selector de fecha.
        return this.highlightWidth;
    }
    set HighlightWidth(AValue:number)
    {
        // Fija el valor de espesor
        // de selector fecha.
        if (AValue!=this.highlightWidth)
        {
                AValue=MinMax(AValue,1,20);
                this.highlightWidth=AValue;
        }
    }
    get HighlightBehind()
    {
        // Devuelve si el selector de fecha
        // se dibuja antes o despues del contenido.
        return this.highlightBehind;
    }
    set HighlightBehind(AValue)
    {
        // Fija si el selector se dibuja
        // antes o despues del contenido de fechas.
        if (this.highlightBehind!=AValue)
        {
            this.highlightBehind=AValue;
            this.CalendarFullDraw();
        }
    }
    get BackgroundFillStyle()
    {
        return this.backgroundFillStyle;
    }

    get TextAlign():CanvasTextAlign|null
    {
        return this.textAlign;
    }
    
    get TextBaseline():CanvasTextBaseline|null
    {
        return this.textBaseline;
    }

    get HighlightSize()
    {
        return this.highlightSize;
    }

    get HighlightStyle()
    {
        return this.highlightStyle;
    }
    get HolidayFillStyle()
    {
        return this.holidayFillStyle;
    }
    get ShowActivityCount()
    {
        return this.showActivityCount;
    }
    set ShowActivityCount(AValue)
    {
        if (this.showActivityCount!=AValue)
        {
            this.showActivityCount=AValue;
            this.CalendarFullDraw();
        }
    }

    // Controles de Calendario.
    NextMonth()
    {
        let amonth=this.month+1;
        amonth=MinMax(amonth,1,12);
        this.month=amonth;
        this.reset();
        this.doOnChange();
    }
    PreviousMonth()
    {
        let amonth=this.month-1;
        amonth=MinMax(amonth,1,12);
        this.month=amonth;
        this.reset();
        this.doOnChange();
    }
    NextYear()
    {
        let ayear=this.year+1;
        ayear=MinMax(ayear,0,2999);
        this.year=ayear;
        this.reset();
        this.doOnChange();
    }

    PreviousYear()
    {
        let ayear=this.year-1;
        ayear=MinMax(ayear,0,2999);
        this.year=ayear;
        this.reset();
        this.doOnChange();
    }
    SetCurrentMonth(AYear:number,AMonth:number)
    {
        // Fija mes y año en una sola operación.
        AMonth=MinMax(AMonth,1,12);
        AYear=MinMax(AYear,1970,2099);

        if (this.month!=AMonth || this.year!=AYear)
        {
            this.month=AMonth;
            this.year=AYear;
            this.reset();
            this.doOnChange();
        }
    }
    getActivityList(ADayInfo)
    {
        if (this.activityCollection)
            return this.activityCollection.List(   
                                                ADayInfo.Year,
                                                ADayInfo.Month,
                                                ADayInfo.Day
                                            );
        return null;
    }

    refresh()
    {
        this.reset();
    }
    // Evento.
    get CurrentMonthName()
    {
        return this.GetMonthName(this.Month);
    }
    get HighlightedDay()
    {
        if (this.currentDayOn)
        {
            return {
                        day: this.currentDayOn.Day,
                        month: this.month,
                        year: this.year,
                        monthName: this.monthName[this.month-1],
                        isHoliday: this.currentDayOn ? true:false,
                        name: this.currentDayOn ? (this.currentDayOn.Holiday ? this.currentDayOn.Holiday.Name:null):null
            }
        }
        return null;
    }

    // Eventos de usuario.
    get OnChange()
    {
        return this.onChange;
    }
    set OnChange(AEvent)
    {
        this.onChange=AEvent;
    }
    get OnHighlight()
    {
        return this.onHighlight;
    }
    set OnHighlight(AEvent)
    {
        this.onHighlight=AEvent;
    }
    get OnClick()
    {
        return this.onClick;
    }
    set OnClick(AValue)
    {
        this.onClick=AValue;
    }
    get OnDblClick()
    {
        return this.onDblClick;
    }
    set OnDblClick(AValue)
    {
        this.onDblClick=AValue;
    }
    get OnMouseDown()
    {
        return this.onMouseDown;
    }
    set OnMouseDown(AEvent)
    {
        this.onMouseDown=AEvent;
    }
    get OnMouseUp()
    {
        return this.onMouseUp;
    }
    set OnMouseUp(AEvent)
    {
        this.onMouseUp=AEvent;
    }
    get OnMouseMove()
    {
        return this.onMouseMove;
    }
    set OnMouseMove(AEvent)
    {
        this.onMouseMove=AEvent;
    }

    // Interface IActivityCollectionlistener.
    ActivityWillChange(AActivity:IActivity,AProperty:string,AValue:any)
    {}
    ActivityChanged(AActivity:IActivity,AProperty:string)
    {}
    ActivityAdded(AActivity:IActivity)
    {
        this.resetCalendarDay(AActivity.Date);
    }
    ActivityRemoved(AActivity:IActivity)
    {
        this.resetCalendarDay(AActivity.Date);
    }
    ActivitiesCleared(ACollection:IActivityCollection)
    {}
}

export function CreateCalendar():ICalendar
{
    return new Calendar();
}