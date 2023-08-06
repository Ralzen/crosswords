import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CrossDataField } from '../../components/cross-data-field';
import { CrossData } from '../../components/cross-data';
import { CrossField } from './cross-field';

@customElement('cross-box')
export class CrossBox extends LitElement {
    static styles = css`

        cross-box {
            padding: 20px;
        }
        .grid-editor{
            display: flex;
            flex-direction: column;

            border: 3px solid black;
        }
        .row-editor{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
        .field-editor{
            width: 60px;
            height: 60px;
            font-weight: 600;
            border: 1px solid black;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            user-select: none;
            -webkit-font-smoothing: antialiased;
        }
        cross-field {
            transform: translate3d(1, 1, 0);
            -webkit-transform: translate3d(1, 1, 0);
        }
        .question {
            font-size: 10px;
            z-index: 9;
            transform: translateZ(0) perspective(1px) scale(1.15);
            background-color: #FFFFFF;
            color:#000000;
            padding: 9px;
            backface-visibility: hidden;
        }
        .question p {
            width:100%;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            line-height: 11.5px;
            overflow-wrap: anywhere;
            -webkit-box-orient: vertical;
            user-select: none;
        }
        .answer {
            background-repeat: no-repeat;
            z-index: 8;
            color:#111111;
            font-size: 24px;
            user-select: none;
        }

        .answer.blue {
            background-color:#DBDFEA;
        }
        .answer.green {
            background-color:#DFEADB;
        }
        .answer.red {
            background-color:#F0DBDB;
        }
        .answer.yellow {
            background-color:#FFF5E4;
        }
        .answer.purple {
            background-color:#EAC5DF;
        }

        .blank {
            z-index: 7;
            background-color: #333333;
        }

        .question.zoom {
            font-size: 6px !important;
            z-index: 10 !important;
            padding: 5px 3px 5px 5px !important;
            transform: scale(2.5) translateZ(0) perspective(1px);
            filter: blur(.0px);
            backface-visibility: hidden;
            font-weight: 500;
            position: relative !important;
        }

        .question.zoom p {
            line-height: 7.0px;
            -webkit-line-clamp: 6 !important;
            filter: blur(.0px);
            backface-visibility: hidden;
        }

        .d {
            background-image: url("assets/icons/down.png");
            background-position: top;
        }
        .dl {
            background-image: url("assets/icons/down-left.png");
            background-position: right top;
        }
        .dr {
            background-image: url("assets/icons/down-right.png");
            background-position: left top;
        }

        .r {
            background-image: url("assets/icons/right.png");
            background-position: left;
        }
        .rt {
            background-image: url("assets/icons/right-top.png");
            background-position: left bottom;
        }
        .rd {
            background-image: url("assets/icons/right-down.png");
            background-position: left top;
        }
        .randd {
            background-image: url("assets/icons/down-and-right.png");
            background-position: left top;
        }

        .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 48
        }
    `;

    public fields:Array<Array<CrossField>> = [];
    public demX = 2;
    public demY = 2;
    public size = '';
    public color: string ='b';

    constructor(recreateData:CrossData, color:string = 'b') {
        super();
        this.demX = recreateData.x;
        this.demY = recreateData.y;
        this.color = color;
        let fields: Array<Array<CrossDataField>> = recreateData.fieldsData;

        this.fields = [];
        for (let y = 0; y < this.demY; y++) {
            let row:Array<CrossField> = []
            for (let x = 0; x < this.demX; x++) {
                row.push(
                    new CrossField(fields[y][x], color)
                );
            }
            this.fields.push(row);
        }
    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.update(changedProperties);
    }

    render() {
        const fieldRows = [];
        for (const row of this.fields) {
            let rowData = [];
            rowData.push(html `
            <div class="row-editor">
                ${row}
            </div>
            `);
            fieldRows.push(rowData);
        }

        return html`
        <div class="grid-editor">
            ${fieldRows}
        </div>
        `;
    }

    public reCreate(data:CrossData) {
        this.demX = data.x;
        this.demY = data.y;
        this.size = data.size;
        //this.recreateData = data.fieldsData
        this.requestUpdate();
    }

    propageteClick(x:number, y:number) {
        console.log('oki?');
        console.log(x + ' ' + y);
        console.log(this.shadowRoot?.elementsFromPoint(x,y)[1]);
        const helper:PointerEvent = new PointerEvent('pointerdown');
        if (this.shadowRoot?.elementsFromPoint(x,y)[1].nodeName == 'P') {
            this.shadowRoot?.elementsFromPoint(x,y)[2].dispatchEvent(helper);
        } else {
            this.shadowRoot?.elementsFromPoint(x,y)[1].dispatchEvent(helper);
        }

    }
}