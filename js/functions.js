// 根据选择的功能切换功能视图
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

// 返回权值为weight的边所对应的宽度
function link_width(weight)
{
  // return Math.sqrt(weight)/2;
  return Math.log(weight) / 2;
}

// 将节点的style初始化
function node_init()
{
  node.style("fill", "#0000ff")
    .style("r", 5)
    .style("stroke-width", 1.5);
}

// 将边的style初始化
function link_init()
{
  link.style("stroke", "#999")
    .style("stroke-opacity", 0.6)
    .style("stroke-width", function(d){return link_width(d.weight)});
}

// 将点和边的style初始化
function init()
{
  link_init();
  node_init();
}

// 根据warshall算法算出来的路径paths计算从起点i到终点j的路径path。
// 其中index为路径的长度。
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

// 最短路径的可视化
function path_display()
{
  var sourceIndex = parseInt(document.getElementById("source").value);
  var targetIndex = parseInt(document.getElementById("target").value);
  if (sourceIndex >= n || sourceIndex < 0) 
  {
    alert("请输入0~" + (n-1).toString() + "的数字");
    return;
  };
  if (targetIndex >= n) 
  {
    alert("请输入0~" + (n-1).toString() + "的数字");
    return;
  };
  var sourceNode  = document.getElementById(sourceIndex.toString()+"_node");
  var targetNode  = document.getElementById(targetIndex.toString()+"_node");
  var path_length = document.getElementById("view_weight");
  var path = new Array(n);
  var index = 1;
  var total_weight = 0;
  path[0] = sourceIndex;
  index = get_path(sourceIndex, targetIndex, path, index);
  for (var i = 0; i < index-1; i++) 
  {
    total_weight += edges[path[i]][path[i+1]];
  }
  path_length.value = total_weight.toPrecision(6);
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
}

// 最小生成树的可视化
function mst_display()
{
  var path = new Array(n);
  var total_weight = 0;
  var root = parseInt(document.getElementById("root").value);
  var path_length = document.getElementById("view_tree_weight");
  var Threshold = document.getElementById("Threshold_input_tree").value;
  if (root >= n || root < 0) 
  {
    alert("请输入0~" + (n-1).toString() + "的数字");
    return;
  };
  total_weight = spanning_tree(root,path,Threshold);
  path_length.value = total_weight.toPrecision(6);
  node.style("fill", function(d){
    if (path[d.index].prev == -2) 
    {
      return "#FFFF00";
    };
    if(path[d.index].prev != -1)
    {
      return "#FA0404";
    };
    return "#0000ff";
  });

  node.style("stroke_opacity", function(d){
    if(path[d.index].prev != -1)
    {
      return 1;
    };
    return 0.4;
  });
  link.style("stroke", function(d){
    for(var i = 0; i < n; i ++)
    {
      if(path[i].next_num)
      {
        for (var j = 0; j < path[i].next_num; j++) 
        {
          if ((i == d.source.index && path[i].next[j] == d.target.index)
            || (path[i].next[j] == d.source.index && i == d.target.index)) 
          {
            return "#0A0A0A";
          }
        }
      }
    }
    return "#999";
  });

  link.style("stroke-opacity", function(d){
    for(var i = 0; i < n; i ++)
    {
      if(path[i].next_num)
      {
        for (var j = 0; j < path[i].next_num; j++) 
        {
          if ((i == d.source.index && path[i].next[j] == d.target.index)
            || (path[i].next[j] == d.source.index && i == d.target.index)) 
          {
            return 1;
          }
        }
      }
    }
    return 0.1;
  });
}

function Threshold_changed_tree()
{
  var Threshold = document.getElementById("Threshold_tree").value;
  var Threshold_output = document.getElementById("Threshold_input_tree");
  Threshold_output.value = Threshold; 
  mst_display();
}

function Threshold_input_changed_tree()
{
  var Threshold = document.getElementById("Threshold_input_tree").value;
  var Threshold_output = document.getElementById("Threshold_tree");
  Threshold_output.value = Threshold; 
  mst_display();
} 

function SearchNode()
{
　this.dist = 0;
　this.flag = false;
  this.next = new Array(n);
  this.next_num = 0;
  this.prev = -1;
}

// 使用prim算法生成最小生成树
function spanning_tree(root,searchnode,limit_length)
{
  var search_num;
  var visited_node = new Array(n);
  var path_length;
  for (var i = 0; i < n; ++i)
  {
    searchnode[i] = new SearchNode();
    if (edges[root][i] <= limit_length) 
      {
        searchnode[i].dist = Number.POSITIVE_INFINITY;
      }
    else 
      searchnode[i].dist = edges[root][i];
    if (searchnode[i].dist != Number.POSITIVE_INFINITY) {searchnode[i].prev = root};
    searchnode[i].flag = false;                                // 初始都未用过该点
  }
  path_length = 0;
  search_num = 0;                                              // 选取0为初始点
  visited_node[0] = root;
  searchnode[root].dist = 0;
  searchnode[root].flag = true;
  searchnode[root].prev = -2;
  search_num++;
  for (var i = 0; i < n; i++)
  {
    if (search_num == n)
    {
      break;
    }
    var nodeFlag = false;
    var mindist = 999999;
    var u = 0;
    var j;                      // 找出当前未使用的点j的dist[j]最小值
    for (j = 0; j < n; ++j)
      if ((!searchnode[j].flag) && searchnode[j].dist < mindist)
      {
        u = j;                             // u保存当前邻接点中距离最小的点的号码 
        mindist = searchnode[j].dist;     
        nodeFlag = true;      
      }
    if (nodeFlag == false) 
    {
      break; 
    };
    searchnode[u].flag = true;
    searchnode[searchnode[u].prev].next[searchnode[searchnode[u].prev].next_num] = u;
    searchnode[searchnode[u].prev].next_num++;
    path_length += searchnode[u].dist;
    visited_node[search_num] = u;
    search_num++; 
    for (j = 0; j < n; j++)
    {
      if (!searchnode[j].flag)
      {
        for (var i = 0; i < search_num; ++i)
        {
          if (edges[visited_node[i]][j] < searchnode[j].dist)
          {
            searchnode[j].dist = edges[visited_node[i]][j];
            searchnode[j].prev = visited_node[i];
          }   
        }
      }
    }
  }
  return path_length;
}

