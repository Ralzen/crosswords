import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GridBox } from './grid-box';
import { styles } from './editor-styles';
import { styles as sharedStyles } from '../../styles/shared-styles'
import { CrossData } from '../../components/cross-data';
import { DatabaseSql } from '../../components/database';

@customElement('app-editor')
export class AppEditor extends LitElement {
    static styles = [
        sharedStyles,
        styles
    ]


    public sizeX:HTMLInputElement;
    public sizeY:HTMLInputElement;
    public refreshButton:HTMLButtonElement;
    public saveButton:HTMLButtonElement;
    public downloadButton:HTMLButtonElement;
    public testButton:HTMLButtonElement;
    public fieldsGrid:GridBox;

    public db:DatabaseSql;

    constructor() {
        super();
        this.fieldsGrid = new GridBox();
        this.refreshButton = document.createElement('button');
        this.refreshButton.innerText = "Nowa";
        this.saveButton = document.createElement('button');
        this.saveButton.innerText = "Zapisz";
        this.downloadButton = document.createElement('button');
        this.downloadButton.innerText = "Pobierz";
        this.testButton = document.createElement('button');
        this.testButton.innerText = "Test";
        this.sizeX = document.createElement('input');
        this.sizeX.type = "number";
        this.sizeY = document.createElement('input');
        this.sizeY.type = "number";

        this.refreshButton.addEventListener('click', this.refresh);
        this.saveButton.addEventListener('click', this.save);
        this.downloadButton.addEventListener('click', this.download);
        this.testButton.addEventListener('click', this.testAction);

        this.db = DatabaseSql.getInstance();
    }

    refresh = () =>  {
        this.fieldsGrid.demX = parseInt(this.sizeX.value);
        this.fieldsGrid.demY = parseInt(this.sizeY.value);
        this.fieldsGrid.recreateData = null;
        this.fieldsGrid.requestUpdate();
    }

    save = () =>  {
        let gridData = new CrossData();
        gridData.fieldsData = this.fieldsGrid.getData();
        gridData.size = this.fieldsGrid.size;
        gridData.x = this.fieldsGrid.demX;
        gridData.y = this.fieldsGrid.demY;
        this.db.addTemplate(gridData);
    }

    download = () =>  {
        this.db.saveDb();
    }

    testAction = () =>  {
        this.db.setWordPopular();
    }

    render() {
        let header = html`<app-header ?enableBack="${true}"></app-header>`;

        let main = html`
        <main class="main">
            ${this.sizeX}
            ${this.sizeY}
            ${this.refreshButton}
            ${this.saveButton}
            ${this.downloadButton}
            ${this.testButton}
            ${this.fieldsGrid}
        </main>
        `;

        return  html`
            ${header}
            ${main}
        `;
    }
}