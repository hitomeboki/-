// =========================
// Supabase
// =========================

const SUPABASE_URL =
"https://atntpiskoizpysukygcb.supabase.co";

const SUPABASE_KEY =
"ここに自分のPublishable keyを貼る";


// ユーザー識別用ID
let userId =
localStorage.getItem("userId");

if(!userId){

    userId =
    crypto.randomUUID();

    localStorage.setItem(
        "userId",
        userId
    );

}


// Supabaseへ学習記録を送信
async function sendToSupabase(answered, correct){

    try{

        await fetch(
            `${SUPABASE_URL}/rest/v1/study_records`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({

                    user_id: userId,
                    mode: "unknown",
                    questions: answered,
                    correct: correct,
                    accessed_at: new Date().toISOString()

                })

            }
        );

    }catch(error){

        console.log(
            "Supabase送信エラー:",
            error
        );

    }

}

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


    // 最終学習日
    localStorage.setItem(
        "lastStudy",
        today
    );


    // =========================
    // 連続学習日数
    // =========================

    let streak =
    Number(localStorage.getItem("streak")) || 0;

    let bestStreak =
    Number(localStorage.getItem("bestStreak")) || 0;

    let lastStudyDate =
    localStorage.getItem("lastStudyDate");


    // 今日初めて勉強した場合だけ更新
    if(lastStudyDate !== today){

        const yesterday = new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        const yesterdayString =
        yesterday.toLocaleDateString("ja-JP");


        // 昨日も勉強していた場合
        if(lastStudyDate === yesterdayString){

            streak++;

        }else{

            // 連続が途切れていた場合
            streak = 1;

        }


        // 最高記録更新
        if(streak > bestStreak){

            bestStreak = streak;

        }


        localStorage.setItem(
            "streak",
            streak
        );

        localStorage.setItem(
            "bestStreak",
            bestStreak
        );

        localStorage.setItem(
            "lastStudyDate",
            today
        );

    }


    // =========================
    // 学習カレンダー用
    // =========================

    let studyData =
    JSON.parse(localStorage.getItem("studyData")) || {};

    const now = new Date();

    const dateString =
    `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;


    studyData[dateString] =
    (studyData[dateString] || 0) + answered;


    localStorage.setItem(
        "studyData",
        JSON.stringify(studyData)
    );

    sendToSupabase(answered, correct);

}