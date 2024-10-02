import { CalendarCountry } 
        from "./components/Settings/CalendarCountry";

const settingsForm=document.getElementById("settingsForm");;
const settingsFormButton=document.getElementById("settingsButton");;

export function InitiateSettings()
{
    LoadSettings();
    InitiateSettingsForm();
}

function LoadSettings()
{
    
}

function InitiateSettingsForm()
{
    settingsFormButton.addEventListener("click",event=>{
        event.preventDefault();
        ShowSettingsForm();
    })
}

export function InitiateThemeList(ACountry:CalendarCountry)
{
    let themeList:HTMLSelectElement=<HTMLSelectElement>document.getElementById("themes");
    if (themeList && ACountry)
    {
        let option:HTMLOptionElement;
        for(let i=0;i<ACountry.Count;i++)
        {
            option=document.createElement("option");
            option.innerText=ACountry.Theme(i).Name;
            themeList.add(option);
        }
    }
}

function ShowSettingsForm()
{
    settingsForm.style.display="block";
}

export function CloseSettingsForm()
{
    settingsForm.style.display="none";
}