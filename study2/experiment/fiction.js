// Condition assignment ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
    }
    assignCondition
    return array
}

function assignCondition(stimuli_list) {
    let new_stimuli_list = []

    // Access demographic data
    let demographic_data = jsPsych.data.get().filter({ screen: "demographic_questions" }).values()[0]
    let gender = demographic_data.response.Gender
    let sexuality = demographic_data.response.SexualOrientation
    let choice = demographic_data.response.StimuliChoice

    // Define the stimuli categories based on Gender and Sexuality

    let stimuliCategory = []
    if (choice) {
        if (choice === "Women (and heterosexual couples)") {
            stimuliCategory = ["Female", "Opposite-sex Couple"]
        } else if (choice === "Men (and heterosexual couples)") {
            stimuliCategory = ["Male", "Opposite-sex Couple"]
        } else if (choice === "Only women (and lesbian couples)") {
            stimuliCategory = ["Female", "Female Couple"]
        } else if (choice === "Only men (and gay couples)") {
            stimuliCategory = ["Male", "Male Couple"]
        }
    } else if (sexuality === "Heterosexual") {
        if (gender === "Male") {
            stimuliCategory = ["Female", "Opposite-sex Couple"]
        } else if (gender === "Female") {
            stimuliCategory = ["Male", "Opposite-sex Couple"]
        }
    } else if (sexuality === "Homosexual") {
        if (gender === "Male") {
            stimuliCategory = ["Male", "Male Couple"]
        } else if (gender === "Female") {
            stimuliCategory = ["Female", "Female Couple"]
        }
    } else {
        console.error("Unexpected demographic data.")
        return []
    }

    // Loop through unique categories in stimuli_list
    for (let cat of [...new Set(stimuli_list.map((a) => a.Category))]) {
        // Get all stimuli of this category
        let cat_stimuli = stimuli_list.filter((a) => a.Category === cat)

        // Shuffle cat_stimuli (assuming shuffleArray is defined elsewhere)
        cat_stimuli = shuffleArray(cat_stimuli)

        // Assign half to "Reality" condition and half to "Fiction" condition
        for (let i = 0; i < cat_stimuli.length; i++) {
            cat_stimuli[i].Condition =
                i < cat_stimuli.length / 2 ? "Reality" : "Fiction"
        }

        // Filter cat_stimuli based on the determined stimuli categories
        cat_stimuli = cat_stimuli.filter((stimulus) =>
            stimuliCategory.includes(stimulus.Category)
        )

        // Add to new_stimuli_list
        new_stimuli_list.push(...cat_stimuli)
    }

    return shuffleArray(new_stimuli_list)
}

// Variables ===================================================================
var fiction_trialnumber = 1
var color_cues = shuffleArray(["red", "blue", "green"])
color_cues = { Reality: color_cues[0], Fiction: color_cues[1] }
var text_cue = { Reality: "Photograph", Fiction: "AI-generated" }

