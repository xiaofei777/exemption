import {FileBlob,PresentationFile} from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('/Users/cfy/code/推免/ppt_build/template-starter.pptx')); const s=p.slides.items[0]; for(const sh of s.shapes.items){if(sh.text) console.log(sh.name,typeof sh.text,sh.text, Object.keys(sh.text));}
