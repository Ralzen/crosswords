import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CrossDataField } from '../../components/cross-data-field';

@customElement('grid-field')
export class GridField extends LitElement {
    static styles = css`
        .field-editor{
            width: 60px;
            height: 60px;
            border: 1px solid white;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .arrow-field {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 40px;
            height: 40px;
            background-color: #FFFFFF;
            color: #222222;
            font-size: 16px;
            cursor: pointer;
            user-select: none;
        }
        .question {
            z-index: 9;
            transform: scale(1.15);
            background-color: #118888;
        }
        .answer {
            z-index: 8;
            background-color: #99CCCC;
        }
        .arrow-row {
            width:40px;
            height:10px;
            display: flex;
            justify-content: flex-end;
            flex-direction: row;
        }
        .arrow-row-last {
            width:40px;
            height:10px;
            display: flex;
            justify-content: flex-start;
            flex-direction: row;
        }
        .arrow-mini {
            width: 10px;
            height: 10px;
            background-color: #999999;
        }
        .arrow-mini.second {
            flex:1;
        }
        .arrow-mini.info {
            flex:3;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 10px;
            height: 10px;
            background-color: #FFFFFF;
            font-size: 20px;
        }
    `;
    public type:Number = 1;
    /*
        0 - ↙
        1 - ⬇
        2 - ⤵
        3 - ↳
        4 - ➡
        5 - ↱
    */
    public direction:Number = 1;
    private field:HTMLDivElement;
    private arrowDirection:HTMLDivElement | null = null;
    private arrowRT:HTMLDivElement;
    private arrowR:HTMLDivElement;
    private arrowRD:HTMLDivElement;
    private arrowDL:HTMLDivElement;
    private arrowD:HTMLDivElement;
    private arrowDR:HTMLDivElement;


    constructor(recreate:CrossDataField|null = null) {
        super();

        if (recreate) {
            this.type = recreate.type;
            this.direction = recreate.direction ?? new Number(1);
        }

        this.field = document.createElement('div');
        this.field.classList.add('field-editor');
        this.field.addEventListener('click', this.changeType);


        this.arrowRT = document.createElement('div');
        this.arrowR = document.createElement('div');
        this.arrowRD = document.createElement('div');
        this.arrowDL = document.createElement('div');
        this.arrowD = document.createElement('div');
        this.arrowDR = document.createElement('div');

        this.arrowRT.addEventListener('click', this.arrowClick);
        this.arrowR.addEventListener('click', this.arrowClick);
        this.arrowRD.addEventListener('click', this.arrowClick);
        this.arrowDL.addEventListener('click', this.arrowClick);
        this.arrowD.addEventListener('click', this.arrowClick);
        this.arrowDR.addEventListener('click', this.arrowClick);
    }

    updated (changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.update(changedProperties);
        if (this.arrowDirection) {
            this.arrowDirection.addEventListener('click', this.changeDirection);
        }
    }

    changeType = (event:MouseEvent) =>  {
        switch(this.type) {
            case 1:
                this.type = 2;
                if(event.offsetY > 40) {
                    if (event.offsetX < 15) {
                        this.direction = 0;
                    } else if (event.offsetX >= 15 && event.offsetX < 30) {
                        this.direction = 1;
                    } else if (event.offsetX < 43)  {
                        this.direction = 2;
                    } else {
                        this.direction = 3;
                    }
                } else if(event.offsetX > 40) {
                    if (event.offsetY < 15) {
                        this.direction = 5;
                    } else if (event.offsetY >= 15 && event.offsetY < 35) {
                        this.direction = 4;
                    } else  {
                        this.direction = 3;
                    }
                }
                console.log(event.offsetX + " - " + event.offsetY);
                break;
            case 2:
                this.type = 1;
                break;
        }
        this.requestUpdate();
    }

