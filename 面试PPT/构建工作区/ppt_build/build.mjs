import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const OUT = '/Users/cfy/code/推免/陈飞扬-保研推免答辩.pptx';
const AS = '/Users/cfy/code/推免/assets';
const W = 1280, H = 720;
const navy = '#0B1F3A', blue = '#2F6BFF', cyan = '#5ED7E8', ink = '#10213A', muted = '#5F6F86', pale = '#F4F7FB', white = '#FFFFFF', orange = '#FFB45C';

async function blob(path){ const b=await fs.readFile(path); return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength); }
function box(slide,left,top,width,height,fill='none',radius=0,line='none'){ return slide.shapes.add({geometry: radius?'roundRect':'rect',position:{left,top,width,height},fill,line: line==='none'?{style:'solid',fill:'none',width:0}:{style:'solid',fill:line,width:1},borderRadius:radius?'rounded-xl':undefined}); }
function txt(slide,text,left,top,width,height,size,color=ink,bold=false,align='left'){ const s=slide.shapes.add({geometry:'textbox',position:{left,top,width,height},fill:'none',line:{style:'solid',fill:'none',width:0}}); s.text=text; s.text.style={fontSize:size,color,bold,fontFamily:'Aptos','alignment':align,breakLine:false}; return s; }
function line(slide,x1,y1,x2,y2,color=blue,w=3){ return slide.shapes.add({geometry:'line',position:{left:x1,top:y1,width:x2-x1,height:y2-y1},line:{style:'solid',fill:color,width:w},fill:'none'}); }
function pill(slide,label,x,y,w,fill=blue){ box(slide,x,y,w,32,fill,16); txt(slide,label,x,y+6,w,20,14,white,true,'center'); }
function footer(slide,n){ txt(slide,`陈飞扬  ·  武汉科技大学  ·  2026`,72,684,600,18,12,muted,false); txt(slide,String(n).padStart(2,'0'),1180,680,28,24,14,blue,true,'right'); }
function title(slide,kicker,head,sub){ txt(slide,kicker.toUpperCase(),72,42,500,20,13,blue,true); txt(slide,head,72,75,1120,54,34,navy,true); if(sub) txt(slide,sub,72,138,1100,32,17,muted,false); }

