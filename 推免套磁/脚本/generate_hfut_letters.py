from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path("/Users/cfy/code/推免")
HTML = ROOT / "推免套磁/合肥工业大学/合工大计算机学院教师名录及研究方向.html"
TEMPLATE = ROOT / "推免套磁/套磁信-大模型工程方向-修改版.md"
OUT = ROOT / "推免套磁/合肥工业大学/个性化套磁信"
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


def clean_direction(direction):
    direction = direction.replace("\u200b", "").replace("\ufeff", "").strip()
    if direction in {"未公开", "MORE+", "Research focus", "-", ""}:
        return "人工智能相关研究"
    return direction


def paragraphs(direction):
    original = direction
    d = clean_direction(direction)
    if original in {"未公开", "MORE+", "Research focus", "-", ""}:
        return (
            "由于名录中暂未公开您的具体研究方向，我不想对您的研究内容作不准确推测；"
            "冒昧来信是希望请教您目前的研究重点及 2026 年推免招生安排。",
            "我在国家级网络安全人才与创新基地·武汉金银湖实验室参与大模型应用、"
            "可信开源软件供应链安全态势感知和漏洞智能修复平台建设，也主导过实时多模态视觉对话 Agent"
            "与工业缺陷检测项目，具备较强的代码实现、工程协作和快速学习能力。",
            "若您的研究涉及机器学习、计算机视觉、大模型应用、智能系统或软件工程，"
            "我愿意提前阅读相关文献，并从数据处理、实验复现和系统开发等工作开始积累科研能力。",
        )
    if any(k in d for k in ("大模型", "大语言模型", "自然语言处理", "推荐系统", "信息检索", "知识图谱", "跨模态")):
        return (
            f"您主要从事{d}等方面的研究，这与我希望继续深耕的大模型应用、"
            "多模态智能和 Agent 工程方向高度契合。",
            "我在武汉金银湖实验室参与将自研金银湖大模型应用于威胁分析和漏洞智能修复，"
            "参与设计 TcodeAI 漏洞修复 Agent；同时主导 CamTalk 多模态实时视觉对话 Agent，"
            "参与 STT–LLM–TTS 7 节点流式编排，实现多轮会话和低延迟交互。",
            f"若有机会加入您的课题组，我希望围绕{d}深入学习大模型推理、知识增强、"
            "检索推荐、工具调用与 Agent 评测，将已有的工程实践提升为规范的科研能力。",
        )
    if any(k in d for k in ("视觉", "图像", "视频", "模式识别", "机器视觉", "多媒体", "遥感", "图形", "偏振", "3D", "人脸", "目标检测")):
        return (
            f"您主要从事{d}等方面的研究，与我的计算机视觉、模型改进和多模态系统实践直接相关，"
            "也是我希望继续发展的主要方向。",
            "我负责过基于 CBAM–YOLOv8 的热轧带钢表面缺陷检测系统，针对弱纹理裂纹进行误差分析和"
            "消融实验，使整体 mAP@0.5 从 77.5% 提升至约 80%~81%，单张图像推理约 3 ms；"
            "同时主导过多模态实时视觉对话 Agent。",
            f"若有机会加入您的课题组，我希望围绕{d}继续夯实视觉表征、检测、分割或多模态理解基础，"
            "学习严谨的实验设计和模型评价方法。",
        )
    if any(k in d for k in ("安全", "隐私", "区块链", "工业互联网", "工业控制", "车联网", "密码", "可信")):
        return (
            f"您主要从事{d}等方面的研究，这与我在网络安全大模型应用和可信智能系统方面的实践有较强契合。",
            "我在武汉金银湖实验室参与可信开源软件供应链安全态势感知平台建设，"
            "将金银湖大模型应用于威胁分析和漏洞智能修复，参与设计 TcodeAI 辅助修复模块，"
            "并负责 CVE 趋势分析、高危组件识别、数据接入和可视化功能开发。",
            f"若有机会加入您的课题组，我希望围绕{d}学习 AI 安全、数据安全、模型可靠性和智能系统防护方法，"
            "探索大模型在安全分析与工程系统中的可信应用。",
        )
    if any(k in d for k in ("通信", "无线", "物联网", "边缘", "光纤", "雷达", "信号", "电磁", "天线", "网络")):
        return (
            f"您主要从事{d}等方面的研究，关注复杂网络或信号环境下的智能感知与系统应用，"
            "与我对 AI 工程落地和受限环境下智能系统的兴趣有较好交叉。",
            "我主导过面向军工场景的 CamTalk 多模态实时视觉对话 Agent，完成端侧数据最小化、"
            "关键帧智能采样和 STT–LLM–TTS 流式编排；在金银湖实验室还参与复杂网络环境下的数据加载"
            "和接口兜底机制设计。",
            f"若有机会加入您的课题组，我希望围绕{d}补足通信、信号处理、边缘计算或智能感知基础，"
            "探索大模型 Agent 与网络、物联网或实时系统结合的应用。",
        )
    if any(k in d for k in ("具身", "机器人", "人形", "多智能体", "博弈", "控制", "智能调度")):
        return (
            f"您主要从事{d}等方面的研究，研究问题兼具智能感知、任务决策和复杂工程约束，"
            "与我对智能体和 AI 系统落地的兴趣有较强交叉。",
            "我主导过多模态实时视觉对话 Agent，完成视听感知到语言生成的流式编排，"
            "关注端侧数据开销、实时延迟和断线恢复；同时有工业视觉检测和真实系统开发经验。",
            f"若有机会加入您的课题组，我希望围绕{d}学习多智能体协同、感知决策、"
            "任务规划和具身交互方法，探索大模型 Agent 在真实装备和复杂环境中的应用。",
        )
    if any(k in d for k in ("机器学习", "深度学习", "数据挖掘", "因果", "优化", "时间序列", "计算智能", "人工智能")):
        return (
            f"您主要从事{d}等方面的研究，既有扎实的方法基础，也有较强的应用价值，"
            "与我希望从 AI 工程实践进一步走向方法研究的规划相契合。",
            "我在热轧带钢缺陷检测项目中先进行误差归因，再提出 CBAM–YOLOv8 改进并通过同数据、"
            "同超参消融实验验证效果；同时在大模型 Agent 项目中积累了数据采样、任务编排和系统评价经验。",
            f"若有机会加入您的课题组，我希望围绕{d}系统补足理论基础，学习严谨的实验设计和评价方法，"
            "探索其在工业视觉、风险分析或智能决策场景中的应用。",
        )
    return (
        f"您主要从事{d}等方面的研究，我希望将已有的大模型应用、计算机视觉和系统开发经历"
        "延伸到更具体的人工智能应用问题，因此对您的研究工作很感兴趣。",
        "我在武汉金银湖实验室参与大模型应用与可信开源软件供应链安全平台建设，"
        "也负责过工业缺陷检测和医疗信息系统开发，具备从需求分析、方案设计到代码实现和系统联调的实践基础。",
        f"若有机会加入您的课题组，我希望围绕{d}进一步学习，提前阅读相关文献，"
        "并积极参与课题组的项目和实验工作。",
    )


