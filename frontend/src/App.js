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
  const [messages, setMessages] = useState ([])
  const [loading, setLoading] = useState(false);
  const connectedWallet = useConnectedWallet()

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (connectedWallet) {
        let { messages } = await query.getMessages(connectedWallet);
        console.log(posts);
        setMessages(messages);
      }
      setLoading(false);
    })();
  }, [connectedWallet]);

  const onSubmitNewMessage = async ([]) => {
    setLoading(true);
    try {
      await execute.createPost(connectedWallet, post);
      posts.push(post);
      setPosts(posts);
    }
    catch (e) {
      setLoading(false);
      throw e;
    }
    setLoading(false);
  }

  const onClickReset = async () => {
    setUpdating(true)
    console.log(resetValue)
    await execute.reset(connectedWallet, resetValue)
    setCount((await query.getCount(connectedWallet)).count)
    setUpdating(false)
  }

  return (
    <div className="App">
      <AppHeader
        onSubmitNewMessage={(event) => onSubmitNewMessage(event)} />
      <div className="AppContent">
        {connectedWallet
          ? <PostsList
            posts={posts}
            toggleUpvote={toggleUpvote} />
          : <Card className="AppConnectWallet" title="Connect your wallet to see the posts" />
        }
      </div>
      {loading && <Loader position="fixed" />}
    </div>
  )
}

export default App
