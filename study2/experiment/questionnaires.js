// Questionnaires
var questionnaires_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        "<h2>Questionnaires</h2>" +
        "<p>We will continue with a series of questionnaires.<br>It is important that you answer truthfully. Please read the statements carefully and answer according to what describe you the best.</p>",
    choices: ["Continue"],
    data: { screen: "part2_instructions" },
}

// Questionnaires =================================================

/* Attitudes towards AI *==========================*/
// Beliefs about Artificial Images Technology (BAIT)
// History:
// - 1.0: BAIT-Original: Items specifically about CGI and artificial media originally in Makowski 2025 (FakeFace)
// - 2.0: BAIT-14: Validated in FictionEro (with new items + removal of "I think"), where it was mixed with the 6 most
//   loading items of the positive and negative attitutes dimensions from the General Attitudes towards
//   Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// - BAIT-14: Used in FakeNewsValidation
// - 2.1: BAIT-12: Used in FakeFace2.
//   - Removed 2 GAAIS items (GAAIS_Negative_9, GAAIS_Positive_7)
//   - Replaced "Artificial Intelligence" with "AI
//   - Change display (Analog scale -> Likert scale)
// - 2.1: BAIT-12: Used in FictionEro2

const bait_items = {
    //Expectations
    BAIT_ImagesRealistic: "Current AI algorithms can generate very realistic images",
    BAIT_ImagesIssues: "Images of faces or people generated by AI always contain errors and artifacts",
    BAIT_VideosIssues: "Videos generated by AI have obvious problems that make them easy to spot as fake",
    BAIT_VideosRealistic: "Current AI algorithms can generate very realistic videos",
    BAIT_ImitatingReality: "Computer-Generated Images (CGI) are capable of perfectly imitating reality",
    BAIT_EnvironmentReal: "Technology allows the creation of environments that seem just as real as reality",
    BAIT_TextRealistic: "AI assistants can write texts that are indistinguishable from those written by humans",
    BAIT_TextIssues: "Documents and paragraphs written by AI usually read differently compared to Human productions",
    // Attitudes
    BAIT_Dangerous: "AI is dangerous",
    BAIT_Worry: "I am worried about future uses of AI",
    BAIT_Exciting: "AI is exciting",
    BAIT_Benefit: "Much of society will benefit from a future full of AI",
    // Expertise
    BAIT_ExpertAI: "I consider myself an expert in AI technology",
    BAIT_UnderstandingAI: "I have a good understanding of how AI works",
    BAIT_UserAI: "I use AI technology on a regular basis",
    // Discrimination
    BAIT_ImageDistinctionEasy: "I can easily distinguish between real and AI-generated images",
    BAIT_ImageDistinctionBad: "I am bad at telling if images are real or AI-generated",
    BAIT_TextDifferentiation: "I often find it challenging to differentiate between AI-generated and human-written text",
    BAIT_ContentDetection: "I can accurately detect subtle differences between AI from human-created content",
    // Bias
    BAIT_UniqueHuman: "Human creators bring a unique perspective that AI cannot replicate",
    BAIT_InnovativeAI: "AI-generated media can sometimes surpass human creativity in terms of innovation",
    BAIT_ImpersonalAI: "AI-generated content often feels impersonal compared to human-generated media",
    BAIT_InterestingAI: "AI-generated content tends to be more interesting and engaging than human-generated content",
    BAIT_EmotionalHuman: "Human-generated art evokes stronger emotional responses than AI-generated art",
    BAIT_PreferenceHuman: "I am more likely to appreciate content when I know it is created by humans rather than AI",
    BAIT_TrustHuman: "I am more likely to trust content when I know it is created by a human rather than AI",
}

// Convernience function to shuffle an object (used internally)
function shuffleObject(obj) {
    const entries = Object.entries(obj)
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[entries[i], entries[j]] = [entries[j], entries[i]]
    }
    return Object.fromEntries(entries)
}

function bait_questions(items, required = true, ticks = ["Disagree", "Agree"]) {
    // In Schepman et al. (2022) they removed 'Strongly'
    items = shuffleObject(items)

    //Make questions
    questions = []
    for (const key of Object.keys(items)) {
        q = {
            title: items[key],
            name: key,
            type: "rating",
            displayMode: "buttons",
            isRequired: required,
            minRateDescription: ticks[0],
            maxRateDescription: ticks[1],
            rateValues: [0, 1, 2, 3, 4, 5, 6],
        }
        questions.push(q)
    }
    return [
        {
            elements: questions,
            description:
                "We are interested in your thoughts about Artificial Intelligence (AI) as it exists today (not its potential in the future). Please read the statements below carefully and indicate the extent to which you agree with each statement.",
        },
    ]
}

// Initialize experiment =================================================
var questionnaire_bait = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Artificial Intelligence",
        // description: "",
        showQuestionNumbers: false,
        goNextPageAutomatic: true,
        // showProgressBar: "aboveHeader",
        pages: bait_questions(bait_items),
    },
    data: {
        screen: "questionnaire_bait",
    },
}

// Feedback ========================================================================================================
function bait_feedback(screen = "questionnaire_bait") {
    let dat = jsPsych.data.get().filter({ screen: screen })
    dat = dat["trials"][0]["response"]

    let score = (dat["BAIT_Exciting"] + dat["BAIT_Benefit"]) / 2
    let score_pop = 3.89 // Computed in FictionEro
    let text = "XX"
    if (score < score_pop) {
        text = "less"
    } else {
        text = "more"
    }

    // Round to 1 decimal (* 10 / 10)
    score = Math.round((score / 6) * 100 * 10) / 10
    score_pop = Math.round((score_pop / 6) * 100 * 10) / 10

    let feedback =
        "<h2>Results</h2>" +
        "<p>Based on your answers, it seems like you are <b>" +
        text +
        "</b> enthusiastic about AI (your score: " +
        score +
        "%) compared to the average population (average score: " +
        score_pop +
        "% positivity).<br></p>"
    return feedback
}

var feedback_bait = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function () {
        return bait_feedback((screen = "questionnaire_bait"))
    },
    choices: ["Continue"],
    data: { screen: "feedback_bait" },
}

// COPS
// Hatch, S. G., Esplin, C. R., Hatch, H. D., Halstead, A., Olsen, J., & Braithwaite, S. R. (2023). The consumption of pornography scale–general (COPS–G). Sexual and Relationship Therapy, 38(2), 194-218.
var questionnaire_cops = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Sexual Activity",
        completeText: "Continue",
        showQuestionNumbers: false,

        elements: [
            {
                type: "radiogroup",
                name: "COPS_Frequency",
                title: "Porn Frequency",
                description: "How often have you viewed pornography",
                choices: [
                    "I haven't watched pornography in the past 30 days",
                    "I watched pornography once in the past 30 days",
                    "I watched pornography twice in the past 30 days",
                    "I watched pornography weekly",
                    "I watched pornography multiple times a week",
                    "I watched pornography daily",
                    "I watched pornography multiple times a day",
                ],
                required: true,
            },
            {
                type: "radiogroup",
                name: "COPS_SexualActivity",
                title: "Sexual Activity",
                description: "When was the last time you engaged in any kind of sexual activity (intercourse or masturbation)?",
                choices: [
                    "Less than 24h ago",
                    "Within the last 3 days",
                    "Within the last week",
                    "Within the last month",
                    "Within the last year",
                    "More than a year ago",
                ],
                required: true,
            },
        ],
    },
    data: {
        screen: "questionnaire_cops",
    },
}
