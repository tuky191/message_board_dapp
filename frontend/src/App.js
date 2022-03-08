import './App.css'

import { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'

import * as execute from './contract/execute'
import * as query from './contract/query'
import { ConnectWallet } from './components/ConnectWallet'

function App() {
  const [count, setCount] = useState(null)
  const [messages, setMessages] = useState([])
  const [updating, setUpdating] = useState(true)
  const [resetValue, setResetValue] = useState(0)

  const { status } = useWallet()

  const connectedWallet = useConnectedWallet()

  /*
  useEffect(() => {
    const prefetch = async () => {
      if (connectedWallet) {
        setCount(0)
        SetMessages((await query.getMessages(connectedWallet)))
      }
      setUpdating(false)
    }
    prefetch()
  }, [connectedWallet])
*/
  useEffect(() => {
    (async () => {
      setUpdating(true);
      if (connectedWallet) {
        let { messages } = await query.getMessages(connectedWallet);
        console.log(messages);
        setMessages(messages);
      }
      setUpdating(false);
    })();
  }, [connectedWallet]);

  /*
  useEffect(() => {
    const prefetch_message = async () => {
      if (connectedWallet) {
        SetMessages((await query.getMessages(connectedWallet)))
        //console.log(messages)
      }
      setUpdating(false)
    }
    prefetch_message()
  }, [connectedWallet])
*/

  const onClickIncrement = async () => {
    setUpdating(true)
    await execute.increment(connectedWallet)
    //setCount((await query.getCount(connectedWallet)).count)
    setUpdating(false)
    console.log(connectedWallet)
  }

  const onClickReset = async () => {
    setUpdating(true)
    console.log(resetValue)
    await execute.reset(connectedWallet, resetValue)
    //setCount((await query.getCount(connectedWallet)).count)
    setUpdating(false)
  }

  const onSubmitNewPost = async (message) => {
    setUpdating(true);
    try {
      message = {};
      message.subject = 'test subject';
      message.content = 'test content';
      await execute.createMessage(connectedWallet, message);
      setMessages((await query.getMessages(connectedWallet)))
    }
    catch (e) {
      setUpdating(false);
      throw e;
    }
    setUpdating(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'inline' }}>
          Messages: {messages.length} {updating ? '(updating . . .)' : ''}
          {console.log(messages.length)}
          <button onClick={onSubmitNewPost} type="button">
            {' '}
            +{' '}
          </button>
        </div>      
        {status === WalletStatus.WALLET_CONNECTED && (
          <div style={{ display: 'inline' }}>
            <input
              type="number"
              onChange={(e) => setResetValue(+e.target.value)}
              value={resetValue}
            />
            <button onClick={onClickReset} type="button">
              {' '}
              reset{' '}
            </button>
          </div>
        )}
        <ConnectWallet />
      </header>
    </div>
  )
}

export default App
