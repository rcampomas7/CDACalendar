import { CalendarActivityBinderList } from "./CalendarActivityBinderList";

export interface ICalendarActivityBinderProvider{
    Clear();
    CreateObject():HTMLElement;
    DestroyObject(AObject:HTMLElement);
    EndListDeploy(AActivities)
    CreateSentinel();
}