from html.parser import HTMLParser
from html import escape
from pathlib import Path

ROOT = Path("/Users/cfy/code/推免")
HTML = ROOT / "推免套磁/南京航空航天大学/南航人工智能学院教师名录及研究方向.html"
TEMPLATE = ROOT / "推免套磁/套磁信-大模型工程方向-修改版.md"
OUT = ROOT / "推免套磁/南京航空航天大学/个性化套磁信"
OUT.mkdir(parents=True, exist_ok=True)


class FacultyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_tr = False
        self.in_td = False
        self.row = []
        self.cell = ""
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.in_tr = True
            self.row = []
        elif tag == "td" and self.in_tr:
            self.in_td = True
            self.cell = ""

    def handle_endtag(self, tag):
        if tag == "td" and self.in_td:
            self.row.append(" ".join(self.cell.split()))
            self.in_td = False
        elif tag == "tr" and self.in_tr:
            if len(self.row) >= 6 and self.row[0].isdigit():
                self.rows.append(self.row[:6])
            self.in_tr = False

    def handle_data(self, data):
        if self.in_td:
            self.cell += data


parser = FacultyParser()
parser.feed(HTML.read_text(encoding="utf-8"))
template = TEMPLATE.read_text(encoding="utf-8")


def direction_text(direction):
    return direction if direction != "未公开" else "人工智能相关研究"


def customized_paragraphs(direction):
    d = direction_text(direction)
    if any(k in d for k in ("大模型", "智能体", "自然语言处理", "知识图谱", "对话")):
        match = (
            f"您主要从事{d}等方面的研究，这与我希望继续深耕的大模型应用、"
            "智能体工程和多模态智能方向高度契合。"
        )
        reason = (
            "我在武汉金银湖实验室参与将自研金银湖大模型应用于威胁分析和漏洞智能修复，"
            "设计 TcodeAI 辅助修复模块；同时主导 CamTalk 多模态实时视觉对话 Agent，"
            "参与 STT–LLM–TTS 7 节点流式编排"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}进一步学习大模型推理、知识增强、"
            "工具调用、任务规划与 Agent 评测，将已有的模型接口联调和场景落地经验提升为规范的科研能力。"
        )
    elif any(k in d for k in ("医学", "脑影像", "脑网络", "脑机", "EEG", "健康监测", "医疗")):
        match = (
            f"您主要从事{d}等方面的研究，体现了人工智能与医学、脑科学或健康场景的深度交叉，"
            "与我对多模态 AI 和实际应用的兴趣很契合。"
        )
        reason = (
            "我曾在东软医疗健康事业部参与 HIS 系统 Web 端和小程序端开发，完成图像采集处理、"
            "AI 智能客服及接口联调；同时主导过多模态实时视觉对话 Agent，积累了视听感知、"
            "模型调用和实时交互的工程经验"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}补足医学数据处理、跨模态建模和模型评价基础，"
            "逐步建立从工程实现到医学 AI 科研验证的能力。"
        )
    elif any(k in d for k in ("视觉", "图像", "模式识别", "深度学习", "生成式", "AR", "3D", "扩散")):
        match = (
            f"您主要从事{d}等方面的研究，与我的计算机视觉、模型改进和多模态系统实践直接相关，"
            "也是我希望继续发展的主要方向。"
        )
        reason = (
            "我负责过基于 CBAM–YOLOv8 的热轧带钢表面缺陷检测系统，针对弱纹理裂纹进行误差分析和"
            "消融实验，使整体 mAP@0.5 从 77.5% 提升至约 80%~81%，单张推理约 3 ms；"
            "同时主导过多模态实时视觉对话 Agent"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}继续夯实视觉表征、检测、三维理解或生成模型基础，"
            "将已有的目标检测经验与大模型工程实践结合起来开展可复现研究。"
        )
    elif any(k in d for k in ("机器人", "具身", "无人系统", "多智能体", "博弈", "导航", "低空", "空天")):
        match = (
            f"您主要从事{d}等方面的研究，研究问题兼具智能感知、任务决策和复杂工程约束，"
            "与我对智能体和 AI 工程落地的兴趣有较强交叉。"
        )
        reason = (
            "我主导过面向军工场景的 CamTalk 多模态实时视觉对话 Agent，完成端侧数据最小化、"
            "关键帧智能采样和 7 节点流式编排，并在复杂网络环境下参与数据加载与接口兜底机制设计"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}学习多智能体协同、感知决策、资源优化和具身交互方法，"
            "探索大模型 Agent 在真实装备或复杂环境任务中的应用。"
        )
    elif any(k in d for k in ("机器学习", "数据挖掘", "预测", "因果", "强化学习", "优化", "资源")):
        match = (
            f"您主要从事{d}等方面的研究，既有扎实的方法基础，也有复杂场景应用价值，"
            "与我希望从 AI 工程实践进一步走向方法研究的规划相契合。"
        )
        reason = (
            "我在热轧带钢缺陷检测项目中先进行误差归因，再提出 CBAM–YOLOv8 改进并通过同数据、"
            "同超参消融实验验证效果；同时在大模型 Agent 项目中积累了数据采样、任务编排和系统评价经验"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}系统补足理论基础，学习严谨的实验设计和评价方法，"
            "探索其在工业视觉、风险分析或智能决策场景中的应用。"
        )
    elif direction == "未公开":
        match = (
            "由于学院名录中暂未公开您的具体研究方向，我不想对您的研究内容作不准确推测；"
            "冒昧来信是希望请教您目前的研究重点及 2026 年推免招生安排。"
        )
        reason = (
            "我在金银湖实验室参与大模型应用、漏洞智能修复和风险态势感知平台建设，"
            "也主导过实时多模态视觉对话 Agent 与工业缺陷检测项目"
        )
        plan = (
            "若您的研究涉及机器学习、计算机视觉、大模型应用或智能系统工程，我愿意提前阅读相关文献，"
            "从数据处理、实验复现和系统开发等工作开始积累科研能力。"
        )
    else:
        match = (
            f"您主要从事{d}等方面的研究，我希望将已有的大模型应用、计算机视觉和系统开发经历"
            "延伸到更具体的人工智能应用问题，因此对您的研究工作很感兴趣。"
        )
        reason = (
            "我在金银湖实验室参与大模型应用与可信开源软件供应链安全平台建设，"
            "也负责过工业缺陷检测和医疗信息系统开发"
        )
        plan = (
            f"若有机会加入您的课题组，我希望围绕{d}进一步学习，提前阅读相关文献，"
            "并从数据处理、实验复现和工程实现等工作开始积累科研能力。"
        )
    return match, reason, plan


