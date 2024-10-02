import { CalendarTheme } from "./components/Settings/CalendarTheme";
import { CalendarCountry } from "./components/Settings/CalendarCountry";

export function InitiateThemes():CalendarCountry
{
    let result:CalendarCountry|null=null;
    let theme;

    if (!result)
    {
        result = new CalendarCountry("Argentina");
        theme = new CalendarTheme(result,"Paisajes");
        theme.SetItem(1,"argentina.landscape.01.jpg","","");
        theme.SetItem(2,"argentina.landscape.02.jpg","","");
        theme.SetItem(3,"argentina.landscape.03.jpg","","");
        theme.SetItem(4,"argentina.landscape.04.jpg","","");
        theme.SetItem(5,"argentina.landscape.05.jpg","","");
        theme.SetItem(6,"argentina.landscape.06.jpg","","");
        theme.SetItem(7,"argentina.landscape.07.jpg","","");
        theme.SetItem(8,"argentina.landscape.08.jpg","","");
        theme.SetItem(9,"argentina.landscape.09.jpg","","");
        theme.SetItem(10,"argentina.landscape.10.jpg","","");
        theme.SetItem(11,"argentina.landscape.11.jpg","","");
        theme.SetItem(12,"argentina.landscape.12.jpg","","");
        theme.RootFolder="../../../settings";
        result.Add(theme);

        theme = new CalendarTheme(result,"Animales");
        theme.SetItem(1,"argentina.animal.01.jpg","","");
        theme.SetItem(2,"argentina.animal.02.jpg","","");
        theme.SetItem(3,"argentina.animal.03.jpg","","");
        theme.SetItem(4,"argentina.animal.04.jpg","","");
        theme.SetItem(5,"argentina.animal.05.jpg","","");
        theme.SetItem(6,"argentina.animal.06.jpg","","");
        theme.SetItem(7,"argentina.animal.07.jpg","","");
        theme.SetItem(8,"argentina.animal.08.jpg","","");
        theme.SetItem(9,"argentina.animal.09.jpg","","");
        theme.SetItem(10,"argentina.animal.10.jpg","","");
        theme.SetItem(11,"argentina.animal.11.jpg","","");
        theme.SetItem(12,"argentina.animal.12.jpg","","");
        theme.RootFolder="../../../settings";
        result.Add(theme);

        theme = new CalendarTheme(result,"Automoviles");
        theme.SetItem(1,"argentina.automobile.01.jpg","","");
        theme.SetItem(2,"argentina.automobile.02.jpg","","");
        theme.SetItem(3,"argentina.automobile.03.jpg","","");
        theme.SetItem(4,"argentina.automobile.04.jpg","","");
        theme.SetItem(5,"argentina.automobile.05.jpg","","");
        theme.SetItem(6,"argentina.automobile.06.jpg","","");
        theme.SetItem(7,"argentina.automobile.07.jpg","","");
        theme.SetItem(8,"argentina.automobile.08.jpg","","");
        theme.SetItem(9,"argentina.automobile.09.jpg","","");
        theme.SetItem(10,"argentina.automobile.10.jpg","","");
        theme.SetItem(11,"argentina.automobile.11.jpg","","");
        theme.SetItem(12,"argentina.automobile.12.jpg","","");
        theme.RootFolder="../../../settings";
        result.Add(theme);
    }
    return result;
}


