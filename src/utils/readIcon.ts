import { readFile } from 'node:fs/promises';
import { fileTypeFromBuffer } from 'file-type';

export const readIcon = async (path: string): Promise<string> => {
  const buf = await readFile(path);
  const fileType = await fileTypeFromBuffer(buf);

  if (!fileType) {
    throw new Error('Unsupported File type');
  }

  return `data:${fileType.mime};base64,${buf.toString('base64')}`;
};