async function main(){
 const p=Presentation.create({slideSize:{width:W,height:H}});
 // 1 cover
 let s=p.slides.add(); s.background.fill=navy; box(s,0,0,18,H,cyan); txt(s,'保研推免综合陈述',82,118,760,72,48,white,true); txt(s,'把工程实践，走成科研起点',86,205,760,42,26,'#BBD3FF',false); txt(s,'陈飞扬  ·  武汉科技大学计算机科学与技术学院',86,294,760,28,18,white,false); pill(s,'2026 级推免资格',86,365,180,blue); txt(s,'计算机视觉  ×  大模型  ×  Agent',86,430,650,28,19,cyan,true); const av=await blob(`${AS}/profile.jpg`); s.images.add({blob:av,contentType:'image/jpeg',alt:'陈飞扬证件照',fit:'cover',position:{left:955,top:120,width:210,height:280},geometry:'roundRect',borderRadius:'rounded-2xl'}); box(s,930,96,260,328,'none',22,'#40618F'); txt(s,'5 min',1030,470,120,38,30,cyan,true,'center'); txt(s,'面向保研面试的个人陈述',935,514,250,22,14,'#BBD3FF',false,'center');
 // 2 foundation
 s=p.slides.add(); s.background.fill=white; title(s,'01  基础','成绩是底座，方向已聚焦','计算机科学与技术｜ESI 前 1% · 国家一流专业');
 box(s,72,205,360,300,pale,18); txt(s,'16 / 207',104,244,300,70,54,blue,true); txt(s,'专业加权排名',106,324,240,26,18,muted,false); txt(s,'前 7.7%',106,365,240,44,30,navy,true); txt(s,'GPA 3.36 / 4.0',106,428,240,24,17,muted,false);
 txt(s,'课程表现',500,216,220,28,22,navy,true); const courses=[['计算机视觉','91'],['计算机组成原理','91'],['数字逻辑与数字系统','90'],['Python 数据分析与机器学习','90']]; courses.forEach((c,i)=>{ const y=270+i*58; txt(s,c[0],500,y,360,24,18,ink,false); box(s,840,y+4,260,16,'#E7EDF7',8); box(s,840,y+4,Math.round(260*(parseInt(c[1])-70)/25),16,blue,8); txt(s,c[1],1122,y-2,48,28,20,blue,true,'right'); });
 txt(s,'关键词',500,520,160,24,22,navy,true); pill(s,'党员',500,560,84,navy); pill(s,'学习力',596,560,100,blue); pill(s,'工程实践',708,560,116,cyan); pill(s,'科研潜力',836,560,116,orange); footer(s,2);
 // 3 trajectory
 s=p.slides.add(); s.background.fill=pale; title(s,'02  轨迹','三段经历，逐步靠近智能体研究','从真实需求出发，把模型变成可用系统');
 line(s,150,330,1120,330,'#B6C8E4',5); const nodes=[{x:220,year:'2025.09',lab:'东软医疗',sub:'HIS 全栈开发',col:orange},{x:560,year:'2025.12',lab:'金银湖实验室',sub:'科研实习 · 大模型应用',col:blue},{x:900,year:'2026.04',lab:'CamTalk',sub:'多模态实时 Agent',col:cyan}]; nodes.forEach((n,i)=>{ s.shapes.add({geometry:'ellipse',position:{left:n.x-22,top:308,width:44,height:44},fill:n.col,line:{style:'solid',fill:white,width:5}}); txt(s,n.year,n.x-80,250,160,24,16,muted,true,'center'); txt(s,n.lab,n.x-110,380,220,28,24,navy,true,'center'); txt(s,n.sub,n.x-140,420,280,46,17,ink,false,'center'); });
 box(s,160,520,960,74,white,16); txt(s,'能力迁移：',190,545,120,24,18,blue,true); txt(s,'系统开发 → 数据与平台 → 多模态交互与智能体编排',320,545,720,24,20,navy,true); footer(s,3);
 // 4 flagship project
 s=p.slides.add(); s.background.fill=white; title(s,'03  代表项目','CamTalk：在“数据不出域”约束下做实时 AI 对话','项目负责人｜国家级网安基地·武汉金银湖实验室');
 box(s,72,205,520,350,navy,20); txt(s,'感知',110,246,120,30,22,cyan,true); txt(s,'语音 VAD + 像素差值关键帧',110,284,390,26,19,white,false); line(s,110,330,520,330,'#40618F',2); txt(s,'编排',110,360,120,30,22,cyan,true); txt(s,'STT – LLM – TTS 七节点流式链路',110,398,390,26,19,white,false); line(s,110,444,520,444,'#40618F',2); txt(s,'交互',110,474,120,30,22,cyan,true); txt(s,'多轮会话 / Prompt 情景 / 断线恢复',110,512,390,26,19,white,false);
 txt(s,'关键结果',675,218,220,28,22,navy,true); const stats=[['80%','静默期上传量下降'],['0.5 s','端到端感知延迟'],['30 s','断线恢复会话']]; stats.forEach((a,i)=>{ const x=675+(i%3)*170; txt(s,a[0],x,286,150,50,36,blue,true); txt(s,a[1],x,344,150,52,16,muted,false); }); box(s,675,435,430,100,pale,16); txt(s,'项目影响',700,455,120,24,18,blue,true); txt(s,'纳入实验室优质项目代码库；入选工信部电子第五研究所试点方案',700,488,360,40,16,ink,false); footer(s,4);
 // 5 research
 s=p.slides.add(); s.background.fill=pale; title(s,'04  科研潜力','把“漏检”拆成可验证的问题','热轧带钢缺陷检测｜NEU-DET · YOLOv8 + CBAM');
 txt(s,'误差分析',88,228,180,28,22,navy,true); txt(s,'裂纹类 mAP@0.5 仅 52.2%',88,268,300,30,20,ink,false); line(s,390,286,520,286,blue,4); txt(s,'方法改进',548,228,180,28,22,navy,true); txt(s,'在 Neck 端引入通道-空间双重注意力',548,268,360,30,20,ink,false); line(s,930,286,1060,286,blue,4); txt(s,'实验验证',1080,228,130,28,22,navy,true); txt(s,'同数据、同超参消融',1080,268,160,50,20,ink,false);
 box(s,110,410,960,114,white,18); txt(s,'77.5%',160,440,160,48,34,muted,true); txt(s,'→',360,440,70,48,34,blue,true,'center'); txt(s,'80%–81%',470,440,190,48,34,blue,true); txt(s,'整体 mAP@0.5',690,440,160,28,18,muted,false); txt(s,'3 ms / 张',890,440,140,38,28,navy,true); txt(s,'满足产线实时质检',850,482,220,24,16,muted,false); pill(s,'校级银奖 · 推荐省赛',110,565,190,orange); pill(s,'技术被企业采用 · 专利申请中',320,565,280,blue); footer(s,5);
 // 6 future
 s=p.slides.add(); s.background.fill=navy; txt(s,'05  未来方向',72,42,500,20,13,cyan,true); txt(s,'研究生阶段：从“做出来”走向“讲清楚”',72,75,1120,54,34,white,true); txt(s,'希望在导师指导下，持续深耕大模型、Agent 与多模态学习',72,138,1100,32,17,'#BBD3FF',false); txt(s,'已有优势',90,230,190,28,22,cyan,true); txt(s,'代码实现｜工程交付｜跨场景学习',90,272,440,34,24,white,true); line(s,90,340,550,340,'#40618F',2); txt(s,'需要补足',90,375,190,28,22,orange,true); txt(s,'理论深度｜文献阅读｜实验设计｜学术写作',90,417,480,34,22,white,true); box(s,690,210,440,270,'#122E55',20); txt(s,'拟聚焦问题',730,244,200,28,22,cyan,true); txt(s,'• 大模型推理与评测\n• 智能体工作流与工具调用\n• 多模态交互与垂直领域应用',730,300,340,130,23,white,false); txt(s,'期待在课题组中贡献：数据处理、模型实验、系统原型开发',90,570,930,28,19,'#BBD3FF',false); txt(s,'谢谢老师，期待交流',90,620,600,44,30,white,true); txt(s,'陈飞扬',1070,625,120,30,18,cyan,true,'right'); footer(s,6);
 const ppt=await PresentationFile.exportPptx(p); await ppt.save(OUT);
}
main().catch(e=>{console.error(e);process.exitCode=1});
