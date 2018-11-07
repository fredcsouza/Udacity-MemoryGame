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
  let simbol = shuffle(cards.find('i'));
  cards.each(function (index) {
    $(this).html(simbol[index]);
  });
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

// tratando evento de click dos cartões
cards.click(function () {
  if ($(this).hasClass('open') == false) {
    if ($(this).hasClass('match') == false) {
      if (selectedCards.length < 2) {

        $(this).toggleClass('open show');
        selectedCards.push($(this));
        moves++;
        $('.moves').text(moves);

        // validando cartoes
        if (selectedCards.length == 2) {
          setTimeout(() => {
            if (selectedCards[0].children().attr('class') == selectedCards[1].children().attr('class')) {
              selectedCards[0].toggleClass('open show match');
              selectedCards[1].toggleClass('open show match');
            } else {
              selectedCards[0].toggleClass('open show');
              selectedCards[1].toggleClass('open show');
            }
            selectedCards = [];
          }, 1000);


          // verificando numero de estrelas por jogaga
          if (moves == 15 || moves == 20 || moves == 25) {
            removeStar();
          }

          // Modal de vitoria
          if ($('.card.match').length == 16) {
            stopTimer();
            $('.score-final').text('Com ' + moves + ' Jogadas, tempo de ' + $('.timer').text() + ' e ' + $("i.fa.fa-star").length + ' Estrela');
            $('#winner').modal('show');
          }
        }
      }
    }
  }
});

// acionando timer no primeiro click
cards.click(function () {
  if (moves == 0) {
    timer = setInterval(startTimer, 1000);
  }
});

// reset cards, timer e score
function newGame() {
  stopTimer();
  resetStar();
  cards.removeClass('open show match');
  moves = 0;
  minutos = 0;
  segundos = 0;
  selectedCards = [];
  $('.moves').text(0);
  $('.timer').text("00:00");
  shuffleCards();
}

$('#new-game, .restart').click(() => { newGame() });

// Timer
let minutos = 0;
let segundos = 0;
let timer = null;

function startTimer() {
  if (segundos < 59) {
    segundos++;
  } else {
    segundos = 0;
    minutos++
  };
  $('.timer').text((minutos < 10 ? "0" + minutos : minutos) + ":" + (segundos < 10 ? "0" + segundos : segundos));
}

function stopTimer() {
  clearInterval(timer);
}

// Stars
function removeStar() {
  $("i.fa.fa-star").last().toggleClass("fa fa-star far fa-star")
}

function resetStar() {
  $("i.far.fa-star").toggleClass("fa fa-star far fa-star")
}

