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

function link_width(weight)
{
  return Math.sqrt(weight)/2;
}

function link_init()
{
  link.style("stroke", "#999")
    .style("stroke-opacity", 0.6)
    .style("stroke-width", function(d){return link_width(d.weight)});
}

function init()
{
  link_init();
  node_init();
}

function get_path(i, j, path, index)
{
  var targetNode  = document.getElementById(i.toString()+"_node");
  path[index++] = parseInt(targetNode.id);
  if(i == j)
   ;
  else if(paths[i][j] == Number.POSITIVE_INFINITY) 
  {
    var targetNode  = document.getElementById(j.toString()+"_node");
    path[index++] = parseInt(targetNode.id);
  }
  else
  {
    index = get_path(i, paths[i][j], path, index);
    index = get_path(paths[i][j], j, path, index);
  } 
  return index;
}

function path_display()
{
  init();
  var sourceIndex = parseInt(document.getElementsByClassName("source")[0].value);
  var targetIndex = parseInt(document.getElementsByClassName("target")[0].value);
  var sourceNode  = document.getElementById(sourceIndex.toString()+"_node");
  var targetNode  = document.getElementById(targetIndex.toString()+"_node");
  var path = new Array(50);
  var index = 0;
  index = get_path(sourceIndex, targetIndex, path, 0);
  node.style("r", function(d){
    for(var i = 0; i < index; i ++)
    {
      if(path[i] == d.index)
      {
        return 5;
      }
    }
    return 0;
  });
  link.style("stroke-width", function(d){
    for(var i = 0; i < index-1; i ++)
    {
      if(path[i] == d.source.index && path[i+1] == d.target.index)
      {
        return link_width(d.weight);
      }
    }
    return 0;
  });
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