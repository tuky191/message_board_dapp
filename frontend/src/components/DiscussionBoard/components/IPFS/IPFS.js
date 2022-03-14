import { create } from 'ipfs-http-client'

const ipfs = create('https://ipfs.infura.io:5001/api/v0')

export function IPFS() {

    const uploadFile = async (file) => {

        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = async () => {
                const buffer = Buffer.from(reader.result)
                const addResult = ipfs?.add(buffer);
                return resolve((await addResult)?.path);
            }
            reader.readAsArrayBuffer(file)
        })
    }

    return uploadFile
}