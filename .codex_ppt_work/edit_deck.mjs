import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const work = '/Users/cfy/code/推免/.codex_ppt_work';
const input = path.join(work, 'template-starter.pptx');
const output = '/Users/cfy/code/推免/面试ppt_第2版_陈飞扬适配版.pptx';
const assets = '/Users/cfy/code/推免/assets/compressed-lite';

const presentation = await PresentationFile.importPptx(await FileBlob.load(input));
const snapshot = await presentation.inspect({
  kind: 'slide,textbox,image,shape,notes',
  include: 'id,slide,name,text,textPreview,bbox',
  maxChars: 200000,
});
const records = snapshot.ndjson
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const bySlide = new Map();
for (const rec of records) {
  if (!rec.slide) continue;
  if (!bySlide.has(rec.slide)) bySlide.set(rec.slide, []);
  bySlide.get(rec.slide).push(rec);
}

function recs(slide, kind) {
  return (bySlide.get(slide) || []).filter((r) => r.kind === kind);
}

function findText(slide, oldText) {
  const hit = recs(slide, 'textbox').find((r) => (r.text ?? r.textPreview ?? '') === oldText);
  if (!hit) throw new Error(`Missing textbox on slide ${slide}: ${oldText}`);
  return presentation.resolve(hit.id);
}

function findTextByIndex(slide, index) {
  const hit = recs(slide, 'textbox')[index];
  if (!hit) throw new Error(`Missing textbox index ${index} on slide ${slide}`);
  return presentation.resolve(hit.id);
}

function findImageByIndex(slide, index) {
  const hit = recs(slide, 'image')[index];
  if (!hit) throw new Error(`Missing image index ${index} on slide ${slide}`);
  return presentation.resolve(hit.id);
}

function setText(slide, oldText, newText) {
  findText(slide, oldText).text = newText;
}

function setTextByIndex(slide, index, newText) {
  findTextByIndex(slide, index).text = newText;
}

async function replaceImage(slide, index, filename, alt) {
  const image = findImageByIndex(slide, index);
  const oldFrame = image.frame;
  const oldCrop = image.crop;
  const oldFit = image.fit;
  const oldGeometry = image.geometry;
  const oldBorderRadius = image.borderRadius;
  const oldRotation = image.rotation;
  const oldFlipHorizontal = image.flipHorizontal;
  const oldFlipVertical = image.flipVertical;
  const oldLockAspectRatio = image.lockAspectRatio;
  const assetPath = filename === 'profile.jpg'
    ? path.join('/Users/cfy/code/推免/assets', filename)
    : path.join(assets, filename);
  const bytes = await fs.readFile(assetPath);
  const contentType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
  await image.replace({
    blob: bytes,
    contentType,
    alt,
  });
  image.frame = oldFrame;
  if (oldCrop) image.crop = oldCrop;
  if (oldFit) image.fit = oldFit;
  if (oldGeometry) image.geometry = oldGeometry;
  if (oldBorderRadius) image.borderRadius = oldBorderRadius;
  if (oldRotation !== undefined) image.rotation = oldRotation;
  if (oldFlipHorizontal !== undefined) image.flipHorizontal = oldFlipHorizontal;
  if (oldFlipVertical !== undefined) image.flipVertical = oldFlipVertical;
  if (oldLockAspectRatio !== undefined) image.lockAspectRatio = oldLockAspectRatio;
}

function noteFor(slide) {
  const hit = recs(slide, 'notes')[0];
  if (!hit) return;
  const notes = presentation.resolve(hit.id);
  notes.setText('[Sources]\n- 用户提供的简历：推免简历.html\n- 用户提供的图片素材：/Users/cfy/code/推免/assets/');
}

// 1. Opening
setText(1, '夏令营面试自我陈述', '推免面试自我陈述');
setText(1, '汇报人：大熊猫', '汇报人：陈飞扬');
setText(1, '中南大学\n', '武汉科技大学');
setText(1, '大数据学院', '计算机学院');
await replaceImage(1, 0, 'profile.jpg', '陈飞扬证件照');

// 2. Agenda
setText(2, '目录', '目录');
setText(2, '01', '01');
setText(2, '02', '02');
setText(2, '03', '03');
setText(2, '04', '04');
setText(2, '个人信息', '个人信息');
setText(2, '竞赛经历', '项目经历');
setText(2, '科研经历', '科研实习');
setText(2, '校园经历', '校园经历');

// 3. Section divider
setText(3, '个人信息', '个人信息');
setText(3, 'PERSONAL  INFORMATION', 'PERSONAL INFORMATION');
setText(3, 'Part I', 'Part I');

