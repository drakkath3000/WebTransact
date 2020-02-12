// Sets the number of stars we wish to display
const numStars = 200;
var randomSpaceship = Math.floor(Math.random() * 10);

// For every star we want to display
for (let i = 0; i < numStars; i++) {
    let star = document.createElement("div");
    star.className = "star";
    var xy = getRandomPosition();
    star.style.top = xy[0] + 'px';
    star.style.left = xy[1] + 'px';
    document.body.append(star);
}

// Gets random x, y values based on the size of the container
function getRandomPosition() {
    var y = window.innerWidth;
    var x = window.innerHeight;
    var randomX = Math.floor(Math.random()*x);
    var randomY = Math.floor(Math.random()*y);
    return [randomX,randomY];
}

function getData() {

    $.ajax({

            url: "https://www.swapi.co/api/starships/" + Math.floor(Math.random()*32),
            success: function(data)
            {
            $("#ShipName").html(data.name);
            $("#ShipModel").html(data.model);
            $("#ShipClass").html(data.starship_class);
            $("#ShipManufacturer").html(data.manufacturer);
            $("#ShipCost").html(data.cost_in_credits);
            $("#ShipSize").html(data.length);
            $("#ShipMembers").html(data.crew);
            $("#ShipPassengers").html(data.passengers);
            $("#ShipMaxLoad").html(data.cargo_capacity);
            },
            error: function(){
                getData();
            }


    });

}


