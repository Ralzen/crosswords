import { CrossDataField } from "./cross-data-field";
import { CrossWord } from "./cross-word";
import { DatabaseSql } from "./database";
import { CrossDataFieldTmp } from "./cross-data-field-tmp";

export class CrossGenerator {
    addedQuestions:Array<CrossDataField> = [];
    questions:Array<CrossDataField> = [];
    //addedMasks:Array<string> = [];
    db:DatabaseSql;
    forceStop:boolean = false;
    forceInterput:boolean = false;

    successCount = 0;
    errorCount = 0;
    debug = 0;

    characters = 'abcdefghijklmnoprstuwyz';

    constructor()
    {
        this.db = DatabaseSql.getInstance();
    }

    debugStop(){
        console.log('DEBUG ' + this.debug);
        this.debug = 0;
    }

    fillCross(questions:Array<CrossDataField>, retry:number = 0):boolean
    {
        console.log('try');
        // setTimeout(() => {
        //     this.forceInterput = true;
        //     console.log('--timeout--');
        // } , 5000);
        // let excludeId = '';
        let success = true;
        questions = questions.sort(this.sortQuestionsHardness);
        this.questions = questions;

        // this.db.getWord(5, '____L', '');
        // this.db.getWord(5, '____ł', '');
        // this.db.getWord(5, 'dani_', '');
        // this.tryToFitWorm(this.questions[0]);


        for (let i = 0; i < this.questions.length; i++) {
            console.log('WORD ' + i + ', size: ' + this.questions[i].answerLength);
            this.tryToFitSnake(this.questions[i])

            if (this.forceStop) {
                break;
            }
        }
        console.log('Done');

        let correctCount = 0;
        for (let z = 0; z < this.questions.length; z++) {
            if (this.questions[z].answer != '') {
                correctCount++
            }
        }
        if (correctCount < this.questions.length) {
            console.log('Sanity check: FAILD : shoud ' + this.questions.length + ' have ' + correctCount);
            success = false;
            this.errorCount ++;

        } else {
            console.log('Sanity check: SUCCESS : shoud ' + this.questions.length + ' have ' + correctCount);
            success = true;
            this.successCount ++;

        }

        success = false;

        //questions.forEach(question => {

            // const mask = this.getMask(question.answerFields);
            // const length = question.answerLength.valueOf();
            // const word = db.getWord(length, mask, excludeId);

            // if (word.id == 0) {
            //     success = false;
            //     return;
            // }

            // this.setQuestion(question, word);
            // this.addedQuestions.push(question);
            // this.addedMasks.push(mask);

            // if(excludeId == '') {
            //     excludeId += word.id.toString()
            // } else {
            //     excludeId += ',' + word.id.toString()
            // }

        //});

        if (!success) {
            //this.clearQuestions(questions);

            if (retry < 0) {
                console.log('Retrying...');
                success = this.fillCross(questions, retry+1);
            } else {
                console.log('Success: ' +this.successCount)
                console.log('Errors: ' + this.errorCount)
            }
        }

        return success;
    }

    clearMess (cross:Array<Array<CrossDataField>>){
        for (let y = 0; y < cross.length; y++) {
            for (let x = 0; x < cross[y].length; x++) {
                if (cross[y][x].answer == '') {
                    if(cross[y][x].type == 2){
                        cross[y][x].answerFields[0].direction = -1;
                    }
                    cross[y][x].type = 3;
                    cross[y][x].direction = -1;
                }
            }
        }

        for (let y = 0; y < cross.length; y++) {
            for (let x = 0; x < cross[y].length; x++) {
                if (cross[y][x].type == 2) {
                    cross[y][x].answerFields[0].direction = cross[y][x].direction;
                    if (cross[y][x].answerFields[0].questionFields.length == 2) {
                        console.log('check');
                        if (
                            x != 0 &&
                            cross[y][x].direction == 1 &&
                            cross[y+1][x-1].type == 2 &&
                            cross[y+1][x-1].question != '' &&
                            cross[y+1][x-1].direction == 4
                        ) {
                            console.log ('down POP');
                            cross[y][x].answerFields[0].direction = 6;
                        } else if (
                            y != 0 &&
                            cross[y][x].direction == 4 &&
                            cross[y-1][x+1].type == 2 &&
                            cross[y-1][x+1].question != '' &&
                            cross[y-1][x+1].direction == 1
                        ) {
                            console.log ('down POP');
                            cross[y][x].answerFields[0].direction = 6;
                        }

                    }
                }
            }
        }
    }

