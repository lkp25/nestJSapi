export enum WhenEventFilter{
    All = 1,
    Today,
    Tomorrow,
    ThisWeek,
    NextWeek
}

export class ListEvents{
    when? : WhenEventFilter
    page: number = 1
}