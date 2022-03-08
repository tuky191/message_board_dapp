import { LCDClient } from '@terra-money/terra.js'
import { contractAdress } from './address'

export function getMessages(wallet){
    const lcd = new LCDClient({
        URL: wallet.network.lcd,
        chainID: wallet.network.chainID,
    })
    return lcd.wasm.contractQuery(contractAdress(wallet), { get_messages: {} });
}