// 4. Profile
setText(4, '个人基本情况', '个人基本情况');
setText(4, '大熊猫', '陈飞扬');
setText(4, '本科院校：XXXX大学 / 计算机科学与技术（B+）', '本科院校：武汉科技大学 / 计算机科学与技术（国家一流专业）');
setText(4, '政治面貌：中共预备党员\n专业成绩：绩点3XX，专业排名X/1XX（前1.XX%），XX门课程满绩，两次获得XXX奖学金\n英语水平：CET4-XXX分，CET6-XXX分（英语不高可不写）\n学生工作：班长、班学长、XXXXXXXXXXXXXX、XXXXXXXXXXXXXXXXXXX\n', '政治面貌：中共党员\n学业表现：GPA 3.36/4.0，加权排名 16/207（前 7.7%）\n英语水平：CET-4\n荣誉奖励：国家励志奖学金（2024、2025）\n校园任职：团支部书记、AI 协会副会长、机器人协会核心成员');
await replaceImage(4, 0, 'profile.jpg', '陈飞扬证件照');

// 5. Projects divider
setText(5, '竞赛经历', '项目经历');
setText(5, 'THE COMPETITION EXPERIENCE', 'THE PROJECT EXPERIENCE');
setText(5, 'Part II', 'Part II');

// 6. CamTalk project overview
setText(6, '创新创业类', '项目经历');
setText(6, '国家级\n2022年\t第七届中国国际“互联网+”XXXX\n2022年\t第六届全国“互联网+”快递XXXX\n2023年\t第十三届中国大学生服创大赛全国XXX', 'CamTalk 多模态实时 AI 视觉对话 Agent\n项目负责人 · 2026.04—2026.08\n国家级网安基地·武汉金银湖实验室');
setText(6, '省级\n2022年\t第十二届全国大学生电子商务三创赛XXX', '关键指标\n静默期数据上传量降低约 80%\n端到端感知延迟 ≤ 0.5 s');
setText(6, '主要职责\n担任队长，统筹规划项目进度\n担任答辩人\n项目策划书撰写\n与企业进行对接', '个人贡献\nVAD + 像素差值关键帧智能采样\nEino 7 节点 STT–LLM–TTS 流式编排\n多轮会话与 30 s 断线恢复');
for (const [i, f] of ['金银湖实验室.jpg','武汉洪飞实习.jpg','挑战者杯银奖.jpg','成绩单.jpg','华为证书.jpg','金山证书.jpg','腾讯证书.jpg','成绩证明.jpg'].entries()) {
  await replaceImage(6, i, f, '用户提供的项目与成果素材');
}

// 7. Defect detection project
setText(7, '英语类', '项目经历');
setText(7, '国家级&省级\n2021年\t全国大学生英语竞赛XXXXXX\n2021年\t第二届全国高校英语挑战赛XXXXX\n2022年\t全国大学生英语竞赛XXXXXX', '热轧带钢缺陷检测系统\n项目负责人 · 2026.05—2026.08\nCBAM-YOLOv8 · NEU-DET 6 类缺陷');
setText(7, ' 四六级成绩\n2019.12 四级 XXX分\n2020.09 六级 XXX分', 'mAP 77.5% → 80%+\n裂纹 52.2% → 57%+\n推理 3 ms');
for (const [i, f] of ['挑战者杯银奖.jpg','成绩证明.jpg','华为证书.jpg','腾讯证书.jpg','金山证书.jpg','金银湖实验室.jpg'].entries()) {
  await replaceImage(7, i, f, '用户提供的项目与证书素材');
}

// 8. Honors and certificates
setText(8, 'XXXX类', '荣誉与证书');
setTextByIndex(8, 1, 'HarmonyOS 证书');
setTextByIndex(8, 2, '创新创业·银奖');
setTextByIndex(8, 3, '机器人 AI·省三');
setTextByIndex(8, 4, '腾讯大前端');
setTextByIndex(8, 5, '金山全栈');
for (const [i, f] of ['挑战者杯银奖.jpg','成绩证明.jpg','腾讯证书.jpg','金山证书.jpg','华为证书.jpg'].entries()) {
  await replaceImage(8, i, f, '用户提供的荣誉证书素材');
}

// 9. Research divider
setText(9, '科研经历', '科研实习');
setText(9, 'THE RESEARCH EXPERIENCE', 'THE RESEARCH INTERNSHIP');
setText(9, 'Part III', 'Part III');

// 10. Jin Yin Lake internship
setText(10, '基于特征分析和预测模型的XXXX研究', '金银湖实验室：开源软件供应链安全平台');
setText(10, '项目简介', '项目简介');
setText(10, '针对XXXXXX事件，针对传统XXXX问题中XXXXXXXXXXX、XXXXXXXXXXX等问题，搜集数据、查阅文献，建立XXXXXXXXX模型', '面向开源软件供应链安全态势感知，参与构建可信开源态势感知平台；联合华中科技大学网安学院，将金银湖大模型用于威胁可视化与漏洞智能修复。');
setText(10, '主要工作', '主要工作');
setText(10, '数据搜集与预处理\n论文撰写、图表绘制', 'ECharts 6 监控中心（15+ 组件）\nGeoJSON 容错 + 接口兜底');
setText(10, '作为第X作者在XXXX上发表论文\n该研究获得XXX学术竞赛奖项', 'TcodeAI 辅助修复模块\n可折叠面板复用 3+ 页面');
setText(10, '项目成果', '个人产出');
await replaceImage(10, 0, '金银湖实验室.jpg', '金银湖实验室实习照片');
await replaceImage(10, 1, '武汉洪飞实习.jpg', '用户提供的实习成果素材');
await replaceImage(10, 2, '挑战者杯银奖.jpg', '用户提供的项目成果素材');

