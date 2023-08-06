import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './cross-styles';
import { styles as sharedStyles } from '../../styles/shared-styles'
import { CrossGenerator } from '../../components/cross-generator';
import { CrossProcessor } from '../../components/cross-processor';
import { DatabaseSql } from '../../components/database';
import { CrossData } from '../../components/cross-data';
import { CrossDataField } from '../../components/cross-data-field';
import { CrossBox } from './cross-box';

@customElement('app-cross')
export class AppCross extends LitElement {
    static styles = [
      sharedStyles,
      styles
    ]
    @property()
    size:string = 'M';
    @property()
    difficulty:number = 25;
    back:HTMLDivElement;

    generator:CrossGenerator;
    procesor:CrossProcessor;
    db:DatabaseSql;
    grid:CrossBox | null = null;
    loading:HTMLDivElement | null = null;
    color:string = 'blue';

    constructor() {
        super();
        this.db = DatabaseSql.getInstance();
        this.generator = new CrossGenerator();
        this.procesor = new CrossProcessor();
        this.db.onReady(this.getReadyProcess);

        this.back = document.createElement('div');

        switch(Math.floor(Math.random()*5)) {
            case 0:
                this.color = 'blue';
            break;
            case 1:
                this.color = 'green';
            break;
            case 2:
                this.color = 'red';
            break;
            case 3:
                this.color = 'yellow';
            break;
            case 4:
                this.color = 'purple';
            break;
        }
        this.back.classList.add('back-cross');
        this.back.classList.add(this.color);
    }

    getReadyProcess = () => {
        setTimeout(this.loadingInit, 100);
    }

    loadingInit = () => {
        const frontElem:HTMLDivElement = (this.renderRoot.querySelector( '.front-cross' ) as HTMLDivElement);
        this.loading = document.createElement('div');
        this.loading.classList.add('loading');
        this.loading.innerText = "GENERUJĘ KRZYŻÓWKĘ..."
        frontElem.appendChild(this.loading);
        setTimeout(this.startProcess, 100)
    }

    startProcess = () => {
        this.db.difficulty = this.difficulty.valueOf() - 0;
        console.log(this.difficulty.valueOf() - 0);
        const data:CrossData = this.db.getTemplate(this.size);
        const questions:Array<CrossDataField> = this.procesor.processData(data);
        this.generator.fillCross(questions);
        this.generator.clearMess(data.fieldsData);
        //this.debugPrint(data);
        const frontElem:HTMLDivElement = (this.renderRoot.querySelector( '.front-cross' ) as HTMLDivElement);
        if (this.loading) {
            frontElem.removeChild(this.loading);
        }
        this.grid = new CrossBox(data, this.color);
        this.requestUpdate();
    }



    debugPrint(data:CrossData) {
        for (let y = 0; y < data.fieldsData.length; y++) {
            let row = '';
            for (let x = 0; x < data.fieldsData[y].length; x++) {
                if (data.fieldsData[y][x].type == 1) {
                    if (data.fieldsData[y][x].answer == '') {
                        row += '-\t';
                    } else {
                        row += data.fieldsData[y][x].answer + '\t';
                    }
                } else {
                    row += '#\t';
                }
            }
            console.log(row);
        }
    }





