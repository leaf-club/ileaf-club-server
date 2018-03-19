var getRandomNumber = function(){
    let randomNumber = "";
    for(let i=0;i<6;i++){
        randomNumber+=Math.floor(Math.random()*10);
    }
    return randomNumber;
}

module.exports = getRandomNumber;