    tryToFitWorm (question:CrossDataField, onlySet:CrossWord|null = null) {
        let word:CrossWord|false;
        if (onlySet) {
            word = onlySet;
        } else {
            word = this.getWord(question);
        }

        let trys = 1;
        let fit = false;
        this.debug++;

        if (this.debug % 50 == 0){
            this.debugStop();
        }

        if (word) {
            this.setQuestion(question, word);
            if (onlySet) {
                console.log('Corrected');
                return true;
            } else {
                console.log('Normal');
            }
            fit = true;
        } else {
            if (onlySet) {
                console.log('Incorrect');
                return false;
            }
        }

        let subQuestions = this.getSubQuestions(question);

        if (subQuestions.length == 0) {
            console.log('ALL DONE!');
            return true;
        }

        for (let x = 0; x < trys; x++) {
            this.shuffleArray(subQuestions);
            subQuestions.every(subQuestion => {

                if (fit) {
                    if (subQuestion.answer == '') {
                        this.tryToFitWorm(subQuestion);
                    }
                    return true;

                } else {
                    if (subQuestion.answer == '') return true;

                    this.clearQuestion(subQuestion);


                    word = this.getWord(question);

                    if (word) {
                        this.tryToFitWorm(question, word);
                        if (this.tryToFitWorm(subQuestion)) {
                            return false;
                        } else {
                            console.log('All Grandchildrens failed');
                            return true;
                        }


                    } else {
                        // if (tmpQestion) {
                        //     this.restoreQuestion(subQuestion, tmpQestion);
                        // }

                        return true;
                    }
                }

            });
        }



        console.log('All faild - no luck');
        return false;
    }

