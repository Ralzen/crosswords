
import { LitElement, html, css, PropertyValueMap } from 'lit';
import { customElement } from 'lit/decorators.js';
import { CrossDataField } from '../../components/cross-data-field';

@customElement('cross-field')
export class CrossField extends LitElement {
    static styles = css`

    `;

    public answer:String = '';
    public question:String = '';
    public type:Number = 1;
    public direction:Number = 1;
    private field:HTMLDivElement;
    private paragraf:HTMLParagraphElement;
    public pointerclick = 0;
    public timer: ReturnType<typeof setTimeout> | null = null;
    public color:string = 'blue';
    //private arrowDirection:HTMLDivElement | null = null;

    constructor(recreate:CrossDataField|null = null, color:string = 'b') {
        super();
        this.color = color;
        if (recreate) {
            this.answer = recreate.answer;
            this.question = recreate.question;
            this.type = recreate.type;
            this.direction = recreate.direction ?? new Number(-1);
        }

        this.field = document.createElement('div');
        this.field.classList.add('field-editor');
        this.field.classList.add(this.color);
        this.paragraf = document.createElement('p');
        this.paragraf.classList.add('material-symbols-outlined');
        this.field.appendChild(this.paragraf);

        if (this.type == 1) {
            switch(this.direction) {
                case 0:
                    this.field.classList.add('dl');
                    break;
                case 1:
                    this.field.classList.add('d');
                    break;
                case 2:
                    this.field.classList.add('dr');
                    break;
                case 3:
                    this.field.classList.add('rd');
                    break;
                case 4:
                    this.field.classList.add('r');
                    break;
                case 5:
                    this.field.classList.add('rt');
                    break;
                case 6:
                    this.field.classList.add('randd');
                    break;
            }
            this.field.addEventListener('pointerdown', this.reveal);
        }

        if (this.type == 3) {
            this.field.classList.add('blank');
        }

        if (this.type == 2 ) {
            this.field.addEventListener('pointerdown', this.resize);
        }
    }

    updated (changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
        super.update(changedProperties);
        // if (this.arrowDirection) {
        //     this.arrowDirection.addEventListener('click', this.changeDirection);
        // }
    }

    resize = () => {
        this.field.classList.toggle('zoom');
    }

    reveal = () => {
        console.log('mam to');
        if (this.pointerclick == 0) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(this.resetTripleClick, 2500);
        }

        this.pointerclick++;

        if (this.pointerclick >= 6) {
            this.paragraf.innerText = this.answer.toString().toUpperCase();
            this.pointerclick = 0;
            if (this.timer) {
                clearTimeout(this.timer);
            }
        }
    }

    resetTripleClick = () => {
        this.pointerclick = 0;
    }

    render() {
        if (this.type == 2) {
            //this.arrowDirection = document.createElement('div');
            //this.arrowDirection.classList.add('arrow-field');

            this.paragraf.innerText = this.question.toString();
            //this.field.append(this.arrowDirection);
            this.field.classList.remove('answer');
            this.field.classList.remove('blank');
            this.field.classList.add('question');
        } else if (this.type == 1)  {
            this.paragraf.innerText = '';
            this.field.classList.remove('question');
            this.field.classList.remove('blank');
            this.field.classList.add('answer');
        } else {
            this.paragraf.innerText = '';
            this.field.classList.remove('question');
            this.field.classList.add('blank');
            this.field.classList.remove('answer');
        }

        return html`
            ${this.field}
        `;
    }

    createRenderRoot() {
        return this;
    }
}