export class CalendarTextStyle
{
    private font:   string;
    private style:  string;

    // Interface de usuario.
    constructor (AFont:string,AStyle:string)
    {
        this.font=AFont;
        this.style=AStyle;
    }
    get Font():string{
        return this.font;
    }
    get Style():string{
        return this.style;
    }
}