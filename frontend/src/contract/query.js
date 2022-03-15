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
  //console.log(wallet)
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages: {} })
}


export const getMessagesByThreadId = async (wallet, thread_id) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  //console.log(wallet)
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages_by_thread_id: { thread_id: thread_id} })
}

export const getThreads = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_threads: {} })
}

export const getProfiles = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_profiles: {} })
}
export const getProfileByAddress = async (wallet, address) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  //console.log(wallet.walletAddress)
  console.log(wallet.walletAddress)
  console.log(address)
  return lcd.wasm.contractQuery(contractAdress(wallet), { get_profile_by_address: { addr: address} })
}



