import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
const src='/Users/cfy/code/推免/ppt_build/template-starter.pptx', out='/Users/cfy/code/推免/陈飞扬-蓝色模板保研答辩.pptx';
const p=await PresentationFile.importPptx(await FileBlob.load(src));
const repl=new Map([
['C18-保研夏令营/预推免自我介绍','保研推免自我介绍'],['Self introduction of recommendation for graduate studies','Personal Statement · Graduate Recommendation'],['面试时间：20XX.XX.XX','2026.09'],['XXXX大学XX学院XX专业 · 20XX级学生','武汉科技大学 · 计算机科学与技术 · 2023级'],['面试学生：有趣','面试学生：陈飞扬'],['申请专业：XXXXXX','申请方向：人工智能 / 大模型'],
['个人介绍\nSelf-introduction','个人介绍\nPersonal Profile'],['科研经历\nResearch Experience','科研经历\nResearch Experience'],['实践经历\nPractical Experience','实践经历\nPractical Experience'],['读研规划\nGraduate Study Plan','读研规划\nGraduate Study Plan'],
['本校推免资格审核/加权成绩排名20余','学业基础'],['相关奖项','核心表现'],['科研项目研究/竞赛/专利','科研项目与成果'],['实习经历/社会实践','实习与实践'],
['科研项目研究/竞赛获奖/专利','科研项目与成果'],['科研经历及分析','科研经历与分析'],['学生工作','校园任职'],['实践经历/社会实践','实践经历与成果'],['学术研究','研究方向'],['发展规划','发展规划']
]);
for(const slide of p.slides.items){ for(const sh of (slide.shapes?.items||[])){ const cur=String(sh.text||''); if(repl.has(cur)) sh.text=repl.get(cur); } }
// targeted long text replacements by substring
const long=[['本校推免资格审核/加权成绩排名20余','武汉科技大学计算机科学与技术专业\n加权排名 16 / 207（前 7.7%）\nGPA 3.36 / 4.0 · CET-4'],['200X.XX.XX','2025.09—2026.08'],['输入标题','CamTalk 多模态实时 AI Agent'],['输入标题','热轧带钢缺陷检测（YOLOv8 + CBAM）']];
for(const slide of p.slides.items){ for(const sh of (slide.shapes?.items||[])){ let cur=String(sh.text||''); for(const [a,b] of long){ if(cur.includes(a)) cur=cur.replace(a,b); } if(cur!==String(sh.text||'')) sh.text=cur; } }
const ppt=await PresentationFile.exportPptx(p); await ppt.save(out);
