import {CalendarTheme} from "./CalendarTheme.ts";

export class CalendarThemeItem
{
    private theme:CalendarTheme;
    private image:string="";
    private caption:string="";
    private description:string="";

    constructor (ATheme:CalendarTheme,AImage:string,ACaption:string,ADescription:string)
    {
        this.theme=ATheme;
        this.image=AImage;
        this.caption=ACaption;
        this.description=ADescription;
    }
    get Theme():CalendarTheme
    {
        return this.theme;
    }
    get Image():string
    {
        let aimage=this.image;
        if (aimage)
        {
            if (this.theme)
                aimage=this.theme.RootFolder+"\/"+aimage;
            return aimage;
        }
        return "";
    }
    get Caption():string
    {
        return this.caption;
    }
    get Description():string
    {
        return this.description;
    }
}