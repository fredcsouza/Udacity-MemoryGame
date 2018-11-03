/*
 * Create a list that holds all of your cards
 */
let cards = $('.card');


/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// embaralhando cartões e adicionando ao html.
function shuffleCards() {
    shuffle(cards.find(i));
    $('.deck').html(cards);
}

shuffleCards();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */



let selectedCards = [];
let moves = 0;
let acertos = 0;

// tratando evento de click
cards.click(function () {
    if ($(this).hasClass('open') == false) {
        if ($(this).hasClass('match') == false) {
            $(this).toggleClass('open show');
            selectedCards.push($(this));

            if (selectedCards.length == 2) {
                if (selectedCards[0].children().attr('class') == selectedCards[1].children().attr('class')) {
                    selectedCards[0].toggleClass('open show match');
                    selectedCards[1].toggleClass('open show match');
                    acertos++;
                } else {
                    selectedCards[0].toggleClass('open show');
                    selectedCards[1].toggleClass('open show');
                }
                moves++;
                $('.moves').text(moves);
                selectedCards = [];
                if (acertos == 8) {
                    $('.score-final').text("With " + moves + " Moves and 1 Star");
                    $('#winner').modal('show');
                }
            }
        }
    }
});

function newGame() {
    shuffleCards();
    cards.removeClass('match');
    moves = 0;
    acertos = 0;
    selectedCards = [];
    $('.moves').text(0);
}

// restart
$('.restart').click(function () {
    newGame();
});

// novo jogo
$('#new-game').click(function () {
    newGame();
});