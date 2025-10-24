console.log("%c ------------ PJK Section Thumbnails (Responsive Dynamic Scaling) ------------", "color: yellow;");

fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  })
  .then(data => {
    const groupsArr = data[0].groups;

    const toCamelCase = str =>
      str
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/^(.)/, c => c.toLowerCase());

    const sortedGroups = groupsArr.filter(g => g.name !== "Open Bar" && g.name !== "Close Bar")
                                  .sort((a,b) => a.name.localeCompare(b.name));

    const resetMain = () => d3.select("#mainContainer").selectAll("*").remove();
    const resetAll = () => {
      d3.select("#titleDiv").selectAll("*").remove();
      resetMain();
    };

    let currentSections = [];
    let currentIndex = 0;

    // Build layout
    const buildLayout = () => {
      d3.select("body").append("div").attr("id", "navDiv");
      d3.select("body").append("div").attr("id", "titleDiv");
      d3.select("body").append("div").attr("id", "mainContainer");
      d3.select("body").append("div").attr("id", "bottomNav");

      // Top nav
      const navDiv = d3.select("#navDiv");
      sortedGroups.forEach(group => {
        navDiv.append("button")
          .attr("class", "drop-downs")
          .attr("data-group", group.name)
          .text(group.name);
      });

      // Bottom nav (stretch 2 buttons)
      const bottomNav = d3.select("#bottomNav");
      ["Open Bar", "Close Bar"].forEach(name => {
        bottomNav.append("button")
          .attr("class", "bottom-button")
          .attr("data-group", name)
          .text(name);
      });
    };

    // Compute responsive thumbnail width based on number of thumbnails & screen width
    const getThumbWidth = (count) => {
      const screenWidth = window.innerWidth;

      if(screenWidth >= 1200){ // desktop
        if(count === 1) return 60;
        if(count === 2) return 40;
        if(count === 3) return 30;
        if(count === 4) return 25;
        if(count === 5) return 20;
        return 18;
      } else if(screenWidth >= 768){ // tablet
        if(count === 1) return 70;
        if(count === 2) return 50;
        if(count === 3) return 35;
        if(count === 4) return 30;
        return 25;
      } else { // mobile
        if(count === 1) return 90;
        if(count === 2) return 70;
        if(count === 3) return 60;
        return 50;
      }
    };

    const showGroup = groupName => {
      resetMain();
      const group = groupsArr.find(g => g.name === groupName);
      if(!group) return;

      d3.select("#titleDiv").text(groupName);

      const sortedSections = group.sections.slice().sort((a,b)=>{
        if(a.order && b.order) return a.order - b.order;
        if(a.order && !b.order) return -1;
        if(!a.order && b.order) return 1;
        return a.section.localeCompare(b.section);
      });

      currentSections = sortedSections;
      currentIndex = 0;

      const container = d3.select("#mainContainer");
      const count = sortedSections.length;
      const thumbWidth = getThumbWidth(count);

      const thumbs = container.selectAll(".thumb")
        .data(sortedSections)
        .enter()
        .append("div")
        .attr("class","thumb")
        .style("opacity",0)
        .style("width", thumbWidth + "vw");

      thumbs.append("img")
        .attr("src", d => `./images/${toCamelCase(d.section)}.jpg`)
        .attr("alt", d => d.section)
        .attr("id", d => toCamelCase(d.section))
        .attr("class","thumbnail")
        .on("click",(event,d)=>showFullImage(d.section));

      thumbs.transition()
        .duration(300)
        .style("opacity",1)
        .delay((_,i)=>i*50);
    };

    const showFullImage = title => {
      resetAll();
      d3.select("#titleDiv").text(title);

      const container = d3.select("#mainContainer");
      container.append("img")
        .attr("src", `./images/${toCamelCase(title)}.jpg`)
        .attr("alt", title)
        .attr("class","fullImage");

      // arrows
      container.append("button")
        .attr("class","nav-arrow")
        .attr("id","prevBtn")
        .html("<")
        .on("click",prevImage);

      container.append("button")
        .attr("class","nav-arrow")
        .attr("id","nextBtn")
        .html(">")
        .on("click",nextImage);

      currentIndex = currentSections.findIndex(s => s.section===title);
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

      // Initial full bar image
      d3.select("#titleDiv").text("PJK Neighborhood Chinese");
      d3.select("#mainContainer").append("img")
        .attr("src","./images/fullBarComplete.jpg")
        .attr("alt","PJK Neighborhood Chinese")
        .attr("class","fullImage");

      $("body").on("click",".drop-downs,.bottom-button",function(){
        const group = $(this).data("group");
        showGroup(group);
      });

      // Recompute thumbnail sizes on resize
      window.addEventListener("resize", () => {
        if(currentSections.length > 0){
          showGroup(d3.select("#titleDiv").text());
        }
      });
    });
  })
  .catch(err=>console.error("Error:",err));
