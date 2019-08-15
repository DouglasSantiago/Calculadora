
    
class CalcController{

    constructor(){
        //quando tem underline na frente do atributo ele é PRIVADO(encapsulamento)
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";        
        this._displayCalcEL = document.querySelector("#display");//criou um vinculo - amarrou o elemento com a variavel
        this._dateEL = document.querySelector("#data");
        this._timeEL = document.querySelector("#hora");
        this.currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    initialize(){

        this.setDisplayDateTime();

        //função executada num intervalo de tempo
        setInterval(()=>{//arrow function
            this.setDisplayDateTime();
        }, 1000);//atualiza a cada 1 segundo - 1000 milisegundos

      /*  setTimeout(()=>{
            clearInterval(interval);
        }, 10000); */

       /* this._dateEL.innerHTML = "18/05/1995";
        this._timeEL.innerHTML = "18:00"; */

        this.setLastNumberToDisplay();
    }

    //metodo para inicializar eventos de teclado na calculadora
    initKeyBoard(){
        document.addEventListener('keyup', e=>{

            console.log(e.key);

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }

    addEventListenerAll(element, events, fn){//função para rodar cada evento por vez - click e drag
        //split separa as duas palavras pelo espaço(ou ponto, virgula) e tranforma em um array
        events.split(',').forEach(event=>{
            element.addEventListener(event, fn,false);//false é pra não contar como duas vezes qdo clicar
        });

        
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }
    clearEntry(){
        this._operation.pop();//retira o ultimo valor que tinha sido inserido no array

        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1];
     // console.log("-->",this._operation[this._operation.length - 1]);
      
        //retorna a ultima operação(sendo numero ou operador)
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
       return (['+','-','*','%','/'].indexOf(value) > -1);
        /*procura o value dentro do array
        se encontrar traz o index, senhão -1*/
        

    }

    pushOperation(value){//metodo para verificar se é um trio (numero + operador + numero)

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc(); //função responsavel pelo calculo do n+o+n
            
        }

    }

    getResult(){

        return eval(this._operation.join(""));
    }

    calc(){

        let last = "";

        this._lastOperator = this.getLastItem();//guarda o ultimo operador do array

        if(this._operation.length < 3){

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){
            

             last = this._operation.pop();//retira o ultimo elemento do array, deixando (numero + operador + numero)
            
             this._lastNumber = this.getResult();//guarda a ultima operaçao pra qdo clicar no botao igual mais de uma vez, ex: [5, "+"]
       
        }else if(this._operation.length == 3){

           
            this._lastNumber = this.getLastItem(false);//busca o ultimo numero do array
        }


        let result = this.getResult();

        if(last == '%'){//o ultimo é o simbolo de porcentagem

            result = result / 1000;

            this._operation = [result];

        }else{

            this._operation = [result];//cria um novo array, insere o n+o+n+last
            if(last) this._operation.push(last);
        }
   

        this.setLastNumberToDisplay();//metodo para mostrar no display o ultimo numero
    }

    getLastItem(isOperator = true){
        // se cahamado o metodo sem passar parametro 
        //procura onde esta o ultimo operador e guarda em lastItem
        //se passar com parametro false, tras o ultimo numero

        let lastItem;

        

        for(let i = this._operation.length - 1; i >= 0; i--){

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }
         
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);//passa false pq quer um numero

       
        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value){//add a operação no array [ONDE ESTA A LOGICA]

        //console.log('A',value,(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){//Se o ultimo valor inserido no array não for um numero...
            //se for string
            
            if(this.isOperator(value)){
                //trocar o operador
                
                this.setLastOperation(value);//chama a função que troca o operador anterior pelo ultimo que foi apertado
                
  
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();//metodo para mostrar no display o ultimo numero
            }
        }else{

            if(this.isOperator(value)){//meu valor de agora é um operador? +-*/

                this.pushOperation(value);//add no array

            }else{
                            //se for numero, tem que concatenar
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation((newValue));//add o operador no array operation
                //atualizar display

                this.setLastNumberToDisplay();//metodo para mostrar no display o ultimo numero
            }
        }
       
        
    }

    setError(){
        this.displayCalc = "ERROR";
    }

    addDot(){//metodo responsavel por add o ponto

        let lastOperation = this.getLastOperation();//verifica qual foi a ultima operação

        //essa variavel é uma estring? e dentro dessa variavel já tem um ponto? - tratamento para qdo clicarem 2x ponto
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return; 

            if(this.isOperator(lastOperation) || !lastOperation){
                //se for uma operação ou for indefinido

                this.pushOperation('0.');

            }else{
            this.setLastOperation(lastOperation.toString() + '.'); //metodo para sobrescrever a ultima operação
            }
        
        this.setLastNumberToDisplay();

    }

    execbtn(value){

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }

    }

    initButtonsEvents(){
        //querySelectorAll - pega todos os elementos #buttons e #parts iniciados pela tag "g"
       let buttons = document.querySelectorAll("#buttons > g, #parts > g");

       buttons.forEach((btn, index)=>{ //para cada botão que vc encontrar...
       /* btn.addEventListener('click', e=>{//defina um evento ao ser clicado
            console.log(btn.className.baseVal.replace("btn-",""));
        }); */
        this.addEventListenerAll(btn,'click,drag', e=>{//drag é quando clica e arrasta
            let textBtn = btn.className.baseVal.replace("btn-","");

            this.execbtn(textBtn);
       });
       
     /*  this.addEventListenerAll(btn,'mouseover,mouseup,mousedown', e=>{//drag é quando clica e arrasta
       btn.style.cursor = "pointer";
        }); */
     });
 
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
   
    }


    get displayTime(){
        //innerHTML é uma propriedade que toda vez que trabalham manipulando o DOM tem acesso a ela
        //ela significa: pega esse objeto que estou falando, coloque uma informação la dentro no formato html
        
        return this._timeEL.innerHTML;
    }

    set displayTime(value){
        return this._timeEL.innerHTML = value;
    }

    get displayDate(){
        return this._dateEL.innerHTML;
    }

    set displayDate(value){
        return this._dateEL.innerHTML = value;
    }

    get displayCalc(){//pega o valor
        return this._displayCalcEL.innerHTML;
    }

    set displayCalc(value){//coloca um novo valor
        return this._displayCalcEL.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }
    set dataAtual(value){
        this._dataAtual = value;
    }

}
