import { LCDClient } from '@terra-money/terra.js'
import { contractAdress } from './address'

/* 
export const getCount = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  console.log(wallet)
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_count: {} })
}
*/
export const getMessages = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  console.log(wallet)
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages: {} })
}


