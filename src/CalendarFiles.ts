//import { nodePolyfills } from "vite-plugin-node-polyfills";
import { IActivityCollection }
        from "./components/Activities/IActivityCollection";
import { promises as fs } from "fs";

export function LoadActivities(AFileName:string,AActivityCollection:IActivityCollection)
{
    const data = fs.readFile(AFileName);
    if (data)
    {
        let items=JSON.parse(data.toString());
        if (items)
        {
            for(let i=0;i<items.length;i++)
            {
                AActivityCollection.AddActivityDirect(
                                                        items[i].id,
                                                        items[i].definition,
                                                        items[i].date,
                                                        items[i].time,
                                                        items[i].duration,
                                                        items[i].state,
                                                        items[i].recordDate
                );
            }
        }
    }
}

export function SaveActivities(AActivityCollection:IActivityCollection)
{
    // Actualización de archivo de actividades.
    let data=AActivityCollection.FullList;
    let content=JSON.stringify(data,null,2);
    saveFile("./test.json",content);
}

function saveFile(AFileName,AContent)
{
    // Escribe un archivo en HDD local..
    // Usado para registrar actividades.
    // Cambios en configuración.
    try
    {
        //writeFileSync(AFileName,AContent);
        return true;
    }
    catch(error)
    {
        console.log(error);
    }
    return false;
}

function loadFile(AFileName)
{
    // Lee un archivo desde el HDD Local
    // Usado para cargar configuración,
    // datos de días feriados.
    let data=null;
    try
    {
        data=null;//readFileSync(AFileName,'utf8');
    }
    catch(error)
    {
        console.log(error);
        data=null;
    }
    return data;
}