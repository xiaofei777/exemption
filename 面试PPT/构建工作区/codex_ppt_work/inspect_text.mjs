import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';

const input = process.argv[2];
const presentation = await PresentationFile.importPptx(await FileBlob.load(input));
const snapshot = await presentation.inspect({
  kind: 'slide,textbox,image,shape,notes,layout',
  include: 'id,slide,name,title,text,textPreview,textChars,textLines,bbox,isPlaceholder',
  maxChars: 100000,
});
await fs.writeFile(process.argv[3], snapshot.ndjson);
