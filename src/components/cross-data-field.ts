export class CrossDataField {
    public type:Number = 1;
    public direction:Number|null = null;
    public answerLength:Number = 0;
    public question:String = '';
    public answer:String = '';
    public answerFields:Array<CrossDataField> = [];
    public questionFields:Array<CrossDataField> = [];
    public cross:boolean = false;
    public retry:number = 0;
}