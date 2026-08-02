function saveStudyRecord(answered, correct){

let totalAnswered =
Number(localStorage.getItem("totalAnswered")) || 0;

let totalCorrect =
Number(localStorage.getItem("totalCorrect")) || 0;


totalAnswered += answered;
totalCorrect += correct;


localStorage.setItem(
    "totalAnswered",
    totalAnswered
);

localStorage.setItem(
    "totalCorrect",
    totalCorrect
);



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


todayAnswered += answered;
todayCorrect += correct;


localStorage.setItem(
    "todayDate",
    today
);

localStorage.setItem(
    "todayAnswered",
    todayAnswered
);

localStorage.setItem(
    "todayCorrect",
    todayCorrect
);



localStorage.setItem(
    "lastStudy",
    today
);

}