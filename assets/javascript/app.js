(function() {
    'use strict';

    let TIME = 7;

    let intervalID, progressIntervalID;

    let triviaGame = {

        start: null,

        // Number of correctly answered quesitons.
        correct: 0,

        // Number of incorrectly answered questions.
        incorrect: 0,

        // Number to track what question we are on.
        questionNumber: 0,

        // Array of quesitons already given.
        questionsUsed: [],

        // Array of all questions.
        questions: ["Who was Ash Ketchum's first Pokemon?", 
                    "What type is Meowth?", 
                    "What are Team Rocket's Jessie and James' signature Pokemon?",
                    "Who were the original Elite Four minus the champion?"],

        // Array of arrays of all posible answers to the corresponding question.
        answers: [['Squirtle', 'Bulbasaur', 'Charmander', 'Pikachu'],
                  ['Normal', 'Flying', 'Fighting', 'Psychic'],
                  ['Ekans and Weezing', 'Weezing and Arbok', 'Koffing and Arbok', 'Ekans and Koffing'],
                  ['Lorelei, Bruno, Agatha, and, Lance', 'Brock, Misty, Sabrina, and Lt. Surge', 'Professor Oak, Mrs. Ketchum, Officer Jenny, and Nurse Joy']],

        // Array of correct answer to corresponding question.
        correctAnswers: ['Pikachu', 
                         'Normal', 
                         'Weezing and Arbok', 
                         'Lorelei, Bruno, Agatha, and, Lance'],

        chooseAnswer: function(event) {
            
            // Get the chosen answer.
            let answer = $(event.target).text();

            // If the answer chosen is the same as the correct answer
            if (answer !== triviaGame.correctAnswers[triviaGame.questionNumber]) {

                // Prepend red x to the answer chosen (incorrect answer).
                $(event.target).prepend('<i class="fas fa-times"></i> ');

                // Increment incorrect by 1 and then display number of incorrect questions.
                $('#incorrect').text(++triviaGame.incorrect);

                // Get correct answer to the question
                let correctAnswer = triviaGame.correctAnswers[triviaGame.questionNumber];

                // Get the ID of the paragrpah containing the correct answer 
                let correctAnswerID = triviaGame.answers[triviaGame.questionNumber].indexOf(correctAnswer);

                console.log(correctAnswerID)

                // Prepend green check mark to the correct answer.
                $('#' + (correctAnswerID + 1)).prepend('<i class="fas fa-check"></i> ');

            } else {

                // Prepend green check mark to the correct answer.
                $(event.target).prepend('<i class="fas fa-check"></i> ');

                // Increment incorrect by 1 and then display number of correct questions.
                $('#correct').text(++triviaGame.correct);
            }

            // Only allow player to choose one answer.
            $('.answer').off('click');

            // Check if the quiz is over.
            triviaGame.isGameOver();
        },

        /**
         * Display a question and set of answers in the jumbotron.
         */
        displayQuestion: function() {

            // Starts the visual timer for the player to know how much time is left.
            // triviaGame.startProgressBar();
            
            // Get a random question that has not been chosen yet. 
            // If the question has already been picked, choose a different one.
            let randomQuestionNumber = Math.floor(Math.random() * triviaGame.questions.length);
            while (triviaGame.questionsUsed.includes(randomQuestionNumber)) {
                randomQuestionNumber = Math.floor(Math.random() * triviaGame.questions.length);
            }
            
            // Save the index of the quesiton picked.
            triviaGame.questionNumber = randomQuestionNumber;

            // Add the question to the ones used.
            triviaGame.questionsUsed.push(triviaGame.questionNumber);

            // Display the question.
            $('#question').text(triviaGame.questions[triviaGame.questionNumber]);

            // Reset the answers container.
            $('#answers').html('');

            // Get the answers corresponding to the question.
            let answers = triviaGame.answers[triviaGame.questionNumber];

            // Display each answer and add the onclick function.
            answers.forEach(function (answer) {
                let p = $('<p></p>');
                $(p).addClass('answer');
                $(p).attr('id', (triviaGame.answers[triviaGame.questionNumber].indexOf(answer) + 1));
                $(p).text(answer);
                $(p).on('click', triviaGame.chooseAnswer);
                $('#answers').append(p);
            }); 
        },


        // need to fix case when player does not choose answer
        isGameOver: function() {
            if (triviaGame.questionsUsed.length === triviaGame.questions.length) {
                clearInterval(intervalID);
                clearInterval(progressIntervalID);
                $('.jumbotron').empty();
                $('.jumbotron').append('<h3>How close to Pokemon Master are you?</h3>');
                $('.jumbotron').append('<button class="btn btn-secondary" id="reset">Try Again?</button>');
                $('#reset').on('click', triviaGame.resetGame);
            }
        },


        // On start button press, trivia quiz begins. 
        // Sets interval to time each question.
        startQuiz: function() {
            triviaGame.start = $('#start');
            $('#start').remove();
            clearInterval(intervalID);
            triviaGame.displayQuestion();
            setInterval(triviaGame.displayQuestion, (TIME * 1000));
        },

        
        resetGame: function() {
            $('.jumbotron').empty();
            $('.jumbotron').append(triviaGame.start);
            $('#start').on('click', triviaGame.startQuiz);
            triviaGame.questionsUsed = [];
            triviaGame.correct = 0;
            triviaGame.incorrect = 0;
            $('#incorrect').text('0');
            $('#correct').text('0');
        },


        startProgressBar: function() {
            let i = 100;
            progressIntervalID = setInterval(function () {
                i-= (100 / TIME);
                if (i > 0) {
                    $('.progress-bar').css('width', i + '%');
                } else {
                    clearInterval(progressIntervalID);
                    $('.progress-bar').css('width', '100%');
                }
            }, 1000);
        }

    }

    $(document).ready(function() {
        $('#start').on('click', triviaGame.startQuiz);
    });
})();


