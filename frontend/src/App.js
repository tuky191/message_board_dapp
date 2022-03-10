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
      date: '',
      image: '',
      created: '',
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
            allPosts.push({ profileImage: 'https://bootdey.com/img/Content/avatar/avatar1.png',
                            owner: messages[i].owner,
                            subject: messages[i].subject,
                            content: messages[i].content,
                            created: messages[i].created,
                            image: messages[i].image,
                            likes: messages[i].likes,
          })
          } 
        }
        setPosts([...allPosts]);
        setUpdating(false);
      })();
    }, [connectedWallet]);

    const convert_epoch = (date) =>{
      return Date.parse(date)
    }
    const submitPost = async (subject, content) => {
      setUpdating(true);
      try {
        let message = {};
        let date = new Date();
        message.subject = subject;
        message.content = content;
        message.created = convert_epoch(date).toString();
        message.image = 'https://bootdey.com/img/Content/avatar/avatar1.png';
        message.thread_index = 0;
        await execute.createMessage(connectedWallet, message);
        let { messages } = await query.getMessages(connectedWallet);
        setMessages(messages);
        //likes?.find(like => like === connectedWallet.walletAddress)
        for (let i = 0; i < messages.length; i++) {
          allPosts.push({
            profileImage: 'https://bootdey.com/img/Content/avatar/avatar1.png',
            owner: messages[i].owner,
            subject: messages[i].subject,
            content: messages[i].content,
            created: messages[i].created,
            image: messages[i].image,
            likes: messages[i].likes,
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