def make_letter(row):
    index, name, title, advisor, age, direction = row
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
    match, evidence, plan = paragraphs(direction)
    body = re.sub(
        r"通过学院官网了解到您主要从事.*?也希望有机会进入您的课题组继续学习。",
        f"通过学院官网了解到，{match}也希望有机会进入您的课题组继续学习。",
        body,
        count=1,
    )
    old2 = (
        "如果有机会加入您的课题组，我愿意提前阅读相关文献、熟悉研究方向，并积极参与课题组的项目和实验工作。"
    )
    body = body.replace(
        old2,
        f"结合我的经历，我尤其希望围绕{clean_direction(direction)}与人工智能应用的结合进一步学习。"
        f"{evidence}{plan}",
    )
    header = (
        f"> 收件人：{name}老师（{title}，{advisor}）  \n"
        f"> 研究方向：{clean_direction(direction)}  \n"
        "> 邮箱：名录未列出，请以教师主页为准\n\n"
    )
    return header + body


expected = set()
for row in parser.rows:
    index = row[0].zfill(3)
    name = row[1]
    filename = f"{index}-{name}-推免套磁信.md"
    expected.add(filename)
    (OUT / filename).write_text(make_letter(row), encoding="utf-8")

for path in OUT.glob("*.md"):
    if path.name not in expected:
        path.unlink()

text = HTML.read_text(encoding="utf-8")
if "<th>套磁信</th>" not in text:
    text = text.replace(
        '<th data-page-node-id="PmJDvUivBGT5xD79WS3ttA">主要研究方向</th></tr>',
        '<th data-page-node-id="PmJDvUivBGT5xD79WS3ttA">主要研究方向</th><th>套磁信</th></tr>',
    )
    text = text.replace(
        " .d{color:#374151;line-height:1.75;overflow-wrap:anywhere;word-break:break-word}\n",
        " .d{color:#374151;line-height:1.75;overflow-wrap:anywhere;word-break:break-word}\n"
        " .letter-cell{min-width:150px}\n"
        " .letter-cell a{display:inline-block;padding:5px 9px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;color:#1d4ed8;font-size:12.5px;font-weight:600}\n"
        " .letter-cell a:hover{background:#dbeafe;text-decoration:none}\n",
    )

def add_link(match):
    row_html = match.group(0)
    index_match = re.search(r"<td[^>]*>\s*(\d+)\s*</td>", row_html)
    if not index_match or "class=\"letter-cell\"" in row_html:
        return row_html
    index = index_match.group(1).zfill(3)
    row = next((item for item in parser.rows if item[0] == index_match.group(1)), None)
    if not row:
        return row_html
    name = row[1]
    link = (
        f'<td class="letter-cell"><a href="个性化套磁信/{index}-{escape(name)}-推免套磁信.md" '
        'target="_blank" rel="noopener">打开套磁信</a></td>'
    )
    return row_html[:-5] + link + "</tr>"


text = re.sub(r"<tr\b[^>]*>.*?</tr>", add_link, text, flags=re.DOTALL)

HTML.write_text(text, encoding="utf-8")
print(f"generated {len(parser.rows)} letters and updated {HTML}")
