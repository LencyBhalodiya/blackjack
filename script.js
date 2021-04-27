// challenge:5 Blackjack
let blackjackGame = {
  'you': {'scorespan':'#your-blackjack-result','div':'#yourbox','score':0},
  'dealer': {'scorespan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
  'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
  'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A': [1,11]},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'turnsover':false,
};

const You =blackjackGame['you'];
const Dealer =blackjackGame['dealer'];
const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const losssound = new Audio('sounds/aww.mp3');
document.querySelector("#hitbutton").addEventListener('click', blackjackhit);
document.querySelector("#standbutton").addEventListener('click',dealerLogic);
document.querySelector('#dealbutton').addEventListener('click',blackjackDeal);

function blackjackhit() {
  if(blackjackGame['isStand'] === false){
  let card = randomCard();
   showcard(card,You);
   updateScore(card,You);
   ShowScore(You);
  
  }
}
function randomCard(){
  let randomIndex =Math.floor(Math.random()*13);
  return blackjackGame['cards'][randomIndex];
}

function showcard(card,activeplayer){
  if(activeplayer['score']<=21){
  let cardImage = document.createElement('img');
   cardImage.src =`images/${card}.png`;
   document.querySelector(activeplayer['div']).appendChild(cardImage);
   hitsound.play();
  }
}

function blackjackDeal(){
  if(blackjackGame['turnsover'] === true){
    
  blackjackGame['isStand'] = false;
  let yourImages = document.querySelector('#yourbox').querySelectorAll('img');
  let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
  for(i=0; i<yourImages.length; i++){
    yourImages[i].remove(); 
  }
  for(i=0; i<dealerImages.length; i++){
    dealerImages[i].remove(); 
  }
   You['score']=0;
   Dealer['score']= 0;
   document.querySelector('#your-blackjack-result').textContent = 0;
   document.querySelector('#dealer-blackjack-result').textContent = 0;
   document.querySelector('#your-blackjack-result').style.color = '#ffffff';
   document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';
   document.querySelector('#blackjack-result').textContent= "Lets play";
   document.querySelector('#blackjack-result').style.color ='black ';
   
   blackjackGame['turnsover'] = true;
 }
}

 function updateScore(card,activeplayer)
{
  if(card === 'A'){
    //if adding 11keeps me below 21 then add 11 if not then 1
   if(activeplayer['score'] + blackjackGame['cardsMap'][card][1] <=21){
      activeplayer['score'] += blackjackGame['cardsMap'][card][1];
  }else{
    activeplayer['score'] += blackjackGame['cardsMap'][card][0];
  }
}
else{
      activeplayer['score'] += blackjackGame['cardsMap'][card];
    }
}
function ShowScore(activeplayer){
  if(activeplayer['score']>21){
    document.querySelector(activeplayer['scorespan']).textContent= 'BUST';
    document.querySelector(activeplayer['scorespan']).style.color = 'red';
  }else{
  document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
  }
}

function sleep(ms){
   return new Promise(resolve => setTimeout(resolve,ms));
}

async function dealerLogic(){
  blackjackGame['isStand'] = true;

  while(Dealer['score']<17 && blackjackGame['isStand'] === true){
  let card = randomCard();
  showcard(card,Dealer);
  updateScore(card,Dealer);
  ShowScore(Dealer);
  await sleep(1000);
  }
    blackjackGame['turnsover'] =true; 
    let winner = computerWinner();
    showResult(winner);
}

//compute winner and returns who just won the game 
//also update the wins ,loss and draws 
function computerWinner(){
  let winner;

  if(You['score']<=21){
    //condition: higher score than dealer or when dealer bursts but didn't
    if(You['score'] > Dealer['score'] || (Dealer['score']>21)){
      blackjackGame['wins']++;
      winner = You;
    }else if(You['score'] < Dealer['score']){
      blackjackGame['losses']++;
      winner = Dealer;
    }else if(You['score'] === Dealer['score']){
      blackjackGame['draws']++;
    }
    //condition: when you bursts but dealer doesn't
  }else if (You['score']>21 && Dealer['score']<=21){
    blackjackGame['losses']++;
    winner = Dealer;
     //condition: when you And dealer bursts 
  }else if(You['score']>21 && Dealer['score']>21){
    blackjackGame['draws']++;
  }
  console.log(blackjackGame);
  return winner;
}

  function showResult(winner){
    let message, messageColor;
    
    if(blackjackGame['turnsover'] === true){
    if(winner === You){
      document.querySelector('#wins').textContent = blackjackGame['wins'];
      message = 'You won';
      messageColor = 'green';
      winsound.play();
    
      }else if(winner === Dealer){
        document.querySelector('#loses').textContent = blackjackGame['losses'];
        message = 'You lost!';
        messageColor = 'red';
        losssound.play(); 
      }else{
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = 'You drew!';
        messageColor = 'orange';
      }
      document.querySelector('#blackjack-result').textContent = message;
      document.querySelector('#blackjack-result').style.color = messageColor;
    }
  }