from html.parser import HTMLParser
from pathlib import Path

ROOT=Path('/Users/cfy/code/推免')
HTML=ROOT/'推免套磁/西北工业大学/西工大网安学院教师名录及研究方向.html'
TEMPLATE=ROOT/'推免套磁/套磁信-大模型工程方向-修改版.md'
OUT=ROOT/'推免套磁/西北工业大学/个性化套磁信'
OUT.mkdir(parents=True,exist_ok=True)

class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.in_tr=False; self.in_td=False; self.row=[]; self.cell=''; self.rows=[]
    def handle_starttag(self,t,a):
        if t=='tr': self.in_tr=True; self.row=[]
        elif t=='td' and self.in_tr: self.in_td=True; self.cell=''
    def handle_endtag(self,t):
        if t=='td' and self.in_td: self.row.append(' '.join(self.cell.split())); self.in_td=False
        elif t=='tr' and self.in_tr:
            if len(self.row)>=6: self.rows.append(self.row)
            self.in_tr=False
    def handle_data(self,d):
        if self.in_td: self.cell+=d

p=Parser(); p.feed(HTML.read_text())
template=TEMPLATE.read_text()

def fit(d):
    d=d.replace('未公开','网络空间安全与智能系统相关研究')
    if any(k in d for k in ['大模型','智能体','多模态','自然语言处理','计算机视觉','机器学习','图像','视觉','人工智能','边缘智能']):
        return f'您主要从事{d}等方面的研究，这与我希望继续深耕的大模型应用、智能体工程和多模态/视觉智能方向有较强契合。'
    if any(k in d for k in ['安全','密码','隐私','漏洞','威胁','对抗','区块链','软件']):
        return f'您主要从事{d}等方面的研究，我希望将已有的大模型应用与工程实践能力延伸到网络与系统安全场景，因此对您的研究方向非常感兴趣。'
    if any(k in d for k in ['通信','网络','无线','卫星','空天','物联网','边缘']):
        return f'您主要从事{d}等方面的研究，我希望进一步探索智能模型、Agent 与网络/边缘系统结合的应用，对您的研究方向很感兴趣。'
    if any(k in d for k in ['控制','无人','群体','博弈','测控','诊断']):
        return f'您主要从事{d}等方面的研究，这与我在智能系统、视觉感知和工程化 AI 方向的积累具有较好的交叉空间，我对此很感兴趣。'
    return f'您主要从事{d}等方面的研究，我希望在研究生阶段继续拓展人工智能与网络空间安全交叉方向，对您的研究工作很感兴趣。'

def reason(d):
    if any(k in d for k in ['大模型','智能体','多模态','自然语言处理']): return '金银湖大模型应用、TcodeAI 漏洞修复 Agent 和 CamTalk 多模态实时 Agent 的经历'
    if any(k in d for k in ['视觉','图像','机器学习','人工智能','异常检测']): return 'YOLOv8+CBAM 缺陷检测项目、CamTalk 视觉对话 Agent 以及金银湖实验室的大模型应用实践'
    if any(k in d for k in ['安全','密码','漏洞','威胁','隐私','区块链','软件']): return '金银湖实验室的开源软件供应链安全态势感知与 TcodeAI 漏洞辅助修复实践'
    if any(k in d for k in ['通信','网络','无线','边缘','物联网','卫星','空天']): return '金银湖实验室的安全态势感知平台开发，以及实时 Agent 系统中的流式通信与工程实践'
    if any(k in d for k in ['控制','无人','群体','博弈','测控','诊断']): return '工业视觉检测、实时多模态 Agent 和实际系统开发中形成的智能感知与工程实现经验'
    return '在金银湖实验室、东软医疗和 AI 项目中积累的工程实践与快速学习能力'

def make(row):
    idx,name_title,rank,email,age,direction=row
    name=name_title.split()[0]; title=name_title[len(name):].strip() or rank
    if email=='—': email='（官网未公开邮箱）'
    subject='【推免自荐】- 陈飞扬 - 武汉科技大学 - 计算机科学与技术 - 前 7.7% - 有过研究所、大厂等三段实习经历'
    body=template.replace('【推免自荐】- 陈飞扬 - 武汉科技大学 - 计算机科学与技术 - 前 7.7% - 有过研究所、大厂等三段实习经历',subject)
    body=body.replace('【X老师】',f'{name}老师')
    old='通过学院官网了解到您主要从事【大模型/智能体/多模态人工智能/人工智能应用】等方面的研究，我对您在【具体研究方向或项目】中的工作很感兴趣，也希望有机会进入您的课题组继续学习。'
    body=body.replace(old,f'通过学院官网了解到，{fit(direction)}也希望有机会进入您的课题组继续学习。')
    old2='如果有机会加入您的课题组，我愿意提前阅读相关文献、熟悉研究方向，并积极参与课题组的项目和实验工作。'
    new2=f'结合我的经历，我尤其希望围绕{direction}与人工智能应用的结合进一步学习。已有的{reason(direction)}，也让我具备了从需求分析、方案设计到代码实现和系统联调的实践基础。如果有机会加入您的课题组，我愿意提前阅读相关文献、熟悉研究方向，并积极参与课题组的项目和实验工作。'
    body=body.replace(old2,new2)
    header=f'> 收件人：{name}老师（{title}）  \n> 研究方向：{direction}  \n> 邮箱：{email}\n\n'
    return header+body

for row in p.rows:
    idx=row[0].zfill(2); name=row[1].split()[0]
    (OUT/f'{idx}-{name}-推免套磁信.md').write_text(make(row),encoding='utf-8')
print(f'generated {len(p.rows)} letters in {OUT}')
