import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GridField } from './grid-field';
import { CrossDataField } from '../../components/cross-data-field';
import { CrossData } from '../../components/cross-data';

@customElement('grid-box')
export class GridBox extends LitElement {
    static styles = css`
        .grid-editor{
            display: flex;
            flex-direction: column;
            padding: 20px
        }
        .row-editor{
            display: flex;
            flex-direction: row;
            flex-wrap: wrap
        }
    `;

    public fields:Array<Array<GridField>> = [];
    public demX = 2;
    public demY = 2;
    public size = '';
    public recreateData:CrossDataField[][] | null = null;

    constructor() {
        super();

        this.fields = [];
        for (let y = 0; y < this.demY; y++) {
            let row:Array<GridField> = []
            for (let x = 0; x < this.demX; x++) {
                row.push(
                    new GridField()
                );
            }
            this.fields.push(row);
        }
    }

    updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {

        this.fields = [];
        if (this.recreateData) {
            for (let y = 0; y < this.demY; y++) {
                let row:Array<GridField> = []
                for (let x = 0; x < this.demX; x++) {
                    row.push(
                        new GridField(this.recreateData[y][x])
                    );
                }
                this.fields.push(row);
            }
        } else {
            for (let y:number = 0; y < this.demY; y++) {
                let row:Array<GridField> = []
                for (let x:number = 0; x < this.demX; x++) {
                    row.push(
                        new GridField()
                    );
                }
                this.fields.push(row);
            }
        }

        let size = this.demY * this.demX;
        if (size <= 76) {
            this.size = 'S';
        } else if (size > 76 && size < 170) {
            this.size = 'M'
        } else {
            this.size = 'L';
        }

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

    public getData() :Array<Array<CrossDataField>> {
        let fields:Array<Array<CrossDataField>> = [];

        this.fields.forEach(row => {
            let rowAr:Array<CrossDataField> = [];
            row.forEach(field => {
                rowAr.push(field.getData());
            });
            fields.push(rowAr);
        });

        return fields;
    }

    public reCreate(data:CrossData) {
        this.demX = data.x;
        this.demY = data.y;
        this.size = data.size;
        this.recreateData = data.fieldsData
        this.requestUpdate();
    }
}
