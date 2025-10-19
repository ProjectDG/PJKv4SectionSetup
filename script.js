console.log("%c ------------ Welcome to PJK Section Setup ------------", "color: yellow;");


fetch('data.json')
.then(response => {
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
})
.then(data => {
  
      $(document).ready(function() {

        // Title div
        d3.select("body").append("div").attr("id", "titleDiv").attr("class", "setup");

        // Menu Button
        d3.select("#titleDiv").append("button").attr("class", "buttons").attr("id", "menuButton").text("Sections");

        // Main div
        d3.select("body").append("div").attr("id", "mainContainer").attr("class", "setup");


        // Image Test
        d3.select("#mainContainer").append("img").attr("src", "./images/liquorOverstock.png").attr("alt", "Liquor Overstock");


        // Sections Menu Click Function
        $('body').on('click', '#menuButton', function(event) {
            $("#mainContainer").empty();
        });    



      }); // End of jQuery

  
})
.catch(error => {
  console.error('There was a problem...', error);
});