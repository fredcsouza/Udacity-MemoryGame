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

// Controle do Timer
let timer = {
  data: new Date(),
  timer: null,
  startTimer() {
    this.data.setMinutes(0);
    this.data.setSeconds(0);

    this.timer = setInterval(() => {
      if (this.data.getSeconds() < 59) {
        this.data.setSeconds(this.data.getSeconds() + 1);
      } else {
        this.data.setSeconds(0);
        this.data.setMinutes(this.data.getMinutes() + 1);
      };
      $('.timer').text(this.getFormatedTimer(this.data));
    }, 1000);
  },
  stopTimer() {
    clearInterval(this.timer);
  },
  getTimer() {
    return this.data.getTime();
  },
  getFormatedTimer(timer) {
    return (timer.getMinutes() < 10 ? "0" + timer.getMinutes() : timer.getMinutes()) + ":" +
      (timer.getSeconds() < 10 ? "0" + timer.getSeconds() : timer.getSeconds());
  },
  clearTimer() {
    this.stopTimer();
    this.data.setMinutes(0);
    this.data.setSeconds(0);
  }
}

// Controle das Jogadas
let moves = {
  moves: 0,
  addMove() {
    this.moves += 1;
  },
  showMoves() {
    $('.moves').text(this.moves / 2);
  },
  getMoves() {
    return this.moves / 2;
  },
  clearMoves() {
    this.moves = 0;
  }
}

// Controle das Estrelas
let stars = {
  checkStars() {
    if (moves.getMoves() == 17 || moves.getMoves() == 21 || moves.getMoves() == 25) {
      $("i.fa.fa-star").last().toggleClass("fa fa-star far fa-star");
    }
  },
  clearStars() {
    $("i.far.fa-star").toggleClass("fa fa-star far fa-star");
  },
  numberOfStars() {
    return $("i.fa.fa-star").length;
  }
}

// Controle do leaderboard
let leaderboard = {
  leaderboard: [],
  set() {
    this.get();
    let score = [stars.numberOfStars(), moves.getMoves(), timer.getTimer()];
    if (this.leaderboard != null) {
      let exist = false;
      for (element in leaderboard) {
        if (element[0] == score[0] && element[1] == score[1] && element[2] == score[0]) {
          exist = true;
          break;
        }
      }
      if (exist == false) {
        this.leaderboard.push(score);
        this.leaderboard.sort(function (a, b) {
          return b[0] - a[0];
        });
        this.leaderboard.sort(function (a, b) {
          if (a[0] == b[0]) { return a[1] - b[1] }
        });
        this.leaderboard.sort(function (a, b) {
          if (a[0] == b[0] && a[1] == b[1]) { return a[2] - b[2] }
        });
      }
      if (this.leaderboard.length > 10) {
        this.leaderboard.splice(10, 1);
      }
    } else {
      this.leaderboard = [score];
    }
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard))
  },
  get() {
    if (localStorage.getItem('leaderboard') != "undefined") {
      this.leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
    }
  },
  clear() {
    this.leaderboard = [];
    localStorage.removeItem('leaderboard');
  },
  showModal() {
    modal.hideElement('.modal-info', true);
    modal.hideElement('.modal-score', false);
    modal.hideElement('.new-game', true);
    modal.hideElement('.clear-score', false);

    this.get();
    modal.setTitle('Leaderboard');
    if (this.leaderboard != null) {
      modal.setTableElements(this.leaderboard);
    }
    modal.show();
  }
}

// checando cartas e iniciando timer
function checkCards() {
  if (moves.getMoves() == 0) {
    timer.startTimer();
  }

  // bloqueando click em cartas abertas
  if ($(this).hasClass('open') == false) {
    if ($(this).hasClass('match') == false) {
      if (game.numberOfSelecteds() < 2) {
        $(this).toggleClass('open show');
        game.addSelectCard($(this));
        moves.addMove();

        // vlidando cartoes
        if (game.numberOfSelecteds() == 2) {
          game.checkEquals();
          moves.showMoves();
          stars.checkStars();
        }
      }
    }
  }
}

// controle do jogo
let game = {
  selectedCards: [],
  numberOfSelecteds() {
    return this.selectedCards.length;
  },
  addSelectCard(card) {
    this.selectedCards.push(card);
  },
  checkEquals() {
    if (this.selectedCards[0].children().attr('class') == this.selectedCards[1].children().attr('class')) {
      setTimeout(() => {
        $(this.selectedCards).toggleClass('open show match');
        this.selectedCards = [];
        modalVitoria();
      }, 800);
    } else {
      setTimeout(() => {
        $(this.selectedCards).toggleClass('open show wrong');
      }, 800);
      setTimeout(() => {
        $(this.selectedCards).toggleClass('wrong');
        this.selectedCards = [];
      }, 1600);
    }
    modalVitoria();
  },
  clearCards() {
    this.selectedCards = [];
    cards.removeClass('open show match');
  }
}

// Modal
let modal = {
  setTitle(title) {
    $('.title-modal').text(title);
  },

  setTableElement(element) {
    this.removeTableElements();
    let tr = $('<tr>');
    for (let i = 0; i < element.length; i++) {
      $(tr).append('<td>' + element[i] + '</td>');
    }
    $(".table-body").append($(tr));
  },

  setTableElements(elements) {
    let array = elements;
    let data = new Date();
    array.forEach(element => {
      data.setTime(element[2]);
      element[2] = timer.getFormatedTimer(data);
    });
    this.removeTableElements();
    for (let i = 0; i < array.length; i++) {
      let tr = $('<tr>');
      for (let j = 0; j < array[i].length; j++) {
        $(tr).append('<td>' + array[i][j] + '</td>');
      }
      $(".table-body").append($(tr));
    }
  },
  removeTableElements() {
    $('.table-body tr').remove();
  },
  hideElement(element, value) {
    (value ? $('.modal-body ' + element).hide() : $('.modal-body ' + element).show())
  },
  show() {
    $('#modal').modal('show');
  }
}

// Modal de vitoria
function modalVitoria() {
  if ($('.card.match').length == 16) {
    modal.hideElement('.modal-info', true);
    modal.hideElement('.modal-score', false);
    modal.hideElement('.new-game', false);
    modal.hideElement('.clear-score', true);
    timer.stopTimer();
    leaderboard.set();
    modal.setTitle("Parabéns! Você Ganhou!");
    modal.setTableElement([stars.numberOfStars(), moves.getMoves(), timer.getFormatedTimer(timer.data)]);
    modal.show();
  }
}

// Modal informações
function info() {
  modal.setTitle("Informações");
  modal.hideElement('.modal-info', false);
  modal.hideElement('.modal-score', true);
  modal.hideElement('.new-game', true);
  modal.hideElement('.clear-score', true);
  modal.show();
}

// Limpar Tabela leaderboard
function clearScore() {
  leaderboard.clear();
  modal.removeTableElements();
}

// reset cards, timer e score
function newGame() {
  timer.clearTimer();
  moves.clearMoves();
  stars.clearStars();
  game.clearCards();
  $('.moves').text(0);
  $('.timer').text("00:00");
  shuffleCards();
}

/* Tratando eventos */

// Cartões
cards.click(checkCards);

// restart e novo jogo
$('.restart').click(newGame);
$('.modal .new-game').click(newGame);

// atalho para reset do jogo
$('body').keypress((e) => { if (e.keyCode == 82 && e.shiftKey) { newGame() } });

// leaderboard
$('.leaderboard').click(() => { leaderboard.showModal() });

// info
$('.info').click(info);

// clear leaderboard
$('.clear-score').click(clearScore)
