import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList:any=[];
  public currentQuestion:number=0;
  public points:number=0;
  counter=60;
  correctanswer:number=0;
  incorrectAnswer:number=0;
  interval$:any;
  progress:string="0";
  isQuizCompleted:boolean=false;
  isfail:boolean=false;
  constructor(private questionservice: QuestionService) {}

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startcounter();
  }
  getAllQuestions() {
    this.questionservice.getQuestionJson().subscribe((res) => {
      this.questionList=res.questions;
    });
  }
  nextQuestion(){
    this.currentQuestion++;
    this.counter=60;

  }
  previousQuestion(){
    this.currentQuestion--;


  }

  answer(currentQno:number,option:any){
    if(currentQno===this.questionList.length){
      this.isQuizCompleted=true;
      this.stopcounter();
    }
    if(option.correct){
      this.points+=10;
      this.correctanswer++;
     
      setTimeout(() => {
        this.currentQuestion++;
        this.resetcounter();
        this.getProgressPercent();
        this.ispass();
        
      }, 1000);
     
    }else{
      setTimeout(() => {
      this.currentQuestion++;
      this.incorrectAnswer++;
      this.resetcounter();
      this.getProgressPercent();
        
      }, 1000);
      this.points-=5;
      this.ispass();

    }
  }
  startcounter(){
    this.interval$=interval(1000)
    .subscribe(val=>{
      this.counter--;
      if(this.counter==0){
        this.currentQuestion++;
        this.counter=60;
        this.points-=5;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();

    },60000);

  }
  stopcounter(){
    this.interval$.unsubscribe();
    this.counter=0;

  }
  resetcounter(){
   
    this.counter=60;
    
  }

  resetQuiz(){
   this.resetcounter();
   this.getAllQuestions();
   this.points=0;
   this.counter=60;
   this.currentQuestion=0;
   this.progress="0";
  }
  getProgressPercent(){
    this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }

  ispass(){
    if(this.points>=60){
      this.isfail=false
    }else{
      this.isfail=true;
    }
  }

  
}
