#coding=utf8
import re , urllib , urllib2, cookielib , base64 , binascii , rsa , time , json

# Set cookie
cookie_opener = urllib2.build_opener()
cookie_opener.addheaders.append(('Cookie', 'appver=2.0.2'))
cookie_opener.addheaders.append(('Referer', 'http://music.163.com'))
urllib2.install_opener(cookie_opener)

def GetFans(url):
    global find_re,str_fan,str_follow,url_head,namedic,nodeNum,edgeNum,fp_node,fp_edge,nameflag,find_img
    time.sleep(5)
    html = getHtml(url)
    # fp = open('yeah.txt' , 'w')
    # fp.write(html)
    # fp.close()
    find_list = re.findall(find_re, html)
    num = -1
    find_it = find_list[0]
    myId = find_it[4:14]
    myNick = find_it[21:-2]
    print ('get '+myNick+"'s fans")
    if nodeNum==0:
        fp_node.write(`nodeNum`+' '+myId+' '+myNick+'\n')
        nodeNum += 1
        nameflag[myId] = 1
        # img_list = re.findall(find_img,html)
        # urllib.urlretrieve(img_list[0],'%s.jpg' % nodeNum)
    namedic[myId] = nodeNum - 1
    for x in range(0,len(find_list)):
        find_it = find_list[x]
        num += 1
        if num == 0:
            continue
        nodeId = find_it[4:14]
        nodeNick = find_it[21:-2]
        # print(nodeNick)
        if nodeId not in namedic:             #判断是否访问过
            namedic[nodeId] = nodeNum
            if nodeId not in nameflag:
                nameflag[nodeId] = 0
            fp_node.write(`nodeNum`+' '+nodeId+' '+nodeNick+'\n')
            nodeNum += 1
        fp_edge.write(`namedic[nodeId]`+' '+`namedic[myId]`+' 1\n')
        edgeNum += 1

def GetFollows(url):
    global find_re,find_nextPage,str_fan,str_follow,url_head,namedic,nodeNum,edgeNum,fp_node,fp_edge,nameflag
    time.sleep(5)
    html = getHtml(url)
    # fp = open('yeah1.txt' , 'w')
    # fp.write(html)
    # fp.close()
    find_list = re.findall(find_re, html)
    num = -1
    find_it = find_list[0]
    myId = find_it[4:14]
    myNick = find_it[21:-2]
    print ('get '+myNick+"'s follows")
    for x in range(0,len(find_list)):
        find_it = find_list[x]
        num += 1
        if num == 0:
            continue
        nodeId = find_it[4:14]
        nodeNick = find_it[21:-2]
        # print(nodeNick)
        if nodeId not in namedic:             #判断是否访问过
            nodeNum += 1
            namedic[nodeId] = nodeNum
            if nodeId not in nameflag:
                nameflag[nodeId] = 0
            fp_node.write(`nodeNum`+' '+nodeId+' '+nodeNick+'\n')
        fp_edge.write(`namedic[myId]`+' '+`namedic[nodeId]`+' 1\n')
        edgeNum += 1
    del namedic[myId]
    

def GetInfo(url1,url2):
    global find_re,find_nextPage,str_fan,str_follow,url_head,namedic,nodeNum,edgeNum,fp_node,fp_edge,nameflag
    GetFans(url1)
    GetFollows(url2)
    while (len(namedic) != 0):
        if edgeNum >= 1000:
            break
        account = namedic.popitem()
        if nameflag[account[0]] == 0:
            GetFans(url_head+account[0]+str_fan)
            GetFollows(url_head+account[0]+str_follow)
            nameflag[account[0]] = 1

def getHtml(url):
    request = urllib2.Request(url)
    response = urllib2.urlopen(request) 
    html = response.read()
    data = json.loads(html)
    return data['result']

nodeNum = edgeNum = 0
url = 'http://music.163.com/api/playlist/detail?id=144421009'
namedic = {}
nameflag = {}
# fp_info = open('info.txt' , 'w')
# fp_edge = open('graph.txt', 'w')
# fp_node = open('node.txt', 'w')
reg = r'uid=\d+&fnick=.{4,30}&f'
find_re = re.compile(reg)
html = getHtml(url)
print(html['tracks'][0])
# fp = open('yeah.html' , 'w')
# fp.write(html['name'])
# fp.close()
# fp_info.write(`nodeNum`+' '+`edgeNum`)
# fp_info.close()
# fp_edge.close()
# fp_node.close()