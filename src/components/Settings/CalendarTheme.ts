import { CalendarThemeItem } from "./CalendarThemeItem";
import { CalendarCountry } from "./CalendarCountry";

export class CalendarTheme
{
    private country: CalendarCountry;
    private name:string="";
    private rootFolder:string="";
    private items = new Array<CalendarThemeItem>(12);
    protected DoCreate(AImage:string,ACaption:string,ADescription:string)
    {
        return new CalendarThemeItem(this,AImage,ACaption,ADescription);
    }
    // Interface de usuario.
    constructor (ACountry: CalendarCountry,AName:string)
    {
        this.country=ACountry;
        this.name=AName;
    }
    get Country():CalendarCountry
    {
        return this.country;
    }
    get RootFolder():string{
        return this.rootFolder;
    }
    set RootFolder(AFolder:string)
    {
        this.rootFolder=AFolder;
    }
    get Name()
    {
        return this.name;
    }
    set Name(AName:string)
    {
        this.name=AName;
    }
    GetItem(AIndex:number):CalendarThemeItem|null
    {
        if (AIndex>=1 && AIndex<=12)
            return this.items[AIndex-1];
        return null;
    }
    SetItem(AIndex:number,AImage:string,ACaption:string,ADescription:string)
    {
        if (AIndex>=1 && AIndex<=12 && !this.items[AIndex-1])
            this.items[AIndex-1]=this.DoCreate(AImage,ACaption,ADescription);
        return null;
    }
}