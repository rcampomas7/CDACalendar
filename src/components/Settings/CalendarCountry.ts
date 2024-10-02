import { CalendarTheme } from "./CalendarTheme";

export class CalendarCountry
{
    private name:string;
    private themes=new Array<CalendarTheme>();

    constructor (AName:string)
    {
        this.name=AName;
    }
    get Name():string
    {
        return this.name;
    }
    set Name(AName:string)
    {
        this.name=AName;
    }
    get Count():number
    {
        return this.themes.length;
    }
    Add(ATheme:CalendarTheme)
    {
        if (ATheme)
            this.themes.push(ATheme);
        return this.themes.length;
    }
    Theme(AIndex:number):CalendarTheme
    {
        if (AIndex>=0 && AIndex<this.themes.length)
            return this.themes[AIndex];
        return null;
    }
}