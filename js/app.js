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

// Objeto contendo todo os dados do score
let score = {
  moves: 0,
  minutos: 0,
  segundos: 0,
  timer: null,

  //timer
  startTimer() {
    this.timer = setInterval(() => {
      if (this.segundos < 59) {
        this.segundos++;
      } else {
        this.segundos = 0;
        this.minutos++
      };
      $('.timer').text((this.minutos < 10 ? "0" + this.minutos : this.minutos) + ":" + (this.segundos < 10 ? "0" + this.segundos : this.segundos));
    }, 1000);
  },

  // stars
  checkStars() {
    if (this.getMoves() == 15 || this.getMoves() == 20 || this.getMoves() == 25) {
      $("i.fa.fa-star").last().toggleClass("fa fa-star far fa-star");
    }
  },
  stopTimer() {
    clearInterval(this.timer);
  },

  // moves
  addMove() {
    this.moves += 1;
  },
  showMoves() {
    $('.moves').text(this.moves / 2);
  },
  getMoves() {
    return this.moves / 2;
  },

  // clear
  clearScore() {
    this.moves = 0;
    this.minutos = 0;
    this.segundos = 0;
    $("i.far.fa-star").toggleClass("fa fa-star far fa-star");
    this.stopTimer();
  }
}

// Objeto de cartas selecionadas
let game = {
  selectedCards: [],
  numberOfSelecteds() {
    return this.selectedCards.length;
  },

  addSelectCard(card) {
    this.selectedCards.push(card);
  },

  checkEquals() {
    setTimeout(() => {
      if (this.selectedCards[0].children().attr('class') == this.selectedCards[1].children().attr('class')) {
        $(this.selectedCards).toggleClass('open show match');
      } else {
        $(this.selectedCards).toggleClass('show open');
      }
      won();
      this.selectedCards = [];
    }, 800);
  },

  clearCards() {
    this.selectedCards = [];
    cards.removeClass('open show match');
  }
}

// tratando evento de click dos cartões
cards.click(function () {
  // iniciando timer
  if (score.getMoves() == 0) {
    score.startTimer();
  }

  // bloqueando click em cartas abertas
  if ($(this).hasClass('open') == false) {
    if ($(this).hasClass('match') == false) {
      if (game.numberOfSelecteds() < 2) {
        $(this).toggleClass('open show');
        game.addSelectCard($(this));
        score.addMove();

        // vlidando cartoes
        if (game.numberOfSelecteds() == 2) {
          game.checkEquals();
          score.showMoves();
          score.checkStars();
        }
      }
    }
  }
});

// Modal de vitoria
function won() {
  if ($('.card.match').length == 16) {
    $('.table-body td').eq(0).text(score.getMoves());
    $('.table-body td').eq(1).text($('.timer').text());
    $('.table-body td').eq(2).text($("i.fa.fa-star").length);
    $('#winner').modal('show');
  }
}

// reset cards, timer e score
function newGame() {
  score.clearScore();
  game.clearCards();
  $('.moves').text(0);
  $('.timer').text("00:00");
  shuffleCards();
}

// tratando evento de restart e novo jogo
$('#new-game, .restart').click(() => { newGame() });
