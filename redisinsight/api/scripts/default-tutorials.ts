import * as path from 'path';
import { join } from 'path';
import * as config from '../src/utils/config';
import { getFile, updateFolderFromArchive, updateFile } from '../src/utils/file-helper';

const PATH_CONFIG = config.get('dir_path');
const TUTORIALS_CONFIG = config.get('tutorials');

const archiveUrl = new URL(path.join(
  TUTORIALS_CONFIG.updateUrl,
  TUTORIALS_CONFIG.zip,
)).toString();

const buildInfoUrl = new URL(path.join(
  TUTORIALS_CONFIG.updateUrl,
  TUTORIALS_CONFIG.buildInfo,
)).toString();

const buildInfoPath = join(PATH_CONFIG.defaultTutorials, TUTORIALS_CONFIG.buildInfo);

async function init() {
  try {
    // get archive
    const data = await getFile(archiveUrl);

    // extract archive to default folder
    await updateFolderFromArchive(PATH_CONFIG.defaultTutorials, data);

    // get build info
    const buildInfo = await getFile(buildInfoUrl);

    // save build info to default folder
    await updateFile(buildInfoPath, buildInfo);

    process.exit(0);
  } catch (e) {
    console.error('Something went wrong trying to get default tutorials archive', e);
    process.exit(1);
  }
}

init();