// Screens =====================================================================
var fiction_instructions1 = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h2>Part 1/2</h2>" +
        "<p>This study stems out of an exciting new partnership between researchers from the <b>University of Sussex</b> and a young <b>AI startup</b> based in Brighton, UK, that specializes in making AI technology more ethical.</p>" +
        "<p>Our goal is to better understand how various people react to different images. For this, we will be using a new <b>image-generation algorithm</b> (based on a modified <i>Generative Adversarial Network</i>) trained on a carefully refined material to produce realistic high-quality erotic images. " +
        "This allows us to manipulate the generation parameters and understand how they impact perception." +
        "<p> The illustration below demonstrates how a <i>GAN</i> algorithm generates face images. Our updated version extends this approach to full-body images, including multiple people interacting. This enhancement was achieved by improving the logic of the embedded space obtained from the training data. " +
        "<p> If you are interested, more technical details will be provided at the end of the experiment.</p>" +
        "<div style='text-align: center;'><img src='media/gan.gif' height='200'></img></div>" +
        "<p>In the next part, you will be presented with images generated by our algorithm (preceded by the word '<b style='color:" +
        color_cues["Fiction"] +
        "'>AI-generated</b>'), intermixed with real photos (preceded by the word '<b style='color:" +
        color_cues["Reality"] +
        "'>Photograph</b>') taken from public picture databases, adjusted to be of similar dimension and aspect as the artificially-generated images.</p > " +
        // REPHRASE!
        "<p >The images will be <b>briefly flashed on the screen</b>. Imagine that they belong to a real person or people. After each image, you will be asked a series of questions:</p>" +
        // Arousal: embodied
        "<li  style='text-align: left; margin-left: 10%; margin-right: 10%;'><b>Arousing</b>: How much do you find the image sexually arousing. This question is about your own <i>personal reaction</i> felt in your body when seeing the image.</li>" +
        // Appeal: "objective"
        "<li  style='text-align: left; margin-left: 10%; margin-right: 10%;'><b>Enticing</b>: How enticing and sexually appealing would you rate this image to be. Think of how much, in general, people similar to you in terms of gender and sexual orientation would like it.</li>" +
        // Emotional Valence
        "<li style='text-align: left; margin-left: 10%; margin-right: 10%;'><b>Valence</b>: Did the image evoke a positive and pleasant (not necessarily sexual) feeling in you, or could it better characterized as negative and unpleasant? Think of how much you did enjoy (or not) looking at the image</li></ul>" +
        // Contrasting explanation
        '<p>While the answers to these scales can sometimes be very similar, they can also be different depending on the person, the image, and the context. For example, we can sometimes find ourselves aroused to a picture that would probably not be considered universally appealing. Conversely, an enticing and "objectively" sexy image can, for one reason or another, not evoke any reaction in our body.</p>' +
        "<p><b>Try to be attentive to what happens in your mind and body while watching the images to try to answer accurately based on your own feelings and reactions.</b></p>" +
        "<p>Note that we are interested in your <b>first impression</b>, so please respond according to your gut feelings.</p>" +
        "<p>Below is an example of how the questions will appear after each image:</p>" +
        "<div style='text-align: center;'><img src='media/scales_phase1.png' height='400' style='border:5px solid #D3D3D3; padding:3px; margin:5px'></img></div>" +
        "<p style='text-align: center';>Press start once you are ready.</p>",
    choices: ["Start"],
    data: { screen: "fiction_instructions1" },
}

var fiction_instructions2 = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<div style='text-align: center;'><img src='media/phase2_img.png' height='350' align='right'></img></div>" +
        "<h2>Part 2/2</h2>" +
        "<p>Thank you! In this final phase, we would like to see if you found our <b>image generation algorithm convincing</b> and error-free.</p>" +
        "<p>But there is <b>something important</b> we need to tell you... In the previous phase, some images were <b style='color: orange'>intentionally mislabelled</b> (we told you it was a photograph when it was actually AI-generated and vice versa).</p>" +
        "<p>In this phase, we want you to tell us for each image <b>what you think is the true category</b>! " +
        "We will briefly present all the images once more, and your task is to tell us if you think the image is AI-generated or a photograph. Indicate your degree of <b>confidence</b> and certainty by selecting larger numbers.</p>" +
        "<div style='text-align: center;'><img src='media/scales_phase2.png' height='170' style='border:5px solid #D3D3D3; padding:3px; margin:5px'></img></div>" +
        "<p style='text-align: center';>Press start once you are ready.</p>",
    choices: ["Start"],
    data: { screen: "fiction_instructions2" },
    on_finish: function () {
        fiction_trialnumber = 1 // Reset trial counter
    },
}

var fiction_preloadstims = {
    type: jsPsychPreload,
    message:
        "Please wait while the experiment is being loaded (it can take a few seconds)",
    images: stimuli_list.map((a) => "stimuli/" + a.stimulus),
    on_load: function () {
        stimuli = assignCondition(stimuli_list)
    },
}

var fiction_fixation1a = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus:
        "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_fixation1a",
            item: jsPsych.evaluateTimelineVariable("stimulus"),
        }
    },
}

var fiction_cue = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        var cond = jsPsych.evaluateTimelineVariable("Condition")
        return (
            "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%; color: " +
            color_cues[cond] +
            "'><b>" +
            text_cue[cond] +
            "</b></div>"
        )
    },
    data: function () {
        var cond = jsPsych.evaluateTimelineVariable("Condition")
        return {
            screen: "fiction_cue",
            color: color_cues[cond],
            condition: cond,
            item: jsPsych.evaluateTimelineVariable("stimulus"),
        }
    },
    choices: ["s"],
    trial_duration: 1000,
    save_trial_parameters: { trial_duration: true },
}

