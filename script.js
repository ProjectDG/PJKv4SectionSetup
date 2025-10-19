console.log("%c ------------ Welcome to PJK Section Setup ------------", "color: yellow;");


fetch('data.json')
.then(response => {
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
})
.then(data => {

    // console.log(data[0].sections)
    let fullSectionInfo = data[0].sections;
  
      $(document).ready(function() {

        // Nav div
        d3.select("body").append("div").attr("id", "navDiv").attr("class", "setup");

        // Menu Button
        d3.select("#navDiv").append("button").attr("class", "buttons").attr("id", "menuButton").text("Sections");

        // Title div
        d3.select("#navDiv").append("div").attr("id", "titleDiv").attr("class", "setup");

        // Title
        let title = fullSectionInfo["section"];
        console.log(title);
        d3.select("#titleDiv").append("h1").attr("id", "Title").text(title);

        // Main div
        d3.select("body").append("div").attr("id", "mainContainer").attr("class", "setup");


        // Image Test
        d3.select("#mainContainer").append("img").attr("src", "./images/liquorOverstock.png").attr("alt", "Liquor Overstock");


        // Sections Menu Click Function
        $('body').on('click', '#menuButton', function(event) {
            $("#titleDiv").empty();
            $("#mainContainer").empty();

            d3.select("#mainContainer").append("button").attr("class", "buttons section-buttons").attr("id", "placeholder").text(title);   // --------------------------  fix id
        });    



      }); // End of jQuery

  
})
.catch(error => {
  console.error('There was a problem...', error);
});