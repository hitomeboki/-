// =========================
// Supabase
// =========================

const SUPABASE_URL =
"https://atntpiskoizpysukygcb.supabase.co";

const SUPABASE_KEY =
"sb_publishable_y1wlMl-CRMTt-6us0M-P4Q_8OPouULn";


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

// =========================
// 苦手克服記録
// =========================

async function sendWeakOvercomeToSupabase(
    question,
    category
){

    const record = {

        id:
            crypto.randomUUID(),

        user_id:
            userId,

        question:
            question,

        category:
            category,

        mode:
            "苦手克服",

        created_at:
            new Date().toISOString()

    };

    try{

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/weak_overcome_records`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Prefer":
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(record)
                }
            );

        if(!response.ok){

            throw new Error(
                "Supabase送信失敗: " +
                response.status
            );

        }

        return true;

    }catch(error){

        console.error(
            "苦手克服記録エラー:",
            error
        );

        // 未送信記録として保存
        let pendingRecords =
            JSON.parse(
                localStorage.getItem(
                    "pendingWeakOvercomeRecords"
                )
            ) || [];

        pendingRecords.push(record);

        localStorage.setItem(
            "pendingWeakOvercomeRecords",
            JSON.stringify(
                pendingRecords
            )
        );

        return false;
    }
}

// Supabaseへ学習記録を送信
async function sendToSupabase(
    answered,
    correct,
    mode,
    accessedAt
){
    const record = {
        id: crypto.randomUUID(),
        user_id: userId,
        mode: mode,
        questions: answered,
        correct: correct,
        accessed_at: accessedAt
    };

    try{

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/study_records`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "apikey":SUPABASE_KEY,
                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,
                    "Prefer":"return=minimal"
                },

                body:JSON.stringify(record)
            }
        );

        if(!response.ok){
            throw new Error(
                "Supabase送信失敗: " +
                response.status
            );
        }

        return true;

    }catch(error){

        console.error(
            "Supabase送信エラー:",
            error
        );

        // 送信できなかった記録を端末に保存
        let pendingRecords =
            JSON.parse(
                localStorage.getItem(
                    "pendingStudyRecords"
                )
            ) || [];

        pendingRecords.push(record);

        localStorage.setItem(
            "pendingStudyRecords",
            JSON.stringify(pendingRecords)
        );

        return false;
    }
}

// =========================
// 未送信の学習記録を再送
// =========================

async function sendPendingStudyRecords(){

    let pendingRecords =
        JSON.parse(
            localStorage.getItem(
                "pendingStudyRecords"
            )
        ) || [];

    if(pendingRecords.length === 0){
        return;
    }

    const remainingRecords = [];

    for(const record of pendingRecords){

        try{

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/study_records`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json",
                        "apikey":SUPABASE_KEY,
                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,
                        "Prefer":"return=minimal"
                    },

                    body:JSON.stringify(record)
                }
            );

            if(!response.ok){
                remainingRecords.push(record);
            }

        }catch(error){

            remainingRecords.push(record);

        }
    }

    localStorage.setItem(
        "pendingStudyRecords",
        JSON.stringify(remainingRecords)
    );
}

sendPendingStudyRecords();

// =========================
// 未送信の回答記録を再送
// =========================

async function sendPendingAnswerRecords(){

    let pendingRecords =
        JSON.parse(
            localStorage.getItem(
                "pendingAnswerRecords"
            )
        ) || [];

    if(pendingRecords.length === 0){
        return;
    }

    const remainingRecords = [];

    for(const record of pendingRecords){

        try{

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/answer_records`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Prefer":
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(record)
                }
            );

            if(!response.ok){

                remainingRecords.push(
                    record
                );

            }

        }catch(error){

            remainingRecords.push(
                record
            );

        }
    }

    localStorage.setItem(
        "pendingAnswerRecords",
        JSON.stringify(
            remainingRecords
        )
    );
}

sendPendingAnswerRecords();

// =========================
// 未送信の苦手克服記録を再送
// =========================

async function sendPendingWeakOvercomeRecords(){

    let pendingRecords =
        JSON.parse(
            localStorage.getItem(
                "pendingWeakOvercomeRecords"
            )
        ) || [];

    if(pendingRecords.length === 0){
        return;
    }

    const remainingRecords = [];

    for(const record of pendingRecords){

        try{

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/weak_overcome_records`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY,

                        "Prefer":
                            "return=minimal"
                    },

                    body:
                        JSON.stringify(record)
                }
            );

            if(!response.ok){

                remainingRecords.push(
                    record
                );

            }

        }catch(error){

            remainingRecords.push(
                record
            );

        }
    }

    localStorage.setItem(
        "pendingWeakOvercomeRecords",
        JSON.stringify(
            remainingRecords
        )
    );
}

sendPendingWeakOvercomeRecords();

function saveStudyRecord(answered, correct, mode){

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

    const accessedAt = new Date().toISOString();

sendToSupabase(
    answered,
    correct,
    mode,
    accessedAt
);

}

async function sendAnswerToSupabase(
    question,
    category,
    isCorrect,
    mode
){

    const record = {

        id:
            crypto.randomUUID(),

        user_id:
            userId,

        mode:
            mode,

        question:
            question,

        category:
            category,

        is_correct:
            isCorrect,

        created_at:
            new Date().toISOString()

    };

    try{

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/answer_records`,
            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY,

                    "Prefer":
                        "return=minimal"
                },

                body:
                    JSON.stringify(record)
            }
        );

        if(!response.ok){

            throw new Error(
                "Supabase送信失敗: " +
                response.status
            );

        }

        return true;

    }catch(error){

        console.error(
            "answer_records送信エラー:",
            error
        );

        // 未送信記録として保存
        let pendingRecords =
            JSON.parse(
                localStorage.getItem(
                    "pendingAnswerRecords"
                )
            ) || [];

        pendingRecords.push(record);

        localStorage.setItem(
            "pendingAnswerRecords",
            JSON.stringify(
                pendingRecords
            )
        );

        return false;
    }
}