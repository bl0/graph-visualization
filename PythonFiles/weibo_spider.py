#coding=utf8
# import 这边需要注意的是只有一个rsa这个模块是需要install的，其他的都是内置
import re , urllib , urllib2, cookielib , base64 , binascii , rsa , time

# 以下4行代码说简单点就是让你接下来的所有get和post请求都带上已经获取的cookie，因为稍大些的网站的登陆验证全靠cookie
cj = cookielib.LWPCookieJar()
cookie_support = urllib2.HTTPCookieProcessor(cj)
opener = urllib2.build_opener(cookie_support , urllib2.HTTPHandler)
urllib2.install_opener(opener)

# 封装一个用于get的函数，新浪微博这边get出来的内容编码都是-8
def getData(url) :
    request = urllib2.Request(url)
    response = urllib2.urlopen(request)
    text = response.read().decode('utf-8')
    return text

# 封装一个用于post的函数，验证密码和用户名都是post的，所以这个postData在本demo中专门用于验证用户名和密码
def postData(url , data) :
# headers需要我们自己来模拟
    headers = {'User-Agent' : 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)'}
# 这里的urlencode用于把一个请求对象用'&'来接来字符串化，接着就是编码成utf-8
    data = urllib.urlencode(data).encode('utf-8')
    request = urllib2.Request(url , data , headers)
    response = urllib2.urlopen(request)
    text = response.read().decode('gbk')
    return text

def login_weibo(nick , pwd) :
#==========================获取servertime , pcid , pubkey , rsakv===========================
# 预登陆请求，获取到若干参数
    prelogin_url = 'http://login.sina.com.cn/sso/prelogin.php?entry=weibo&callback=sinaSSOController.preloginCallBack&su=%s&rsakt=mod&checkpin=1&client=ssologin.js(v1.4.15)&_=1400822309846' % nick
    preLogin = getData(prelogin_url)
# 下面获取的四个值都是接下来要使用的
    servertime = re.findall('"servertime":(.*?),' , preLogin)[0]
    pubkey = re.findall('"pubkey":"(.*?)",' , preLogin)[0]
    rsakv = re.findall('"rsakv":"(.*?)",' , preLogin)[0]
    nonce = re.findall('"nonce":"(.*?)",' , preLogin)[0]
#===============对用户名和密码加密================
# 各种加密，最后形成了加密后的su和sp
    su = base64.encodestring(urllib.quote(nick))
    rsaPublickey = int(pubkey , 16)
    key = rsa.PublicKey(rsaPublickey , 65537)
    message = str(servertime) + '\t' + str(nonce) + '\n' + str(pwd)
    sp = binascii.b2a_hex(rsa.encrypt(message , key))
#=======================登录=======================　　
#param就是激动人心的登陆post参数，这个参数用到了若干个上面第一步获取到的数据
    param = {'entry' : 'weibo' , 'gateway' : 1 , 'from' : '' , 'savestate' : 7 , 'useticket' : 1 , 'pagerefer' : 'http://login.sina.com.cn/sso/logout.php?entry=miniblog&r=http%3A%2F%2Fweibo.com%2Flogout.php%3Fbackurl%3D' , 'vsnf' : 1 , 'su' : su , 'service' : 'miniblog' , 'servertime' : servertime , 'nonce' : nonce , 'pwencode' : 'rsa2' , 'rsakv' : rsakv , 'sp' : sp , 'sr' : '1680*1050' ,
             'encoding' : 'UTF-8' , 'prelt' : 961 , 'url' : 'http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack'}
# 这里就是使用postData的唯一一处，也很简单
    s = postData('http://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)' , param)
# 这个urll是登陆之后新浪返回的一段脚本中定义的一个进一步登陆的url，之前还都是获取参数和验证之类的，这一步才是真正的登陆，所以还需要再一次把这个urll获取到并用get登陆即可
    urll = re.findall("location.replace\(\'(.*?)\'\);" , s)[0]
    getData(urll)

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
    return html

# 登录微博
login_weibo('lsa0924@163.com','LSA19960506')
#======================获取粉丝====================
# 可以尝试着获取自己的微博主页

nodeNum = edgeNum = 0
url1 = 'http://weibo.com/2301528184/fans'
url2 = 'http://weibo.com/2301528184/follow'
namedic = {}
nameflag = {}
fp_info = open('info.txt' , 'w')
fp_edge = open('graph.txt', 'w')
fp_node = open('node.txt', 'w')
str_fan = '/fans'
str_follow = '/follow'
url_head = 'http://weibo.com/'
reg = r'uid=\d+&fnick=.{4,30}&f'
reg_img = r'http:././tp\d.sinaimg.cn./\d+./\d+./\d+./\d'
reg_nextPage=r'p./\d+./follow.pids=Pl_Official_HisRelation__66&relate=fans&page=\d#Pl_Official_HisRelation__66.'
find_img = re.compile(reg_img)
find_re = re.compile(reg)
find_nextPage = re.compile(reg_nextPage)
GetInfo(url1,url2)
fp_info.write(`nodeNum`+' '+`edgeNum`)
fp_info.close()
fp_edge.close()
fp_node.close()    