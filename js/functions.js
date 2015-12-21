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

function path_display()
{
    alert("path_display");
}

function mst_display()
{
    alert("mst_display");
}

function betweenness_centrality_display()
{
    alert("betweenness_centrality_display");
}

function closeness_centrality_display()
{
    alert("closeness_centrality_display");
}

function connected_component_display()
{
  for (var i = nodes.length - 1; i >= 0; i--)   {
    if(nodes[i].id == 10)
      nodes[i].style.fill = "red";
    else
      nodes[i].style.fill = "black";
  };
}