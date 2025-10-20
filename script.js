console.log("%c ------------ Welcome to PJK Section Setup ------------", "color: yellow;");

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {

    let sectionArr = data[0].sections;

    // Sort once upfront
    sectionArr.sort((a, b) => a.section.localeCompare(b.section, undefined, { sensitivity: 'base' }));

    // Utility: clear title + main container
    const reset = () => {
      d3.select("#titleDiv").selectAll("*").remove();
      d3.select("#mainContainer").selectAll("*").remove();
    };

    // Utility: convert to camelCase
    const toCamelCase = str => {
      if (typeof str !== 'string') return '';
      const parts = str
        .trim()
        .replace(/[_\-]+/g, ' ')
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean);
      if (!parts.length) return '';
      const first = /[A-Z]/.test(parts[0].slice(1)) ? parts[0] : parts[0].toLowerCase();
      const rest = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
      return [first, ...rest].join('');
    };

    // Setup layout
    const buildLayout = () => {
      d3.select("body").append("div").attr("id", "navDiv").attr("class", "setup nav-divs");
      d3.select("#navDiv").append("div").attr("id", "titleDiv").attr("class", "setup");
      d3.select("body").append("div").attr("id", "mainContainer").attr("class", "setup");
      d3.select("body").append("div").attr("id", "bottomDiv").attr("class", "setup nav-divs");
      d3.select("#bottomDiv").append("button").attr("class", "buttons").attr("id", "menuButton").text("Sections");

      // Initial title and image
      d3.select("#titleDiv").append("h1").attr("id", "Title").text("PJK Neighborhood Chinese");
      d3.select("#mainContainer").append("img")
        .attr("src", "./images/fullBarComplete.jpeg")
        .attr("alt", "PJK Neighborhood Chinese")
        .attr("id", "fullBar");
    };

    $(document).ready(() => {
      buildLayout();

      // Menu button click (show sections)
      $('body').on('click', '#menuButton, #fullBar', function() {
        reset();

        sectionArr.forEach(x => {
          const section = x.section;
          const camelCase = toCamelCase(section);
          d3.select("#mainContainer")
            .append("button")
            .attr("class", "buttons section-buttons")
            .attr("id", camelCase)
            .attr("val", section)
            .text(section);
        });
      });

      // Section button click (show image)
      $('body').on('click', '.section-buttons', function() {
        reset();
        const title = $(this).attr("val");
        const image = this.id;

        d3.select("#titleDiv").append("h1").attr("id", "Title").text(title);
        d3.select("#mainContainer")
          .append("img")
          .attr("src", `./images/${image}.jpeg`)
          .attr("alt", title);
      });
    });

  })
  .catch(error => console.error('There was a problem...', error));