var fiction_fixation1b = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus:
        "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_fixation1b",
            item: jsPsych.evaluateTimelineVariable("stimulus"),
        }
    },
    extensions: [
        {
            type: jsPsychExtensionWebgazer,
            params: { targets: ["#jspsych-html-keyboard-response-stimulus"] },
        },
    ],
}

var fiction_showimage1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("stimulus")
    },
    stimulus_height: function () {
        if (window.innerHeight < window.innerWidth) {
            return Math.round(0.9 * window.innerHeight)
        } else {
            return null
        }
    },
    stimulus_width: function () {
        if (window.innerHeight > window.innerWidth) {
            return Math.round(0.9 * window.innerWidth)
        } else {
            return null
        }
    },
    trial_duration: 2000,
    choices: ["s"],
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_image1",
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            trial_number: fiction_trialnumber,
        }
    },
    on_finish: function () {
        fiction_trialnumber += 1
    },
    // Enable webgazer
    extensions: [
        {
            type: jsPsychExtensionWebgazer,
            params: { targets: ["#jspsych-image-keyboard-response-stimulus"] },
        },
    ],
}

// Oosterhof and Todorov (2008) - 9 point scale (Not at all to Extremely) TRAIT VARIABLES
var fiction_ratings1 = {
    type: jsPsychSurvey,
    survey_json: {
        goNextPageAutomatic: true,
        showQuestionNumbers: false,
        showNavigationButtons: false,
        title: function () {
            return (
                "Rating - " +
                Math.round(((fiction_trialnumber - 1) / stimuli.length) * 100) +
                "%"
            )
        },
        description: "Think of the person that you just saw.",
        pages: [
            {
                elements: [
                    {
                        type: "rating",
                        name: "Arousal",
                        title: "How much did you feel sexually aroused?",
                        isRequired: true,
                        rateMin: 0,
                        rateMax: 6,
                        minRateDescription: "Not at all",
                        maxRateDescription: "Very much",
                        displayMode: "buttons",
                    },
                    {
                        type: "rating",
                        name: "Enticing",
                        title: "How enticing would you rate this image to be?",
                        isRequired: true,
                        rateMin: 0,
                        rateMax: 6,
                        minRateDescription: "Not at all",
                        maxRateDescription: "Very much",
                        displayMode: "buttons",
                    },
                    {
                        type: "rating",
                        name: "Valence",
                        title: "The feeling evoked by the image was...",
                        isRequired: true,
                        rateMin: 0,
                        rateMax: 6,
                        minRateDescription: "Unpleasant",
                        maxRateDescription: "Pleasant",
                        displayMode: "buttons",
                    },
                    // "This face is conventionally beautiful",
                    // "Would you find this person approachable?",
                    // "This person reminds me of someone I know", // Familiarity (van vugt et al., 2010)
                    // "How much does this face look like yours?",
                    // "How weird is the face you saw?",   // include eeriness as well? (cf uncanny valley effect)
                    // "How dominant is the face you saw?",
                    // "How musculine/feminine is the face you saw?",
                    // "How emotionally stable is the face you saw?",
                    // "How mean is the face you saw?",
                    // "How boring is the face you saw?",
                    // "How intelligent is the face you saw?",
                    // "How caring is the face you saw?",
                    // "How egoistic is the face you saw?",
                    // "How responsible is the face you saw?",
                ],
            },
        ],
    },
    data: {
        screen: "fiction_ratings1",
    },
}


var fiction_phase1_break = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h1>Break Time</h1>" +
        "<div style='text-align: left'>" +
        "<p>We know these types of experiment can feel a bit repetitive and tedious, " +
        "but it is important for us that you stay focus until the end. Please take this opportunity to <b>take a break and relax your neck and eyes</b>.</p>",
    choices: ["Ready to continue!"],
    data: { screen: "fiction_phase1_break" },
}


// Stage 2 loops and variables

var fiction_fixation2 = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus:
        "<div  style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_fixation2" },
}

