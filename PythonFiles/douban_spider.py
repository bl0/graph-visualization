#coding=utf8
import re , urllib , urllib2, cookielib , base64 , binascii , time , json , math

class MovieNode:
    '电影'
    nodeNum = 0 

    def __init__(self, m_id, m_title,m_detail,m_star,m_topic,m_href):
        self.m_num = MovieNode.nodeNum
        self.m_id = m_id
        self.m_title = m_title
        self.m_detail = m_detail[0] + m_detail[1]
        self.m_star = m_star
        self.m_topic = m_topic
        self.m_href = m_href
        self.m_commentNum = 0
        self.m_commentDic = {}
        MovieNode.nodeNum += 1
    
    def __print__(self,fp_node):
        fp_node.write(`self.m_num` + ' ' + self.m_id + ' ' + self.m_title + ' ' + self.m_href + ' ' + self.m_star + ' ' + self.m_topic + ' ' + self.m_detail + '\n')


def getInfo(url):
    for x in range(0,1):
        getPageInfo(url+'?start='+ `25*x` +'&filter=')

def getPageInfo(url):
    global reg_detail,reg_title,reg_star,reg_topic,reg_href,namelist,fp_edge
    time.sleep(2)
    html = getHtml(url)
    detail_list = re.findall(reg_detail, html)
    title_list = re.findall(reg_title, html)
    star_list = re.findall(reg_star, html)
    topic_list = re.findall(reg_topic, html)
    href_list = re.findall(reg_href, html)
    for x in range(0,1):
        node = MovieNode(href_list[x][-10:-3],title_list[x][51:-1],detail_list[x][41:-26].split('\n'),star_list[x][12:-1],topic_list[x][6:-1],href_list[x][6:-2])
        namelist.append(node)
        # node.__print__(fp_node)
        try:
            getComments(node.m_href+'reviews',namelist[MovieNode.nodeNum - 1])
        except:
            print(node.m_title + '页面不存在')
            continue
        print('已读取' + `MovieNode.nodeNum` + '部电影')
        fp_edge.write('$' + ' ' + `MovieNode.nodeNum` + '\n')


def getComments(url,node):
    global reg_commentNum
    _count = 0
    html = getHtml(url)
    node.m_commentNum = int(re.findall(reg_commentNum,html)[0][8:-1],10)
    print(node.m_commentNum/20+1)
    getPageComments(url,url,node,node.m_commentNum/20+1,_count)

def getPageComments(url,url_head,node,page_num,_count):
    global reg_comment,fp_edge,edgeNum
    flag = 0
    _count += 1
    print(_count)
    time.sleep(2)
    html = getHtml(url)
    fp = open('yeah.html' , 'w')
    fp.write(html)
    fp.close()
    reg_nextPage = re.compile(r'href=".start=\d+.+c')
    reg_people = re.compile(r'people/.+/"')
    reg_star = re.compile(r'allstar\d+')
    comment_list = re.findall(reg_comment,html)
    for x in range(0,len(comment_list)):
        flag = 1
        if len(re.findall(reg_star,comment_list[x])) == 0:
            continue
        else:
            people_id = re.findall(reg_people,comment_list[x])[0][7:-2]
            star = int(re.findall(reg_star,comment_list[x])[0][7:],10)
            node.m_commentDic[people_id] = star
            fp_edge.write(people_id + ' ' + `star` + '\n')
    if _count < page_num and flag == 1:
        nextpage = re.findall(reg_nextPage,html)[0][6:-16]
        return getPageComments(url_head + nextpage,url_head,node,page_num,_count)
    else:
        return
        
def getHtml(url):
    headers = {
        'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
    }
    request = urllib2.Request(url = url,headers = headers)
    response = urllib2.urlopen(request) 
    html = response.read()
    return html

def calculating(namelist):
    global fp_link,edgeNum
    for i in range(0,MovieNode.nodeNum):
        for j in range(i+1,MovieNode.nodeNum):
            firstWeight = 0
            secondWeight = 0.0
            flag = 0
            for key in namelist[i].m_commentDic:
                if key not in namelist[j].m_commentDic:
                    continue
                else:
                    flag = 1
                    firstWeight += 1
                    secondWeight += 1.0/(abs(namelist[i].m_commentDic[key]-namelist[j].m_commentDic[key])/10 + 1)
            if flag == 1:
                edgeNum += 1
                fp_link.write(`i` + ' ' + `j` + ' ' + `firstWeight + secondWeight` + '\n')
                print(`i` + ' ' + `j` + ' ' + `firstWeight + secondWeight` + '\n')
                 
# url = 'http://movie.douban.com/subject/1292052/reviews?start=1568&filter=&limit=20'
# html = getHtml(url)
# fp = open('yeah.html' , 'w')
# fp.write(html)
# fp.close()

edgeNum = 0
url = 'http://movie.douban.com/top250'
namelist = []
fp_info = open('info.txt' , 'w')
fp_edge = open('graph.txt', 'w')
fp_link = open('link.txt','w')
# fp_node = open('node.txt', 'w')
reg_commentNum = re.compile(r'影评 \(\d+\)')
reg_detail = re.compile(r'<p class="">\n.+\n.+\n.+<')
reg_title = re.compile(r'">\n.+<span class="title">.+<')
reg_star = re.compile(r'"v:average">.+<')
reg_topic = re.compile(r'"inq">.+<')
reg_href = re.compile(r'href="http://movie.douban.com/subject/.+/">')
reg_comment = re.compile(r'http://www.douban.com/people/.+/" .+\s+.+\s+.+</span>')
try:
    getInfo(url)            
except:
    print("程序已跪") 
else:
    print("程序正常退出") 
calculating(namelist)
fp_info.write(`MovieNode.nodeNum`+' '+`edgeNum`)
fp_info.close()
fp_link.close()
fp_edge.close()
# fp_node.close()