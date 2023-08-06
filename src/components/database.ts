//import initSqlJs from 'sql-wasm.js';
import initSqlJs, { Database } from 'sql.js';
import { CrossData } from './cross-data';
import { CrossDataField } from './cross-data-field';
import { CrossWord } from './cross-word';

const SQL = await initSqlJs({
    locateFile: () => `https://sql.js.org/dist/sql-wasm.wasm`
});

export class DatabaseSql {

    static instance:DatabaseSql;
    db:Database|null = null;
    status:boolean = false;
    onReadyCallbacks:Array<Function> = [];
    difficulty = 25; // 3, 8, 25, 50, 125

    static getInstance(): DatabaseSql {
        if (this.instance) {
            return this.instance
        } else {
            this.instance = new DatabaseSql();
            return this.instance
        }
    }

    constructor() {
        this.initConnection()
    }

    initConnection() {
        fetch('/cross.db3')
            .then(response => {
                return response.arrayBuffer();
            })
            .then(buffer => {
                this.dbLoaded(buffer)
            })
            .catch(error => {
                console.log(error);
            });

    }

    addTemplate(template:CrossData):Boolean {
        if (this.db) {
            const data = JSON.stringify(template.fieldsData);
            console.log(data)
            this.db.run("INSERT INTO template (size, data, x, y) VALUES (?,?,?,?)", [template.size, data, template.x.toString(), template.y.toString()]);
            return true;
        } else {
            return false;
        }
    }

    getWord(length:number, mask:string):CrossWord {
        let crossWord = new CrossWord();

        if (this.db) {
            // const stmtCount = this.db.prepare("SELECT COUNT(*) FROM word WHERE length=$length AND upper(name) LIKE $mask AND id NOT IN($excludeId)");
            // const dataCount = stmtCount.getAsObject({$length:length, $mask:mask, $excludeId:excludeId});
            // dataCount.mask = mask;

            const stmt = this.db.prepare("SELECT * FROM (SELECT * FROM word WHERE length=$length AND upper(name) LIKE $mask ORDER BY RANDOM() LIMIT $difficulty) ORDER BY popular DESC LIMIT 1");
            //const stmt = this.db.prepare("SELECT * FROM word WHERE length=$length AND upper(name) LIKE $mask AND id NOT IN($excludeId) ORDER BY RANDOM() LIMIT 1");
            const data = stmt.getAsObject({$length: length, $mask: mask, $difficulty: this.difficulty});

            // dataCount.word = data.name;
            // console.log(dataCount);
            if (
                typeof data.name === 'string' &&
                typeof data.length === 'number' &&
                typeof data.id === 'number' &&
                typeof data.definition === 'string'
                ) {
                crossWord.id = data.id;
                crossWord.name = data.name;
                crossWord.length = data.length;
                const definitions = JSON.parse(data.definition);

                if (definitions instanceof Array) {
                    crossWord.definition = definitions;
                }
            }
        }

        return crossWord;
    }


    setWordPopular() {

        if (this.db) {



            //const data = stmt.getAsObject({$length:length, $mask:mask, $excludeId:excludeId});
            let something = false;
            do {
                something = false
                const stmt = this.db.prepare("SELECT * FROM word WHERE popular=0 ORDER BY RANDOM() LIMIT 1000");
                while (stmt.step()) {
                    something = true;
                    const data = stmt.getAsObject();
                    //console.log(stmt.getAsObject());
                    if (typeof data.definition === 'string' && typeof data.id === 'number') {
                        const definitions:Array<string> = JSON.parse(data.definition);
                        const popular = definitions.length;
                        data.id;
                        console.log(popular);
                        this.db.run("UPDATE word SET popular = ? WHERE id = ?", [popular, data.id]);
                    }
                }
            } while(something);


            // if (
            //     typeof data.name === 'string' &&
            //     typeof data.length === 'number' &&
            //     typeof data.id === 'number' &&
            //     typeof data.definition === 'string'
            //     ) {
            //     crossWord.id = data.id;
            //     crossWord.name = data.name;
            //     crossWord.length = data.length;
            //     const definitions = JSON.parse(data.definition);

            //     if (definitions instanceof Array) {
            //         crossWord.definition = definitions;
            //     }
            // }
        }

        //return crossWord;
    }

    getTemplate(size:string):CrossData {
        let crossData = new CrossData();

        if (this.db) {
            //const stmt = this.db.prepare("SELECT * FROM template WHERE size=$size ORDER BY RANDOM() LIMIT 1");
            const stmt = this.db.prepare("SELECT * FROM template WHERE size=$size ORDER BY id DESC LIMIT 1");
            const data =stmt.getAsObject({$size:size});

            if (
                typeof data.size === 'string' &&
                typeof data.data === 'string' &&
                typeof data.x === 'number' &&
                typeof data.y === 'number'
                ) {
                crossData.size = data.size;
                crossData.x = data.x;
                crossData.y = data.y;
                const fieldsData = JSON.parse(data.data);

                let fields:Array<Array<CrossDataField>> = [];
                if (fieldsData instanceof Array) {
                    fieldsData.forEach(row => {
                        let fieldsRow:Array<CrossDataField> = [];
                        if (row instanceof Array) {
                            row.forEach(field => {
                                fieldsRow.push(Object.assign(new CrossDataField(), field))
                            });
                            fields.push(fieldsRow);
                        }
                    });
                }

                crossData.fieldsData = fields;
            }
        }

        return crossData;
    }

    dbLoaded(buffer:ArrayBuffer) {
        const dbAsUint8Array = new Uint8Array(buffer);
        this.db = new SQL.Database(dbAsUint8Array);
        console.log('SQL ready');
        this.setReady();
    }

    setReady() {
        this.status = true;
        while (this.onReadyCallbacks.length) {
            let action = this.onReadyCallbacks.pop();
            if (action) {
                action();
            }
        }
    }

    onReady(callback:Function){

        if (this.status) {
            callback();
        } else {
            this.onReadyCallbacks.push(callback);
        }
    }

    saveDb() {
        if (this.db) {
            const dbData =  this.db.export();
            this.download(dbData, 'cross.db3', 'text/plain');
        }
    }

    private download(data: BlobPart, filename: string, type: string) {
        let file = new Blob([data], {type: type});

        let a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);

    }
}