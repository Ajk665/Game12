var dog,sadDog,happyDog, database;
var foodS,foodStock;
var bed,garden,washroom;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState = 'Hungry';
var changeGame;
var readGame;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/dogImg1.png");
bed = loadImage("images/Bed Room.png");
garden = loadImage("images/Garden.png");
washroom = loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  //Added - Archana
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  readGame = database.ref('gameState');
  readGame.on("value",function(data){
    gameState = data.val();
  })



}

function draw() {

  currentTime=hour();
  console.log(currentTime);
  console.log(lastFed)
  if(currentTime == lastFed+1){

    //Added - Archana
    update("Playing");

    foodObj.garden();
   }else if(currentTime == lastFed+2){

    //Added - Archana
    update("Sleeping");

    foodObj.bedroom();

   }else if(currentTime >(lastFed+2) && currentTime<=(lastFed+4)){

    //Added - Archana
    update("Bathing");

    foodObj.washroom();
   }else{

    //Added - Archana
    update("Hungry");

    foodObj.display();

   }

  if(gameState != 'Hungry'){
    feed.hide();
    addFood.hide();

    //Added - Archana
    dog.remove();

  }else if(gameState = 'Hungry'){
    dog.addImage(sadDog);

    //Added - Archana
    feed.show();
    addFood.show();
  }

  /*fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }*/
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),

    //Added-Archana
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//Added - Archana
function update(state){
  database.ref('/').update({
    gameState:state
  })
}