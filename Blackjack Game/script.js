let blackjackGame ={
    'you':{'scoreSpan' :'#YourResult', 'div': '#YourBox', 'score':0},
    'dealer':{'scoreSpan':'#DealerResult', 'div': '#DealerBox','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','q','k','j','a'],
    'cardsVal': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'k':10,'j':10,'q':10,'a':[1,11]},
    'wins' :0,
    'losses' :0,
    'draws':0,
    'stand':false,
    'turnsOver':false,
};

const YOU =blackjackGame['you']
const DEALER= blackjackGame['dealer']

const hitSound = new Audio('swish.m4a');
const winSound = new Audio('cash.mp3');
const lossSound = new Audio('aww.mp3');

document.querySelector('#hitbtn').addEventListener('click',BlackJackHit);
document.querySelector('#dealbtn').addEventListener('click',BlackJackDeal);
document.querySelector('#standbtn').addEventListener('click',dealerLogic);

function BlackJackHit()
{
    if(blackjackGame['stand']==false)
    {
    let card= randomCard();
    showCard(card,YOU);  
    updateScore(card,YOU);
    showScore(YOU); 
    console.log(YOU['score']);
    }
}

function randomCard()
{
    let randomIndex = Math.floor(Math.random() *13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card,activePlayer)
{
    if(activePlayer['score'] <=21)
    {
    let cardImage= document.createElement('img');
    cardImage.src = `${card}.png`;
    cardImage.setAttribute('style',"height:34%; width:22%;");
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play(); 
    }
}

function BlackJackDeal()
{
 // showResult(computeWinner());  // if you want to make it multiplayer
    
    if(blackjackGame['turnsOver']==true) {
        blackjackGame['stand']=false;
    let yourImages = document.querySelector('#YourBox').querySelectorAll('img');
    let dealerImages = document.querySelector('#DealerBox').querySelectorAll('img');
    
    for(let i=0;i< yourImages.length;i++)
    yourImages[i].remove();
    for(let i=0;i< dealerImages.length;i++)
    dealerImages[i].remove();

    YOU['score']=0;
    DEALER['score']=0;

    document.querySelector('#YourResult').textContent=0;
    document.querySelector('#YourResult').style.color='white';
    document.querySelector('#DealerResult').textContent=0;
    document.querySelector('#DealerResult').style.color='white';

    document.querySelector('#blackjack-result').textContent ="Let's Play!";
    document.querySelector('#blackjack-result').style.color ='white';
    blackjackGame['turnsOver']=true;
 }
}

function updateScore(card,activePlayer)
{
    //if adding 11 <= 21 then add 11 else add 1.
    if(card=='a')
    {
      if(activePlayer['score']+ blackjackGame['cardsVal'][card] <= 21)
       {
        activePlayer['score'] += blackjackGame['cardsVal'][card][1];
       }
       else
       {
        activePlayer['score'] += blackjackGame['cardsVal'][card][0];
       }
    }
    else
    {
    activePlayer['score'] += blackjackGame['cardsVal'][card];
    }
}


function showScore(activePlayer)
{
    if(activePlayer['score'] > 21)
    {
        document.querySelector(activePlayer['scoreSpan']).textContent ='BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color ='red';
    }
    else
    {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve,ms));
}
 async function dealerLogic()
{
    blackjackGame['stand']=true;

    while(DEALER['score'] <16 && blackjackGame['stand']===true)
    {
    let card= randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
    }
        blackjackGame['turnsOver']=true;
        let winner= computeWinner();
        showResult(winner);
}

//compute winner and return who won

function computeWinner()
{
    let winner;
    //condition when yourscore > dealerscore or when dealer busts .
    if(YOU['score'] <= 21)
    {
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] >21))
        {
            blackjackGame['wins']++;
            winner=YOU;
        }
        else if(YOU['score'] < DEALER['score'])
        {
            blackjackGame['losses']++;
            winner=DEALER;
        }
        else if(YOU['score'] === DEALER['score'])
        {
            blackjackGame['draws']++;
        }

    }
    //when user busts but dealer doesn't
    else if(YOU['score'] > 21 && DEALER['score'] <=21)
    {
        blackjackGame['losses']++;
        winner=DEALER;
    }
    else if(YOU['score'] > 21 && DEALER['score'] >21)
    {
        blackjackGame['draws']++;
    }

    return winner;
}


function showResult(winner)
{
  let msg, msgColor;
  if(blackjackGame['turnsOver']==true)
  {
  if(winner ==YOU)
  {
      document.querySelector('#wins').textContent=blackjackGame['wins'];
      msg= 'You Won';
      msgColor ='green';
      winSound.play();
  }
  else if(winner ==DEALER)
  {
    document.querySelector('#losses').textContent=blackjackGame['losses'];
    msg= 'You Loss';
    msgColor ='red';
    lossSound.play();
  }
  else{
    document.querySelector('#draws').textContent=blackjackGame['draws'];
    msg= 'You Drew';
    msgColor ='yellow';
  }

  document.querySelector('#blackjack-result').textContent= msg;
  document.querySelector('#blackjack-result').style.color= msgColor;
  }
}