    shuffleArray(array:Array<CrossDataField>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getWord(question:CrossDataField) {
        let mask = this.getMask(question.answerFields);
        let length = question.answerLength.valueOf();
        let word = this.db.getWord(length, mask,);

        //console.log("Mask " + mask + ' = ' + word.name);

        if (word.id == 0) {
            return false;
        } else {
            return word;
        }
    }

    getSubQuestions(question:CrossDataField, empty:boolean = false) {
        let subQuestionsList:Array<CrossDataField> = [];
        question.answerFields.forEach(answer => {
            answer.questionFields.forEach(subQuestion => {
                if (subQuestion !== question) {
                    if (empty) {
                        if(subQuestion.answer == '') {
                            subQuestionsList.push(subQuestion);
                        }
                    } else {
                        subQuestionsList.push(subQuestion);
                    }
                }
            });
        });

        return subQuestionsList;
    }

    tryToFitSnake(question:CrossDataField, onlyCheck:boolean = false, mainQuestion:boolean = false):boolean {
        let deeper = false;
        if (question.retry > 2) {
            //console.log('deeper');
            question.retry = 0;
            deeper = true;
        }
        question.retry++;

        let mask = this.getMask(question.answerFields);
        let length = question.answerLength.valueOf();
        let word = this.db.getWord(length, mask);

        if (word.id == 0 || deeper) {
            if (onlyCheck) {
                return false;
            }
            //console.log('Retry');

            for (let retryCount = 0; retryCount < 5; retryCount++) {
                let multistep = 0;
                let multiQuestion:CrossDataField|null = null;
                for (let aIndex = 0; aIndex < question.answerFields.length; aIndex++) {
                    let answerField = question.answerFields[aIndex];
                    if (answerField.answer != '') {

                        for (let qIndex = 0; qIndex < answerField.questionFields.length; qIndex++) {
                            let targetQuestion:CrossDataField = answerField.questionFields[qIndex];
                            if (targetQuestion !== question) {

                                if (multistep == 0) {
                                    multistep = 1;
                                    multiQuestion = targetQuestion;
                                } else {
                                    if(multiQuestion) {
                                        multistep--;
                                        this.clearQuestion(multiQuestion);
                                        this.clearQuestion(targetQuestion);
                                        //answerField.answer = '';
                                        if (this.tryToFitSnake(targetQuestion) && this.tryToFitSnake(multiQuestion)) {
                                            if (this.tryToFitSnake(question, true)) {
                                                if (mainQuestion) {
                                                    console.log('Sloved');
                                                }
                                                question.retry = 0;
                                                return true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (multiQuestion) {
                    multistep--;
                    this.clearQuestion(multiQuestion);
                    //answerField.answer = '';
                    if ( this.tryToFitSnake(multiQuestion)) {
                        if (this.tryToFitSnake(question, true)) {
                            if (mainQuestion) {
                                console.log('Sloved');
                            }
                            question.retry = 0;
                            return true;
                        }
                    }
                }

            }
            console.log('No luck');
            question.retry = 0;
            return false;
        }

        this.setQuestion(question, word);
        return true;
    }

    tryToFitForce(i:number):boolean {
        if (this.questions[i].retry > 2) {
            if (i == 0) {
                console.log('DeadEnd TM');
                return false;
            }
            console.log('Retry deeper ' + i);
            this.clearQuestion(this.questions[i-1]);
            this.questions[i].retry = 0;

            if (!this.tryToFitForce(i-1)) {
                return false;
            } else {
                //return true;
            }

        }

        this.questions[i].retry++;

        let question = this.questions[i];
        let mask = this.getMask(question.answerFields);

        const length = question.answerLength.valueOf();
        const word = this.db.getWord(length, mask);

        if (word.id == 0) {
            if (i > 0) {
                console.log('Retry ' + i);
                if (this.tryToFitForce(i)) {
                    console.log('Sloved');
                    return true;
                } else {
                    return false;
                }
            } else {
                console.log('Cant retry first question ' + i);
                return false;
            }
        }

        // if (word.id == 0) {
        //     if ( i > 0) {
        //         console.log('Retry ' + i);
        //         this.questions[i].retry = 0;
        //         this.clearQuestion(this.questions[i-1])
        //         if (this.tryToFit(i-1)) {
        //             this.tryToFit(i);
        //             console.log('Sloved');
        //             return true;
        //         } else {
        //             console.log('Hard one - Faild');
        //             return false;
        //         }
        //     } else {
        //         console.log('Cant be done');
        //         return false;
        //     }
        // }

        this.setQuestion(this.questions[i], word);
        //this.questions[i].retry = 0;
        //this.addedMasks.push(mask);

        return true;
    }

    tryPrvious() {
        const questionToRetry = this.addedQuestions.pop();
        console.log('retry');
        console.log(questionToRetry);
        //const maskToRetry = this.addedMasks.pop();

        if (questionToRetry && questionToRetry.retry < 3) {

        }
    }

    getMask(answers:Array<CrossDataField>): string {
        let mask = '';
        answers.forEach(answer => {
            if (answer.answer == '') {
                mask += '_';
            } else {
                mask += answer.answer;
            }
        });

        return mask
    }

    setQuestion(question:CrossDataField, word:CrossWord) {
        question.answer = word.name.toLowerCase();
        question.question = this.capitalizeFirstLetter(
            word.definition[Math.floor(Math.random() * word.definition.length)]
        );

        for (let i = 0; i < question.answerFields.length; i++) {
            if (question.answerFields[i].answer == '') {
                question.answerFields[i].answer = word.name[i].toLowerCase();
            } else {
                question.answerFields[i].cross = true;
            }

        }
    }

    clearQuestion(question:CrossDataField, cache:boolean = false) {
        let tempData = new CrossDataFieldTmp();
        if (cache) {
            tempData.answer = question.answer;
            tempData.question = question.question;
            tempData.retry = question.retry;
        }

        question.answer = '';
        question.question = '';
        question.retry = 0;
        for (let i = 0; i < question.answerFields.length; i++) {
            if (question.answerFields[i].cross) {
                tempData.answerData.push(true);
                question.answerFields[i].cross = false;
            } else {
                tempData.answerData.push(question.answerFields[i].answer);
                question.answerFields[i].answer = '';
            }
        }
    }

    restoreQuestion(question:CrossDataField, tmpData:CrossDataFieldTmp) {

        question.answer = tmpData.answer;
        question.question = tmpData.question;
        question.retry = tmpData.retry;
        for (let i = 0; i < question.answerFields.length; i++) {
            if (tmpData.answerData[i] === true) {
                question.answerFields[i].cross = true;
            } else {
                question.answerFields[i].answer = String(tmpData.answerData[i]);
            }
        }
    }

    clearQuestions(questions:Array<CrossDataField>) {
        questions.forEach(question => {
            this.clearQuestion(question);
        });
    }

    sortQuestionsLength(a:CrossDataField, b:CrossDataField) {
        if ( a.answerLength < b.answerLength ){
            return -1;
        }

        if ( a.answerLength > b.answerLength ){
            return 1;
        }
        return 0;
        //return Math.floor(Math.random() * 3) - 1;
    }

    sortQuestionsHardness(a:CrossDataField, b:CrossDataField) {
        let aLen = 0;
        for (let i= 0; i < a.answerFields.length; i++) {
            if (a.answerFields[i].questionFields.length == 2) {
                aLen++;
            }
        }
        let bLen = 0;
        for (let i= 0; i < b.answerFields.length; i++) {
            if (b.answerFields[i].questionFields.length == 2) {
                bLen++;
            }
        }

        aLen = aLen/a.answerFields.length;
        bLen = bLen/b.answerFields.length;

        if ( aLen < bLen ){
            return 1;
        }

        if ( aLen > bLen ){
            return -1;
        }
        return 0;
        //return Math.floor(Math.random() * 3) - 1;
    }

    capitalizeFirstLetter(val:string) {
        return val.charAt(0).toUpperCase() + val.slice(1);
    }

}