// 介数中心度的可视化
function betweenness_centrality_display()
{
  document.getElementById("centrality_type_show").value = "介数中心度";
  var BC = new Array(n);
  var total = 0;
  for(var i = 0; i < n; i ++)
  {
    BC[i] = 0;
  }
  //计算介数中心度
  for(var i = 0; i < n; i ++)
  {
    for(var j = 0; j < n; j ++)
    {
      if(i == j) continue;
      path = new Array(n);
      path[0] = i;
      index = 1;
      index = get_path(i, j, path, index);
      total ++;
      for(var k = 0; k < index; k ++)
      {
        BC[path[k]] ++;
      }
    }
  }
  for(var i = 0; i < n; i ++)
  {
    BC[i] = BC[i] / total;
  }
  //介数中心度可视化
  node.style("fill", function(d, i){
      var r = (1000*BC[i])*(1000*BC[i]);
      var g = 0;
      var b = 255 - r;
      return d3.rgb(r, g, b);
    });
}

//紧密中心度
function closeness_centrality_display()
{
  document.getElementById("centrality_type_show").value = "紧密中心度";
  var CC = new Array(n);
  var total = 0;
  for(var i = 0; i < n; i ++)
  {
    CC[i] = 0;
  }

  //计算紧密中心度
  for(var i = 0; i < n; i ++)
  {
    for(var j = 0; j < n; j ++)
    {
      if(i == j) continue;
      path = new Array(n);
      path[0] = i;
      index = 1;
      index = get_path(i, j, path, index);
      total ++;
      if(paths[i][j] == -1)
      {
        CC[i] += 1000;
      }
      else
      {
        var total_weight = 0;
        for (var k = 0; k < index-1; k++) 
        {
          total_weight += edges[path[k]][path[k+1]];
        }  
        CC[i] += total_weight;   
      }
    }
  }

  // 紧密中心度可视化
  node.style("fill", function(d, i){
      if(CC[i] > 1000*n*0.9)
        return "black";
      var r = 255 - Math.sqrt((CC[i] - 9000))*6;
      var g = 0;
      var b = 255 - r;
      return d3.rgb(r, g, b);
    });
}

// 深度优先搜索获取与当前节点curIndex相连的节点，并修改其颜色值
function dfs(curIndex, colors, thresold, visited_node)
{
  if(curIndex >= n)
    return;
  for(var i = 0; i < n; i ++)
  {
    if(visited_node[i] == false && edges[curIndex][i] != Number.POSITIVE_INFINITY && edges[curIndex][i] > thresold)
    {
      colors[i] = colors[curIndex];
      visited_node[i] = true;
      dfs(i, colors, thresold, visited_node);
    }
  }
}

// 连通分量的可视化
function connected_component_display()
{
  var color = d3.scale.category20();
  var Threshold = document.getElementById("Threshold_input").value;
  var colors = new Array(n);
  var color_count = 0;
  var visited_node = new Array(n);
  for(var i = 0; i < n; i ++)
  {
    visited_node[i] = false;
  }

  //遍历所有还未访问过的节点
  for(var i = 0; i < n; i ++)
  {
    if(visited_node[i] == false)
    {
      colors[i] = color(color_count);
      dfs(i, colors, Threshold, visited_node);
      color_count ++;
    }
  }
  node.style("fill", function(d, i)
  {
    return colors[i];
  });
  var link_count = 0;
  link.style("stroke-width", function(d)
  {
    if(d.weight > Threshold)
    {
      link_count ++;
      return link_width(d.weight);
    }
    else
    {
      return 0;
    }
  });
  var opacity = 1 / (1 + Math.log(link_count + 1));
  link.style("stroke", function(d)
  {
    return colors[d.target.index];
  });

  link.style("stroke-opacity", opacity);
}

// 阈值发生改变
function Threshold_changed()
{
  var Threshold = document.getElementById("Threshold").value;
  var Threshold_output = document.getElementById("Threshold_input");
  Threshold_output.value = Threshold; 
  connected_component_display();
}

// 阈值发生改变
function Threshold_input_changed()
{
  var Threshold = document.getElementById("Threshold_input").value;
  var Threshold_output = document.getElementById("Threshold");
  Threshold_output.value = Threshold; 
  connected_component_display();
} 