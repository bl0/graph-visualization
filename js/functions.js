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
    init();
    path.style.display = "block";
    path_display();
  }
  else if(id == 1)
  {
    init();
    mst.style.display = "block";
    mst_display();
  }
  else if(id == 2)
  {
    init();
    centrality.style.display = "block";
    betweenness_centrality_display();
  }
  else if(id == 3)
  {
    init();
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
  if(paths[i][j] == -1)
    return index;
  if(i == j)
   ;
  else if(paths[i][j] == j) 
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
  var sourceIndex = parseInt(document.getElementsByClassName("source")[0].value);
  var targetIndex = parseInt(document.getElementsByClassName("target")[0].value);
  if (sourceIndex >= n) 
  {
    alert("起点超过阈值" + (n-1).toString() + "!");
    return;
  };
  if (targetIndex >= n) 
  {
    alert("终点超过阈值" + (n-1).toString() + "!");
    return;
  };
  var sourceNode  = document.getElementById(sourceIndex.toString()+"_node");
  var targetNode  = document.getElementById(targetIndex.toString()+"_node");
  var path_length = document.getElementById("view_weight");
  var path = new Array(n);
  var index = 1;
  path[0] = sourceIndex;
  index = get_path(sourceIndex, targetIndex, path, index);
  if(paths[sourceIndex][targetIndex] == -1)
  {
    path_length.value = "POSITIVE_INFINITY";
    alert("起点与终点不连通");
  }
  else
  {
    var total_weight = 0;
    for (var i = 0; i < index-1; i++) 
    {
      total_weight += edges[path[i]][path[i+1]];
    }  
    path_length.value = total_weight;
    node.style("fill", function(d){
      for(var i = 0; i < index; i ++)
      {
        if(path[i] == d.index)
        {
          return "#FA0404";
        }
      }
      return "#0000ff";
    });
    link.style("stroke", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return "#0A0A0A";
        }
      }
      return "#999";
    });
      link.style("stroke-opacity", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return 1;
        }
      }
      return 0.1;
    });
        link.style("stroke", function(d){
      for(var i = 0; i < index-1; i ++)
      {
        if((path[i] == d.source.index && path[i+1] == d.target.index)
          || (path[i+1] == d.source.index && path[i] == d.target.index))
        {
          return "#0A0A0A";
        }
      }
      return "#999";
    });
  }
}

function mst_display()
{
  var path = new Array(n);
  var index = 1;
  var total_weight = 0;
  path[0] = sourceIndex;
  index = get_path(sourceIndex, targetIndex, path, index);
  for (var i = 0; i < index-1; i++) 
  {
    total_weight += edges[path[i]][path[i+1]];
  }
  path_length.value = total_weight;
  node.style("fill", function(d){
    for(var i = 0; i < index; i ++)
    {
      if(path[i] == d.index)
      {
        return "#FA0404";
      }
    }
    return "#0000ff";
  });
  link.style("stroke", function(d){
    for(var i = 0; i < index-1; i ++)
    {
      if((path[i] == d.source.index && path[i+1] == d.target.index)
        || (path[i+1] == d.source.index && path[i] == d.target.index))
      {
        return "#0A0A0A";
      }
    }
    return "#999";
  });
    link.style("stroke-opacity", function(d){
    for(var i = 0; i < index-1; i ++)
    {
      if((path[i] == d.source.index && path[i+1] == d.target.index)
        || (path[i+1] == d.source.index && path[i] == d.target.index))
      {
        return 1;
      }
    }
    return 0.1;
  });
      link.style("stroke", function(d){
    for(var i = 0; i < index-1; i ++)
    {
      if((path[i] == d.source.index && path[i+1] == d.target.index)
        || (path[i+1] == d.source.index && path[i] == d.target.index))
      {
        return "#0A0A0A";
      }
    }
    return "#999";
  });
}


// function spanning_tree()
// {
//   int search_num, path_length;
//   var *visited_node = new Array[200];
//   SearchNode *searchnode = new SearchNode[vertex_num];
//   for (int i = 0; i < vertex_num; ++i)
//   {
//     searchnode[i].dist = p[0][i].length;
//     searchnode[i].flag = false;                                // 初始都未用过该点
//   }
//   search_num = 0;
//   path_length = 0;                                // 选取0为初始点
//   visited_node[0] = 0;
//   searchnode[0].dist = 0;
//   searchnode[0].flag = true;
//   search_num++;
//   for (int i = 0; i < vertex_num; i++)
//   {
//     if (search_num == vertex_num)
//     {
//       break;
//     }
//     int mindist = 999999;
//     int u = 0;                      // 找出当前未使用的点j的dist[j]最小值
//     for (int j = 0; j < vertex_num; ++j)
//       if ((!searchnode[j].flag) && searchnode[j].dist < mindist)
//       {
//         u = j;                             // u保存当前邻接点中距离最小的点的号码 
//         mindist = searchnode[j].dist;           
//       }
//     searchnode[u].flag = true;
//     searchnode[searchnode[u].prev].next[searchnode[searchnode[u].prev].next_num] = u;
//     searchnode[searchnode[u].prev].next_num++;
//     path_length += searchnode[u].dist;
//     visited_node[search_num] = u;
//     search_num++; 
//     for (int j = 0; j < vertex_num; j++)
//     {
//       if (!searchnode[j].flag)
//       {
//         int prev = 0;
//         for (int i = 0; i < search_num; ++i)
//         {
//           if (p[visited_node[i]][j].length < searchnode[j].dist)
//           {
//             searchnode[j].dist = p[visited_node[i]][j].length;
//             searchnode[j].prev = visited_node[i];
//           }   
//         }
//       }
//     }
//   }
// }

function betweenness_centrality_display()
{
  var BC = new Array(n);
  var total = 0;
  for(var i = 0; i < n; i ++)
  {
    BC[i] = 0;
  }
  for(var i = 0; i < n; i ++)
  {
    for(var j = 0; j < n; j ++)
    {
      if(i == j) continue;
      path = new Array(n);
      path[0] = i;
      index = 1;
      index = get_path(i, j, path, index);
      for(var k = 0; k < index; k ++)
      {
        BC[path[k]] ++;
        total ++;
      }
    }
  }
  for(var i = 0; i < n; i ++)
  {
    BC[i] = BC[i] / total;
  }

  alert(BC[0]);
}

function closeness_centrality_display()
{
  alert("closeness_centrality_display");
}

function connected_component_display()
{
  var Threshold = document.getElementById("Threshold_input").value;
  link.style("stroke-width", function(d){return d.weight > Threshold ? link_width(d.weight) : 0; });
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