def make_letter(row):
    _, name_cell, title, email, _, direction = row
    name = name_cell.split()[0]
    subject = (
        "【推免自荐】- 陈飞扬 - 武汉科技大学 - 计算机科学与技术 - 前 7.7% - "
        "有过研究所、大厂等三段实习经历"
    )
    body = template.replace(
        "【推免自荐】- 陈飞扬 - 武汉科技大学 - 计算机科学与技术 - 前 7.7% - "
        "有过研究所、大厂等三段实习经历",
        subject,
    )
    body = body.replace("【X老师】", f"{name}老师")
    match, reason, plan = customized_paragraphs(direction)
    old = (
        "通过学院官网了解到您主要从事【大模型/智能体/多模态人工智能/人工智能应用】等方面的研究，"
        "我对您在【具体研究方向或项目】中的工作很感兴趣，也希望有机会进入您的课题组继续学习。"
    )
    body = body.replace(
        old,
        f"通过学院官网了解到，{match}也希望有机会进入您的课题组继续学习。",
    )
    old2 = (
        "如果有机会加入您的课题组，我愿意提前阅读相关文献、熟悉研究方向，并积极参与课题组的项目和实验工作。"
    )
    body = body.replace(
        old2,
        f"结合我的经历，我尤其希望围绕{direction_text(direction)}与人工智能应用的结合进一步学习。"
        f"{reason}，也让我具备了从需求分析、方案设计到代码实现和系统联调的实践基础。"
        f"{plan}",
    )
    header = (
        f"> 收件人：{name}老师（{title}）  \n"
        f"> 研究方向：{direction_text(direction)}  \n"
        f"> 邮箱：{email}\n\n"
    )
    return header + body


expected_files = set()
for row in parser.rows:
    index = row[0].zfill(2)
    name = row[1].split()[0]
    path = OUT / f"{index}-{name}-推免套磁信.md"
    expected_files.add(path.name)
    path.write_text(
        make_letter(row), encoding="utf-8"
    )

for path in OUT.glob("*.md"):
    if path.name not in expected_files:
        path.unlink()

text = HTML.read_text(encoding="utf-8")
text = text.replace(
    " .dr{color:#374151;line-height:1.75}\n",
    " .dr{color:#374151;line-height:1.75}\n"
    " .letter-cell{min-width:150px}\n"
    " .letter-cell a{display:inline-block;padding:5px 9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;color:#1d4ed8;font-size:12.5px;font-weight:600}\n"
    " .letter-cell a:hover{background:#dbeafe;text-decoration:none}\n",
)
text = text.replace(
    '<th data-page-node-id="KPFi0alW8GfUJxUpaWRYfd">主要研究方向</th></tr>',
    '<th data-page-node-id="KPFi0alW8GfUJxUpaWRYfd">主要研究方向</th><th>套磁信</th></tr>',
)
for row in parser.rows:
    index = row[0].zfill(2)
    name = row[1].split()[0]
    marker = "</td></tr>"
    link = (
        f'<td class="letter-cell"><a href="个性化套磁信/{index}-{escape(name)}-推免套磁信.md" '
        f'target="_blank" rel="noopener">打开套磁信</a></td>'
    )
    row_start = f'<tr data-cat='
    row_pos = text.find(row_start)
    if row_pos < 0:
        continue
    target = f">{row[0]}</td>"
    target_pos = text.find(target, row_pos)
    row_end = text.find(marker, target_pos)
    if row_end >= 0 and "class=\"letter-cell\"" not in text[target_pos:row_end]:
        text = text[:row_end] + "</td>" + link + text[row_end + len("</td>"):]

HTML.write_text(text, encoding="utf-8")
print(f"generated {len(parser.rows)} letters and updated {HTML}")
