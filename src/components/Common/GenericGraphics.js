// Rutinas graficas genericas.
const angle0=DegToRad(0);
const angle360=DegToRad(360);

export function DegToRad(ADegree)
{
    // Conversión Grados en Radianes.
    return (ADegree*Math.PI)/180;
}
export function RadToDeg(ARadian)
{
    // Conversión Radianes a Grados.
    return (ARadian/Math.PI)*180;
}
export function DrawCircle(AContext,Ax,Ay,ARadius,ALineWidth,AStyle,AFillStyle,AFilled=false)
{
    // Dibuja un circulo.
    AContext.lineWidth=ALineWidth;
    AContext.strokeStyle=AStyle;
    AContext.fillStyle=AFillStyle;
    AContext.beginPath();
    AContext.arc(Ax,Ay,ARadius,angle0,angle360,false);

    if (AFilled)
        AContext.fill();
    else AContext.stroke();
}