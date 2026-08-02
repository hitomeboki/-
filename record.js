function saveAnswer(correct){

let totalAnswered =
Number(localStorage.getItem("totalAnswered")) || 0;

let totalCorrect =
Number(localStorage.getItem("totalCorrect")) || 0;


totalAnswered++;

if(correct){
    totalCorrect++;
}


localStorage.setItem(
    "totalAnswered",
    totalAnswered
);

localStorage.setItem(
    "totalCorrect",
    totalCorrect
);

}

function saveToday(correct){

const today =
new Date().toLocaleDateString("ja-JP");


let savedDate =
localStorage.getItem("todayDate");


let todayAnswered =
Number(localStorage.getItem("todayAnswered")) || 0;


let todayCorrect =
Number(localStorage.getItem("todayCorrect")) || 0;


if(savedDate !== today){

    todayAnswered = 0;
    todayCorrect = 0;

}


todayAnswered++;


if(correct){
    todayCorrect++;
}


localStorage.setItem("todayDate",today);

localStorage.setItem(
"todayAnswered",
todayAnswered
);


localStorage.setItem(
"todayCorrect",
todayCorrect
);


}