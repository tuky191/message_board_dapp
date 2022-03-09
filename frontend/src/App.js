import './App.css'

import { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'

import DiscussionBoard from './components/DiscussionBoard'
import * as execute from './contract/execute'
import * as query from './contract/query'
import { ConnectWallet } from './components/ConnectWallet'
 
  const App = () => {
    const [messages, setMessages] = useState([{
      owner: '',
      subject: '',
      content: '',
      likes: []
    }])
    const [updating, setUpdating] = useState(true)
    const { status } = useWallet()
    const connectedWallet = useConnectedWallet()
    const allPosts = []
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
      (async () => {
        setUpdating(true);
        if (connectedWallet) {
          let { messages } = await query.getMessages(connectedWallet);
          console.log(messages);
          setMessages(messages);
          for (let i = 0; i < messages.length; i++) {
            allPosts.push({ profileImage: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg',
                            owner: messages[i].owner,
                            subject: messages[i].subject,
                            content: messages[i].content,
                            date: new Date('01 Jan 2020 01:12:00 GMT')
          })
          } 
        }
        setPosts([...allPosts]);
        setUpdating(false);
      })();
    }, [connectedWallet]);


    const submitPost = async (subject, content) => {
      setUpdating(true);
      try {
        let message = {};
        message.subject = subject;
        message.content = content;
        await execute.createMessage(connectedWallet, message);
        let { messages } = await query.getMessages(connectedWallet);
        setMessages(messages);
        for (let i = 0; i < messages.length; i++) {
          allPosts.push({
            profileImage: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg',
            owner: messages[i].owner,
            subject: messages[i].subject,
            content: messages[i].content,
            date: new Date('01 Jan 2020 01:12:00 GMT')
          })
        } 
        setPosts([...allPosts]);
      }
      catch (e) {
        setUpdating(false);
        throw e;
      }
      setUpdating(false);
    }
    return (
      
      <div className='App'>
        <ConnectWallet />
        {status === WalletStatus.WALLET_CONNECTED && (
          <div>
            <DiscussionBoard posts={posts} onSubmit={submitPost} />
          </div>
        )}
      </div>
    )
  }

export default App