var fiction_showimage2 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("stimulus")
    },
    stimulus_height: function () {
        if (window.innerHeight < window.innerWidth) {
            return Math.round(0.9 * window.innerHeight)
        } else {
            return null
        }
    },
    stimulus_width: function () {
        if (window.innerHeight > window.innerWidth) {
            return Math.round(0.9 * window.innerWidth)
        } else {
            return null
        }
    },
    trial_duration: 1000,
    choices: ["s"],
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_image2", trial_number: fiction_trialnumber },
    on_finish: function () {
        fiction_trialnumber += 1
    },
}

var fiction_ratings2 = {
    type: jsPsychSurvey,
    css_classes: ["colored-scale"],
    survey_json: {
        goNextPageAutomatic: true,
        showQuestionNumbers: false,
        showNavigationButtons: false,
        title: function () {
            return (
                "Rating - " +
                Math.round(((fiction_trialnumber - 1) / stimuli.length) * 100) +
                "%"
            )
        },
        pages: [
            {
                elements: [
                    {
                        type: "rating",
                        name: "Realness",
                        title: "I think this face is...",
                        description:
                            "Indicate your confidence that the image is fake or real",
                        isRequired: true,
                        // rateValues: [
                        //     {
                        //         value: -1,
                        //         text: "-4",
                        //     },
                        //     {
                        //         value: -0.75,
                        //         text: "-3",
                        //     },
                        //     {
                        //         value: -0.5, // 1/2
                        //         text: "-2",
                        //     },
                        //     {
                        //         value: -0.25, // 1/4
                        //         text: "-1",
                        //     },
                        //     // {
                        //     //     value: 0,
                        //     //     text: "0",
                        //     // },
                        //     {
                        //         value: 0.25, // 1/4
                        //         text: "1",
                        //     },
                        //     {
                        //         value: 0.5, // 1/2
                        //         text: "2",
                        //     },
                        //     {
                        //         value: 0.75, // 3/4
                        //         text: "3",
                        //     },
                        //     {
                        //         value: 1,
                        //         text: "4", // "4 (100% Certain)",
                        //     },
                        // ],
                        rateMin: -3,
                        rateMax: 3,
                        minRateDescription: "AI-Generated",
                        maxRateDescription: "Photograph",
                        displayMode: "buttons",
                    },
                ],
            },
        ],
    },
    data: {
        screen: "fiction_ratings2",
    },
}



// Feedback ====================================================================

var fiction_feedback1 = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Thank you!",
        description:
            "Before we start the second phase, we wanted to know your thoughts.",
        showQuestionNumbers: false,
        elements: [
            {
                type: "checkbox",
                name: "Feedback_1",
                title: "Face Attractiveness",
                description: "Please select all that apply",
                choices: [
                    "Some faces were really attractive",
                    "No face was particularly attractive",
                    "AI-generated images were more attractive than the photos",
                    "AI-generated images were less attractive than the photos",
                ],
                showOtherItem: true,
                showSelectAllItem: false,
                showNoneItem: false,
            },
            {
                type: "checkbox",
                name: "Feedback_2",
                title: "AI-Generation Algorithm",
                description: "Please select all that apply",
                choices: [
                    "The difference between the photos and the AI-generated images was obvious",
                    "The difference between the photos and the AI-generated images was subtle",
                    "I didn't see any difference between photos and AI-generated images",
                    "I felt like the labels ('Photograph' and 'AI-Generated') were not always correct",
                    "I felt like the labels were reversed (e.g., 'Photograph' for AI-generated images and vice versa)",
                    "I feel like all the images were photos",
                    "I feel like all the images were AI-generated",
                ],
                showOtherItem: true,
                showSelectAllItem: false,
                showNoneItem: false,
            },
            {
                visibleIf:
                    "{Feedback_2} anyof ['I feel like all the images were photos']",
                title: "How certain are you that all images were photos?",
                name: "Feedback_2_ConfidenceReal",
                type: "rating",
                rateMin: 0,
                rateMax: 5,
                minRateDescription: "Not at all",
                maxRateDescription: "Completely certain",
            },
            {
                visibleIf:
                    "{Feedback_2} anyof ['I feel like all the images were AI-generated']",
                title: "How certain are you that all images were AI-generated?",
                name: "Feedback_2_ConfidenceFake",
                type: "rating",
                rateMin: 0,
                rateMax: 5,
                minRateDescription: "Not at all",
                maxRateDescription: "Completely certain",
            },
        ],
    },
    data: {
        screen: "fiction_feedback1",
    },
} 
