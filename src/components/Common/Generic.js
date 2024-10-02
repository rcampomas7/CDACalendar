// Funciones genéricas.
export function MinMax(AValue,AMin,AMax)
{
    if (AValue<AMin)
        AValue=AMin;
    
    if (AValue>AMax)
        AValue=AMax;
    return AValue;
}

export function LocalizePoint(AObject,x,y)
{
    if (AObject)
    {
            let clientRect=AObject.getBoundingClientRect();
            let padLeft=(AObject.clientWidth-AObject.width)/2;
            let padTop=(AObject.clientHeight-AObject.height)/2;

            return {
                        x:x-clientRect.x-padLeft,
                        y:y-clientRect.y-padTop
                   }
    }
    return null;
}

function StringDate(ADate)
{
    // Se espera una fecha en el formato
    // que devuelve CastDate(ADate)
    // para rehacer una cadena.
    if (ADate)
        return ZeroLeft(ADate.year,4)+"-"+ZeroLeft(ADate.month,2)+"-"+ZeroLeft(ADate.day,2);
    return null;
}
function CastDate(ADate)
{
    // Devuelve una fecha "YYYYY-MM-DD" en una estructura.
    if (ADate)
    {
        let parts=String(ADate).split("-");
        return {
                year:Number(parts[0]),
                month:Number(parts[1]),
                day:Number(parts[2])
        }
    }
    return null;
}

export function ZeroLeft(ANumber, size) {
    let result = String(ANumber);
    while (result.length < size) result = "0" + result;
    return result;
}

export function StandardTimeToText(ADate)
{
    let atime=new Date();
    let h=atime.getHours();
    let m=atime.getMinutes();
    let mr="m";
    if (h>12)
    {
        mr="pm";
        h-=12;
    } else mr ="am";
    return ZeroLeft(h,2)+":"+ZeroLeft(m,2)+" "+mr;
}
export function TimeToText(ATime)
{
    // Hora en formato estandar.
    let atime=(ATime>1200) ? ATime-1200:ATime;
    let ameridian=(ATime>1200) ? "pm":"am";
    return ZeroLeft(Math.trunc(atime/100),2)+":"+ZeroLeft(atime%100,2)+" "+ameridian;
}
function StandardShortDate(ADate)
{
    return StandardShortDateParts(ADate.year,ADate.month,ADate.day);
}
function StandardShortDateParts(AYear,AMonth,ADay)
{
    return ZeroLeft(AYear,4)+"-"+ZeroLeft(AMonth,2)+"-"+ZeroLeft(ADay,2);
}
export function SpanishDate(ADate)
{
    if (ADate)
        return ZeroLeft(ADate.getDate(),2)+"/"+ZeroLeft(ADate.getMonth()+1,2)+"/"+ZeroLeft(ADate.getFullYear(),4);
    return null;
}

function CheckValidDate(AYear,AMonth,ADay)
{
    if (AMonth<0 || AMonth>11) return false;
    if (AYear<1970 || AYear>2199) return false;
    let l=GetMonthLastDay(AMonth);
    if (ADay<1 || ADay>l) return false;
    return true;
}

function ReduceDateToNumber(ADate)
{
    return (ADate.getFullYear()*10000)+((ADate.getMonth()+1)*100)+(ADate.getDate());
}
export function DaysBetween(ADate1,ADate2)
{
    // Calculate the difference in 
    // milliseconds between the two dates
    let differenceInMs = Math.abs(ADate2.getTime() - ADate1.getTime());
    let msInDay = 1000 * 60 * 60 * 24;
    return Math.trunc(differenceInMs / msInDay);
}

export function SpanishDateToDate(ADate)
{
    if (ADate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))
    {
        let parts=ADate.split("/");
        if (parts.length==3)
        {
            let y=Number(parts[2]);
            let m=Number(parts[1])-1;
            let d=Number(parts[0]);
            if (CheckValidDate(y,m,d))
                return new Date(y,m,d);
        }
    }
    return null;
}
function TodayString()
{
    let date=new Date();
    let d=date.getDate();
    let m=date.getMonth()+1;
    let y=date.getFullYear();
    return ZeroLeft(d,2)+"/"+ZeroLeft(m,2)+"/"+ZeroLeft(y,4);
}

export function TimeTextToTime(ATime)
{
    if (ATime.match(/^(0?[1-9]|1[012]):[0-5][0-9]( )*[apAP][mM}]$/))
    {
        let parts=ATime.split(":");
        let min=parseInt(parts[1]);
        let hour=parseInt(parts[0]);
        let m=ATime.substring(ATime.length-2);
        if (m=='p' || m=='P')
            hour+=12;
        return (hour*100)+min;
    }
    return null;
}
function IsDateBetween(ADate,AFirstDate,ALastDate)
{
    return CompareDate(ADate,AFirstDate)>=0 && CompareDate(ADate,ALastDate)<=0;
}
function CompareDate(ADate1,ADate2)
{
    let adate1=(ADate1.year*10000)+(ADate1.month*100)+ADate1.day;
    let adate2=(ADate2.year*10000)+(ADate2.month*100)+ADate2.day;
    if (adate1>adate2)
        return 1;
    else if (adate1<adate2)
        return -1;
    return 0;
}
function EqualDate(ADate1,ADate2)
{
    return CompareDate(ADate1,ADate2)==0;
}
function ValidateDate(ADate)
{
    return ADate.match(/^d{4}[-]d{2}[-]d[2]$/);
}
function LastDayOfMonth(AYear,AMonth)
{
    AMonth=MinMax(AMonth,1,12);
    AYear=MinMax(AYear,0,2999);
    return new Date(AYear,AMonth-1,0).getDate();
}
function IsPointIn(APoint,ARectangle)
{
    if (APoint && ARectangle)
    {
        if (APoint.x>=ARectangle.left && 
            APoint.x<=ARectangle.left+ARectangle.Width &&
            APoint.y>=ARectangle.top &&
            APoint.y<=ARectangle.top+ARectangle.Height)
            return true;
    }
    return false;
}

function GetMonthFirstWeekDay(AYear,AMonth)
{
    // Devuelve el día de semana del primer día del mes.
    // 0 - Domingo, 6 - Sábado.
    return new Date(AYear,AMonth-1,1).getDay();
}
function GetMonthLastDay(AYear,AMonth)
{
    // Devuelve le fecha del ultimo dia del mes.
    return new Date(AYear,AMonth,0).getDate();
}

export { GetMonthFirstWeekDay };
export { GetMonthLastDay };
export { CastDate };
export { StringDate };
export { ValidateDate};
export { StandardShortDate };
export { StandardShortDateParts };
export { IsDateBetween };
export { LastDayOfMonth };
export { EqualDate };
export { CompareDate };
export { TodayString };
export { IsPointIn };