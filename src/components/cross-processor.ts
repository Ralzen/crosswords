import { CrossData } from "./cross-data";
import { CrossDataField } from "./cross-data-field";

export class CrossProcessor {

    fields:Array<Array<CrossDataField>> = [];

    constructor()
    {

    }

    processData(data:CrossData):Array<CrossDataField> {
        this.fields = data.fieldsData;
        let questions:Array<CrossDataField> = []
        for (let y = 0; y < data.fieldsData.length; y++) {
            for (let x = 0; x < data.fieldsData[y].length; x++) {
                if (data.fieldsData[y][x].type == 2) {
                    this.filQuestionInfo(x, y, data.fieldsData[y][x]);
                    questions.push(data.fieldsData[y][x]);
                } else {
                    data.fieldsData[y][x].direction = -1;
                }
            }
        }

        for (let y = 0; y < data.fieldsData.length; y++) {
            for (let x = 0; x < data.fieldsData[y].length; x++) {
                if (data.fieldsData[y][x].type == 2) {
                    data.fieldsData[y][x].answerFields[0].direction = data.fieldsData[y][x].direction;
                }
            }
        }
        return questions;
    }

    private filQuestionInfo (x:number, y:number, question:CrossDataField) {
        switch(question.direction) {
            case 0:
                this.downAnalise(x-1, y, question);
                break;
            case 1:
                this.downAnalise(x, y+1, question);
                break;
            case 2:
                this.downAnalise(x+1, y, question);
                break;
            case 3:
                this.rightAnalise(x, y+1, question);
                break;
            case 4:
                this.rightAnalise(x+1, y, question);
                break;
            case 5:
                this.rightAnalise(x, y-1, question);
                break;
        }
    }

    private rightAnalise(startX:number, startY:number, question:CrossDataField) {
        question.answerFields = [];
        let x = startX;
        let y = startY;
        do {
            this.fields[y][x].questionFields.push(question);
            question.answerFields.push(this.fields[y][x]);
            x++;
        } while (this.fields[y] && this.fields[y][x] && this.fields[y][x].type == 1)

        question.answerLength = question.answerFields.length;

    }

    private downAnalise(startX:number, startY:number, question:CrossDataField) {
        question.answerFields = [];
        let x = startX;
        let y = startY;
        do {
            this.fields[y][x].questionFields.push(question);
            question.answerFields.push(this.fields[y][x]);
            y++;
        } while (this.fields[y] && this.fields[y][x] && this.fields[y][x].type == 1)

        question.answerLength = question.answerFields.length;
    }
}