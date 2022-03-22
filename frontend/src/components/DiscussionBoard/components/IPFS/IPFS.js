import { create } from 'ipfs-http-client';
import all from 'it-all';
import { concat } from 'uint8arrays';

const ipfs = create('https://ipfs.infura.io:5001/api/v0');

export function IPFS() {
  const uploadFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const buffer = Buffer.from(reader.result);
        const addResult = ipfs?.add(buffer);
        return resolve((await addResult)?.path);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const readFile = async (url) => {
    const fileContent = await all(ipfs.cat(url));
    return concat(fileContent);
  };
  return { uploadFile, readFile };
}
