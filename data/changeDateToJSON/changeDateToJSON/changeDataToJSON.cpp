/* ************************************************************************** 
/* 
/*   changeDataToJSON.cpp                               
/*                                                                            
/*   By: 刘斌 <b-liu14@mails.tsinghua.edu.cn>                                                                         
/*
/*   Created: 2015/12/20 09:08:52 by 刘斌                                                                           
/*   Updated: 2015/12/20 09:55:35 by 刘斌                  
/*                                                                      
/*   System  Environment: windows10 education
/*   Delelop Environment: sublime text 3 
/*   
/* **************************************************************************/ 

#include <fstream>
#include <vector>
#include <string>
#include <cstring>
using namespace std;
int maxn = 250;
int edge_sample_dist = 10;
std::vector<int> source;
std::vector<int> target;
std::vector<double> weight;

class Node
{
public:
	string ID;
	string name;
	string href;
	string star;
	string description;
	string detail;

	friend ostream& operator << (ostream& out, Node& n);
	friend istream& operator >> (istream& in, Node& n);
};

ostream& operator << (ostream& out, Node& node)
{
	out << "		{" << endl;
	out << "			\"ID\": \"" << node.ID << "\"," << endl;
	out << "			\"name\": \"" << node.name << "\"," << endl;
	out << "			\"href\": \"" << node.href << "\"," << endl;
	out << "			\"star\": \"" << node.star << "\"," << endl;
	out << "			\"description\": \"" << node.description << "\"," << endl;
	out << "			\"detail\": \"" << node.detail << "\"" << endl;
	out << "		}";
}

istream& operator >> (istream& in, Node& node)
{
	int index;
	in >> index >> node.ID >> node.name 
	   >> node.href >> node.star >> node.description;
	getline(in, node.detail);
}

std::vector<Node> nodes;
int main()
{
	fstream fin_links("link.txt", ios::in);
	fstream fin_nodes("node.txt", ios::in);
	fstream fout_graph("../../graph.json", ios::out);
	int s, t;
	double w;
	while(fin_links >> s >> t >> w)
	{
		if(s < maxn && t < maxn)
		{
			source.push_back(s);
			target.push_back(t);
			weight.push_back(w);
		}
		
	}
	Node node;
	while(fin_nodes >> node)
	{
		nodes.push_back(node);
	}
	fout_graph << "{" << endl;
	fout_graph << "	\"nodes\":" << endl;
	fout_graph << "	[" << endl;
	for(int i = 0; i < nodes.size()-1; i ++)
	{
		fout_graph << nodes[i] << "," << endl;
	}
	fout_graph << nodes.back();
	fout_graph << "	 ]," << endl;
	fout_graph << "	\"links\":" << endl;
	fout_graph << "	[" << endl;
	for(int i = 0; i < source.size()-1; i ++)
	if(i % edge_sample_dist == 0 && weight[i] > 0)
	{
		fout_graph << "		{" << endl;
		fout_graph << "			\"source\": " << source[i] << "," << endl;
		fout_graph << "			\"target\": " << target[i] << "," << endl;
		fout_graph << "			\"weight\": " << weight[i] << ""  << endl;
		fout_graph << "		}," << endl;
	}
	fout_graph << "		{" << endl;
	fout_graph << "			\"source\": " << source.back() << "," << endl;
	fout_graph << "			\"target\": " << target.back() << "," << endl;
	fout_graph << "			\"weight\": " << weight.back() << ""  << endl;
	fout_graph << "		}" << endl;
	fout_graph << "	 ]" << endl;
	fout_graph << "}" << endl;
	return 0;
}