    arrowClick = (event:Event) =>  {
        let {currentTarget} = event;
        if (currentTarget) {
            let button = (currentTarget as HTMLDivElement)
            switch(button.getAttribute('arrow-dir')) {
                case 'DL':
                    this.direction = 0;
                    break;
                case 'D':
                    this.direction = 1;
                    break;
                case 'DR':
                    this.direction = 2;
                    break;
                case 'RD':
                    this.direction = 3;
                    break;
                case 'R':
                    this.direction = 4;
                    break;
                case 'RT':
                    this.direction = 5;
                    break;
            }
            this.requestUpdate();
        }

        event.stopPropagation();
    }

    changeDirection = (event:Event) =>  {
        switch(this.direction) {
            case 0:
                this.direction = 1;
                break;
            case 1:
                this.direction = 2;
                break;
            case 2:
                this.direction = 3;
                break;
            case 3:
                this.direction = 4;
                break;
            case 4:
                this.direction = 5;
                break;
            case 5:
                this.direction = 0;
                break;
        }
        this.requestUpdate();
        event.stopPropagation();
    }

    render() {
        if (this.type == 2) {
            let arrow = '+';
            switch(this.direction) {
                case 0:
                    arrow = '↙'
                    break;
                case 1:
                    arrow = '⬇'
                    break;
                case 2:
                    arrow = '⤵'
                    break;
                case 3:
                    arrow = '↳'
                    break;
                case 4:
                    arrow = '➡'
                    break;
                case 5:
                    arrow = '↱'
                    break;
            }
            this.arrowDirection = document.createElement('div');
            this.arrowDirection.classList.add('arrow-field');

            let row1 = this.addMiniArrowRow('arrow-row', this.arrowDirection);
            let row2 = this.addMiniArrowRow('arrow-row', this.arrowDirection);
            let row3 = this.addMiniArrowRow('arrow-row', this.arrowDirection);
            let row4 = this.addMiniArrowRow('arrow-row-last', this.arrowDirection);

            let info = document.createElement('div');
            this.addMiniArrow(info, 'info', this.arrowClick, row2, arrow);

            this.addMiniArrow(this.arrowRT, 'RT', this.arrowClick, row1);
            this.addMiniArrow(this.arrowR, 'R', this.arrowClick, row2);
            this.addMiniArrow(this.arrowRD, 'RD', this.arrowClick, row3);

            this.addMiniArrow(this.arrowDL, 'DL', this.arrowClick, row4);
            this.addMiniArrow(this.arrowD, 'D', this.arrowClick, row4);
            this.addMiniArrow(this.arrowDR, 'DR', this.arrowClick, row4);


            this.field.innerHTML = '';
            this.field.append(this.arrowDirection);
            this.field.classList.remove('answer');
            this.field.classList.add('question');
        } else {
            this.field.innerHTML = '';
            this.field.classList.remove('question');
            this.field.classList.add('answer');
        }

        return html`
            ${this.field}
        `;
    }

    addMiniArrowRow(classVal:string, parentElem:HTMLDivElement){
        let row = document.createElement('div');
        row.classList.add(classVal);
        parentElem.append(row);
        return row;
    }

    addMiniArrow(elem:HTMLDivElement, arrowDir:string, action: (this: HTMLDivElement, ev: MouseEvent) => any, parentElem:HTMLDivElement, inner:string = '') {
        elem.classList.add('arrow-mini');
        if (arrowDir == 'info') {
            elem.classList.add('info');
        }
        if (arrowDir == 'R'){
            elem.classList.add('second');
        }
        elem.innerText = inner;
        elem.setAttribute('arrow-dir', arrowDir);
        elem.addEventListener('click', action);
        parentElem.append(elem);
    }

    getData(): CrossDataField
    {
        let data = new CrossDataField();
        data.type = this.type;
        data.direction = this.direction;
        data.answerLength = 0;
        data.question = '';
        data.answer = '';

        return data;
    }

}
