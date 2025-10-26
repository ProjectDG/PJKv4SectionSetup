console.log("%c ------------ PJK Section Thumbnails (Responsive) ------------", "color: yellow;");

fetch("data.json")
  .then(res => {
    if(!res.ok) throw new Error("Network error");
    return res.json();
  })
  .then(data => {

    var elem = document.getElementsByTagName("BODY")[0];

  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
    const groupsArr = data[0].groups;

    const toCamelCase = str =>
      str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
         .replace(/[^a-zA-Z0-9]/g, "")
         .replace(/^(.)/, c => c.toLowerCase());

    const sortedGroups = groupsArr.filter(g => g.name !== "Open Bar" && g.name !== "Close Bar")
                                  .sort((a,b) => a.name.localeCompare(b.name));

    const resetMain = () => d3.select("#mainContainer").selectAll("*").remove();
    const resetAll = () => resetMain();

    let currentSections = [];
    let currentIndex = 0;

    const buildLayout = () => {
      d3.select("body").append("div").attr("id","navDiv");
      d3.select("#navDiv").append("div").attr("id","navButtons");
      d3.select("body").append("div").attr("id","mainContainer");
      d3.select("body").append("div").attr("id","bottomNav");

      const navDiv = d3.select("#navButtons");
      sortedGroups.forEach(group => {
        navDiv.append("button")
          .attr("class","drop-downs")
          .attr("data-group",group.name)
          .text(group.name);
      });

      const bottomNav = d3.select("#bottomNav");
      ["Open Bar","Close Bar"].forEach(name => {
        bottomNav.append("button")
          .attr("class","bottom-button")
          .attr("data-group",name)
          .text(name);
      });

      adjustMainContainer();
    };

    const adjustMainContainer = () => {
      const navHeight = document.getElementById("navDiv").offsetHeight;
      const bottomHeight = document.getElementById("bottomNav").offsetHeight;
      const main = document.getElementById("mainContainer");
      main.style.top = navHeight + "px";
      main.style.bottom = bottomHeight + "px";
      main.style.position = "absolute";
    };

    window.addEventListener("resize", adjustMainContainer);

    const showGroup = groupName => {
      resetMain();
      const group = groupsArr.find(g => g.name === groupName);
      if(!group) return;

      currentSections = group.sections.slice().sort((a,b)=>{
        if(a.order && b.order) return a.order - b.order;
        if(a.order && !b.order) return -1;
        if(!a.order && b.order) return 1;
        return a.section.localeCompare(b.section);
      });
      currentIndex = 0;

      const container = d3.select("#mainContainer");
      const count = currentSections.length;

      let thumbWidth = 20;
      if(count === 1) thumbWidth = 60;
      else if(count === 2) thumbWidth = 40;
      else if(count === 3) thumbWidth = 30;
      else if(count === 4) thumbWidth = 25;
      else if(count === 5) thumbWidth = 20;

      const thumbs = container.selectAll(".thumb")
        .data(currentSections)
        .enter()
        .append("div")
        .attr("class","thumb")
        .style("opacity",0)
        .style("width", thumbWidth+"vw");

      thumbs.append("img")
        .attr("src", d => `./images/${toCamelCase(d.section)}.jpg`)
        .attr("alt", d => d.section)
        .attr("id", d => toCamelCase(d.section))
        .attr("class","thumbnail")
        .on("click",(event,d)=>showFullImage(d.section));

      thumbs.transition()
        .duration(50)
        .style("opacity",1)
        .delay((_,i)=>i*50);
    };

    const showFullImage = title => {
      resetAll();

      const container = d3.select("#mainContainer");
      container.append("img")
        .attr("src",`./images/${toCamelCase(title)}.jpg`)
        .attr("alt",title)
        .attr("class","fullImage");

      container.append("button")
        .attr("class","nav-arrow")
        .attr("id","prevBtn")
        .html("&lt;")
        .on("click",prevImage);

      container.append("button")
        .attr("class","nav-arrow")
        .attr("id","nextBtn")
        .html("&gt;")
        .on("click",nextImage);

      const section = currentSections.find(s => s.section === title);
      if(section) {
        const infoDiv = container.append("div")
          .attr("class","info-divs")
          .attr("id","infoDiv");

        if(section.title) {
          infoDiv.append("h3")
                 .text(section.title)
                 .style("marginTop","0.5em")
                 .style("marginBottom","0.2em")
                 .style("textDecoration","underline");
        }

        if(section.instructions && Array.isArray(section.instructions)) {
          section.instructions.forEach(ins => {
            infoDiv.append("h5")
                   .text(ins)
                   .style("marginTop","0.2em")
                   .style("marginBottom","0.5em")
                   .style("fontWeight","normal");
          });
        }

        if(section.info && Array.isArray(section.info)) {
          let ul = infoDiv.append("ul")
            .style("listStyleType","disc")
            .style("marginLeft","20px");

          section.info.forEach(item => {
            if(!item || item.trim() === "") return;

            if(item === "HR") {
              ul.append("hr")
                .style("width","95%")
                .style("border","none")
                .style("height","2px")
                .style("margin","10px auto")
                .style("background","linear-gradient(to right, rgba(227,191,127,0), rgb(227,191,127), rgba(227,191,127,0))");
            } else if(item.toLowerCase().startsWith("insert")) {
              const match = item.match(/'(.*?)'/);
              const text = match ? match[1] : item;
              // close previous UL and insert P
              ul = null;
              infoDiv.append("p")
                     .text(text)
                     .style("margin","2px 0")
                     .attr("class", "inserts");
              // create new UL for following items
              ul = infoDiv.append("ul")
                          .style("listStyleType","disc")
                          .style("marginLeft","20px");
            } else {
              if(!ul) {
                ul = infoDiv.append("ul")
                            .style("listStyleType","disc")
                            .style("marginLeft","20px");
              }
              ul.append("li").text(item);
            }
          });
        }
      }

      currentIndex = currentSections.findIndex(s=>s.section===title);
    };

    const nextImage = () => {
      if(currentSections.length===0) return;
      currentIndex = (currentIndex+1) % currentSections.length;
      showFullImage(currentSections[currentIndex].section);
    };

    const prevImage = () => {
      if(currentSections.length===0) return;
      currentIndex = (currentIndex-1+currentSections.length) % currentSections.length;
      showFullImage(currentSections[currentIndex].section);
    };

    $(document).ready(()=>{
      buildLayout();

      d3.select("#mainContainer").append("img")
        .attr("src","./images/fullBarComplete.jpg")
        .attr("alt","PJK Neighborhood Chinese")
        .attr("class","fullImage");

      $("body").on("click",".drop-downs,.bottom-button",function(){
        openFullscreen();

        const group = $(this).data("group");
        showGroup(group);
      });
    });

  })
  .catch(err => console.error("Error:",err));