// 11. Defect detection research detail
setText(11, '基于特征分析和预测模型的XXXX研究', '热轧带钢缺陷检测：CBAM-YOLOv8');
setText(11, '解决方案', '解决方案');
setText(11, '构建基于XXXXXXXXXXXXXXXXXX的XXXXXXXXXX', '在 YOLOv8 Neck 端嵌入 CBAM 通道—空间双重注意力，针对弱纹理裂纹进行误差归因与消融验证。');
setText(11, '研究简介', '研究简介');
setText(11, '针对XXXXXX传统算法存在XXXXXXXX、XXXXXXXXXXXXX的问题，XXXXXXXXXX构建XXXXXXXXXXXXXXXXXXX', '面向热轧产线在线质检，基于 NEU-DET（1800 张图像、6 类缺陷）验证模型改进，重点解决弱纹理缺陷漏检。');
setText(11, '\n论文撰写、图表绘制、XXXXXXXXXXXXXX\n以第X作者身份投稿XXXXXX，已XX（录用/出刊）', '\n误差归因 + CBAM 改进 + 消融实验\n校级银奖；技术被洪飞智巡采用');
setText(11, '主要贡献/成果', '主要贡献 / 成果');
await replaceImage(11, 0, '挑战者杯银奖.jpg', '项目获奖证明');
await replaceImage(11, 1, '武汉洪飞实习.jpg', '技术采用方实习与项目素材');

// 12. Campus divider
setText(12, '校园经历', '校园经历');
setText(12, 'THE CAMPUS EXPERIENCE', 'THE CAMPUS EXPERIENCE');
setText(12, 'Part IV', 'Part IV');

// 13. Campus roles
setText(13, '学生干部工作', '校园任职与荣誉');
setText(13, '担任XXXXXXXXX部长，具有出色的文字撰写能力和团队配合意识，曾获得XXXXXXXXXXXXXXXXX。\n曾担任XXXXX大学XXXXX XXXXXXXX，XXXXXXXXXX，XXXXXX。\n曾担任XX、班XX，获评优秀学生干部。', '团支部书记：组织主题活动与学风建设，获评优秀共青团员、优秀学生干部。\nAI 协会副会长：参与 AI 分享与社团运营。\n机器人协会核心成员：参与项目实践。\n荣誉：二等奖学金、优秀学生、先进个人。');
await replaceImage(13, 0, '成绩单.jpg', '用户提供的成绩证明素材');
await replaceImage(13, 1, '腾讯证书.jpg', '用户提供的校园与能力证明');
await replaceImage(13, 2, '金山证书.jpg', '用户提供的能力证明');

// 14. Internship summary
setText(14, '志愿服务工作', '实习经历');
setText(14, '除此，还参加了XXXX大学校庆志愿者、XX区残联志愿者等，志愿时长超过XXXh.', '两段实习聚焦前端可视化、AI 辅助修复与医疗系统智能化迭代。');
setText(14, '美丽中国支教项目', '国家网络安全人才与创新基地\n武汉金银湖实验室');
setText(14, '无偿献血', '东软集团\n东软医疗健康事业部');
setText(14, '组织班级同学共同参加“重马”志愿者', '武汉洪飞智巡科技有限公司\n相关技术采用');
await replaceImage(14, 0, '金银湖实验室.jpg', '金银湖实验室实习照片');
await replaceImage(14, 1, '武汉洪飞实习.jpg', '东软与企业项目素材');
await replaceImage(14, 2, '挑战者杯银奖.jpg', '用户提供的项目成果素材');

// 15. Closing
setText(15, '恳请各位导师批评指导', '恳请各位老师批评指导');
setText(15, '汇报人：大熊猫', '汇报人：陈飞扬');
await replaceImage(15, 0, 'profile.jpg', '陈飞扬证件照');

for (let slide = 1; slide <= 15; slide++) noteFor(slide);

await fs.mkdir(path.dirname(output), { recursive: true });
const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);

for (const [i, slide] of presentation.slides.items.entries()) {
  const png = await presentation.export({ slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(work, `final-slide-${String(i + 1).padStart(2, '0')}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: 'layout' });
  await fs.writeFile(path.join(work, `final-slide-${String(i + 1).padStart(2, '0')}.layout.json`), await layout.text());
}
const montage = await presentation.export({ format: 'webp', montage: true, scale: 1 });
await fs.writeFile(path.join(work, 'final-montage.webp'), new Uint8Array(await montage.arrayBuffer()));

console.log(JSON.stringify({ output, slides: presentation.slides.items.length }, null, 2));
