# terra-forum https://terra-forum.vercel.app/

Prototype of a messaging board utilizing the smart contract stored on Terra's blockchain as a backend.

Install npm & terrain
https://github.com/iboss-ptk/terrain

Either install LocalTerra (https://github.com/terra-money/LocalTerra) or use testnet

Clone the repo

git clone git@github.com:tuky191/terra-forum.git
cd terra-forum/
npm install

To deploy smart contract:

on LocalTerra
terrain deploy terra-forum --signer validator

on Testnet place your Mnemonic in ./terra-forum/.env
MNEMONIC="YOUR MNEMONIC"
terrain deploy terra-forum --signer bombay --network testnet

See https://docs.terra.money/docs/develop/dapp/quick-start/using-terrain-testnet.html for detailed instructions.

Once contract is deployed

cd frontend
npm start


