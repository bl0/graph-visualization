function checkField(id)
{
  var path = document.getElementById("path");
  var mst = document.getElementById("mst");
  var centrality = document.getElementById("centrality");
  var connected_component = document.getElementById("connected_component");
  path.style.display = "none";
  mst.style.display = "none";
  centrality.style.display = "none";
  connected_component.style.display = "none";

  if(id == 0)
  {
    path.style.display = "block";
    path_display();
  }
  else if(id == 1)
  {
    mst.style.display = "block";
    mst_display();
  }
  else if(id == 2)
  {
    centrality.style.display = "block";
    betweenness_centrality_display();
  }
  else if(id == 3)
  {
    connected_component.style.display = "block";
    connected_component_display();
  }
  else
  {
    alert(id);
  }
}  

function node_init()
{
  node.style("fill", "#0000ff")
    .style("r", 5)
    .style("stroke-width", 1.5);
    
}

function link_init()
{
  link.style("stroke", "#999")
    .style("stroke-opacity", 0.6)
    .style("stroke-width", function(d){return Math.sqrt(d.weight)/2;});
}

function init()
{
  link_init();
  node_init();
}

function path_display()
{
  init();
  alert("path_display");
}

function mst_display()
{
  init();
  alert("mst_display");
}

function betweenness_centrality_display()
{
  init();
  alert("betweenness_centrality_display");
}

function closeness_centrality_display()
{
  init();
  alert("closeness_centrality_display");
}

function connected_component_display()
{
  var Threshold = document.getElementById("Threshold_input").value;
  link.style("stroke-width", function(d){

    if(parseFloat(Threshold) <= d.weight)
      return Math.sqrt(d.weight)/2;
    else 
      return 0;
  });
}

function Threshold_changed()
{
  var Threshold = document.getElementById("Threshold").value;
  var Threshold_output = document.getElementById("Threshold_input");
  Threshold_output.value = Threshold; 
  connected_component_display();
}

function Threshold_input_changed()
{
  var Threshold = document.getElementById("Threshold_input").value;
  var Threshold_output = document.getElementById("Threshold");
  Threshold_output.value = Threshold; 
  connected_component_display();
}