    async firstUpdated() {
        const paintCanvas:HTMLCanvasElement = (this.renderRoot.querySelector( '.js-paint' ) as HTMLCanvasElement);
        const frontElem:HTMLDivElement = (this.renderRoot.querySelector( '.front-cross' ) as HTMLDivElement);

        //const naviElem:HTMLDivElement = (this.renderRoot.querySelector( '.navi-cross' ) as HTMLDivElement);
        const body = document.querySelector( 'html' );
        let lineWidth = 0.5;
        let lineColor = "#000090";


        if (!paintCanvas || !body) {
            return;
        }

        const trueW = paintCanvas.getBoundingClientRect().width;
        const trueH = paintCanvas.getBoundingClientRect().height;

        paintCanvas.width = trueW;
        paintCanvas.height  = trueH;

        const context = paintCanvas.getContext( '2d' );

        if (!context) {
            return;
        }

        context.lineCap = 'round';
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;

        const colorPickerBlack = this.renderRoot.querySelector( '.js-color-picker-black');
        const colorPickerBlue = this.renderRoot.querySelector( '.js-color-picker-blue');
        const colorPickerGum = this.renderRoot.querySelector( '.js-color-picker-gum');

        if (!colorPickerBlack || !colorPickerBlue || !colorPickerGum) {
            return;
        }

        colorPickerBlack.addEventListener( 'click', () => {
            lineColor = "#000000";
            lineWidth = 0.5;
        } );
        colorPickerBlue.addEventListener( 'click', () => {
            lineColor = "#000090";
            lineWidth = 0.5;
        } );
        colorPickerGum.addEventListener( 'click', () => {
            lineColor = "#FFFFFF";
            lineWidth = 6;
        } );


        let x = 0, y = 0;
        let isMouseDown = false;
        //let targetId:string|null = null;

        const stopDrawing = (event:PointerEvent) => {
            if ( isMouseDown && event.pointerType === 'pen') {
                isMouseDown = false;
            }
        }
        const startDrawing = (event:PointerEvent) => {
            if (event.pointerType === 'pen') {
                isMouseDown = true;
                [x, y] = [event.offsetX, event.offsetY];
            }

            if (this.grid) {
                this.grid.propageteClick(event.x, event.y);
            }
            //event.preventDefault();
            //return;
        }
        const drawLine = (event:PointerEvent) => {
            if ( isMouseDown && event.pointerType === 'pen') {
                const newX = event.offsetX;
                const newY = event.offsetY;
                //logElem.innerText += event.tiltX + " - " + event.tiltY + " | ";
                context.lineWidth = lineWidth + (Math.abs(event.tiltX) / 90) + (Math.abs(event.tiltY) / 90);
                context.strokeStyle = lineColor;
                if (lineColor == "#FFFFFF") {
                    context.globalCompositeOperation="destination-out";
                    context.moveTo( x, y );
                    context.arc(newX,newY,8,0,Math.PI*2,false);
                    context.fill();
                } else {
                    context.globalCompositeOperation="source-over";
                    context.beginPath();
                    context.moveTo( x, y );
                    context.lineTo( newX, newY );
                    context.stroke();
                    //[x, y] = [newX, newY];
                }
                x = newX;
                y = newY;
            }
        }

        paintCanvas.addEventListener( 'pointerdown', startDrawing );
        paintCanvas.addEventListener( 'pointermove', drawLine );
        paintCanvas.addEventListener( 'pointerup', stopDrawing );
        paintCanvas.addEventListener( 'pointerleave', stopDrawing );

        this.stopDefault(paintCanvas);
        this.stopDefault(frontElem);
        //this.stopDefault(naviElem, false, true);

        //body.addEventListener('touchstart', this.prevent);
        body.addEventListener('mousedown', this.prevent);
        //body.addEventListener('touchmove', this.prevent);
        body.addEventListener('mousemove', this.prevent);
        //body.addEventListener('touchend', this.prevent);
        //body.addEventListener('touchleave', this.prevent);
        body.addEventListener('mouseup', this.prevent);
    }

    stopDefault(elem:HTMLElement, preventPointer:boolean = false, options:boolean | AddEventListenerOptions | undefined = undefined) {
        elem.addEventListener('touchstart', this.prevent, options);
        elem.addEventListener('mousedown', this.prevent, options);
        elem.addEventListener('touchmove', this.prevent, options);
        elem.addEventListener('mousemove', this.prevent, options);
        elem.addEventListener('touchend', this.prevent, options);
        elem.addEventListener('touchleave', this.prevent, options);
        elem.addEventListener('mouseup', this.prevent, options);

        if (preventPointer) {
            elem.addEventListener( 'pointerdown', this.prevent, options);
            elem.addEventListener( 'pointermove', this.prevent, options );
            elem.addEventListener( 'pointerup', this.prevent, options );
            elem.addEventListener( 'pointerleave', this.prevent, options );
        }
    }

    prevent (event:Event) {
        event.preventDefault();
    }




    render() {
        return html`
            <div class="main-cross">
                ${this.back}
                <div class="front-cross"> ${this.grid ?? nothing}</div>
                <canvas class="js-paint paint-canvas" width="100%" height="100%"></canvas>

                <div class="navi-cross">
                    <div class="new-cross">
                        <sl-button class="back-button" href="${(import.meta as any).env.BASE_URL}">
                            NOWA
                        </sl-button>
                    </div>
                    <div class="info-box"> </div>
                    <div class="tools-cross">
                        <input type="button" class="js-color-picker-black color-picker">
                        <input type="button" class="js-color-picker-blue color-picker">
                        <input type="button" class="js-color-picker-gum color-picker">
                    </div>
                </div>
            </div>
        `;
    }
}
