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
  try {
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages: {} })
  } catch {
    console.log("getMessages failed")
    return { messages: []}
  }
}


export const getMessagesByThreadId = async (wallet, thread_id) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  //console.log(wallet)
  try {
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages_by_thread_id: { thread_id: thread_id } })
  } catch {
    console.log("getMessagesbythreadid failed")
    return { messages: [] }
  }
}

export const getThreads = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  try {
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_threads: {} })
  } catch {
    console.log("getThreads failed")
    return { threads: [] }
  }
}

export const getProfiles = async (wallet) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })
  try {
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_profiles: {} })
  } catch {
    console.log("getProfiles failed")
    return { profiles: [] }
    
  }
}
export const getProfileByAddress = async (wallet, address) => {
  const lcd = new LCDClient({
    URL: wallet.network.lcd,
    chainID: wallet.network.chainID,
  })

  try {
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_profile_by_address: { addr: address } })
  } catch {
    console.log("contractQuery failed")
    return { profiles: [] }
  }
}



