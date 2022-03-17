import axios from 'axios';
import * as fs from 'fs-extra';
import * as AdmZip from 'adm-zip';

/**
 * Download file
 */
export const getFile = async (url: string): Promise<ArrayBuffer> => {
  const { data } = await axios.get(
    url,
    {
      responseType: 'arraybuffer',
    },
  );

  return data;
};

/**
 * Purge folder and extract archive
 */
 export const updateFolderFromArchive = async (path: string, data: any): Promise<void> => {
  await fs.remove(path);

  await fs.ensureDir(path);

  const zip = new AdmZip(data);
  zip.extractAllTo(path, true);
};

/**
 * Exract file in folder
 */
export const updateFile = async (path: string, data: any): Promise<void> => {
  // await fs.ensureDir(path);

  // const zip = new AdmZip(data);
  // zip.extractAllTo(path, true);
  await fs.writeFile(path, data);
};

