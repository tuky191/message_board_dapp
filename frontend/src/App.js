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
    const [new_user, setNewUserModal] = useState(false)
    const { status } = useWallet()
    const connectedWallet = useConnectedWallet()
    const allPosts = []
    const [posts, setPosts] = useState([])
    
    useEffect(() => {
      (async () => {
        setUpdating(true);
        if (connectedWallet) {
          checkIfUserHasProfile();
          await refreshPosts();
        }
        setPosts([...allPosts]);
        setUpdating(false);
      })();
    }, [connectedWallet]);

    const convert_epoch = (date) =>{
      return Date.parse(date)
    }

    const checkIfUserHasProfile = async() => {
      let profile = await query.getProfileByAddress(connectedWallet, connectedWallet.walletAddress);
      if (profile.profiles.length == 0) {
        setNewUserModal(true);
        console.log('User without profile!');
      } else {
        console.log(profile.profiles[0])
        setNewUserModal(false);
      }
    }
    const submitData = async(data) => {
      if (data.method === 'submitPost') {
        await submitPost(data.subject, data.content)
      } else if ((data.method === 'submitProfile')) {
        await submitProfile(data.nickname, data.profile_picture)
      }
    }
    const submitProfile = async (nickname, profile_picture) => {
      setUpdating(true);
      let message = {};
      let date = new Date();
      message.nickname = nickname;
      message.profile_picture = profile_picture;
      message.created = convert_epoch(date).toString();
      await execute.updateProfile(connectedWallet, message);
      await checkIfUserHasProfile();
      await refreshPosts();
    }
    const refreshPosts = async () => {
      let { messages } = await query.getMessages(connectedWallet);
      setMessages(messages);
      var user_profiles = {}
      try {
        for (let i = 0; i < messages.length; i++) {
          if (!(messages[i].owner in user_profiles)) {
            console.log(messages[i].owner)
            user_profiles[messages[i].owner] = await query.getProfileByAddress(connectedWallet, messages[i].owner);
          }          
          allPosts.push({
            profileImage: user_profiles[messages[i].owner].profiles[0].profile_picture,
            owner: messages[i].owner,
            alias: user_profiles[messages[i].owner].profiles[0].nickname,
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
        //throw e;
      }
    }
    
    const submitPost = async (subject, content) => {
      setUpdating(true);
      try {
        let message = {};
        let date = new Date();
        message.subject = subject;
        message.content = content;
        message.created = convert_epoch(date).toString();
        message.image = '';
        message.thread_index = 0;
        console.log(message);
        await execute.createMessage(connectedWallet, message);
        await refreshPosts();
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
            <DiscussionBoard posts={posts} onSubmit={submitData} new_user={new_user} />
          </div>
        )}
      </div>
    )
  }

export default App