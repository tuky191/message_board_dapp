import './App.css'

import { useEffect, useState } from 'react'
import {
  useWallet,
  useConnectedWallet,
  WalletStatus,
} from '@terra-money/wallet-provider'
import DiscussionBoard from './components/DiscussionBoard/DiscussionBoard'
import * as execute from './contract/execute'
import * as query from './contract/query'
import { ConnectWallet } from './components/TerraWallet/ConnectWallet'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Spinner from './components/Spinner/Spinner'


  const App = () => {

    const connectedWallet = useConnectedWallet()

    const [updating, setUpdating] = useState(true)
    const [showNewUserPopUP, setNewUserModal] = useState(false)
    const [userProfile, setUserProfile] = useState({})
    const [userProfiles, setUserProfiles] = useState([])

    const [forumMessage, setForumMessage] = useState({content:'', subject:'', attachment:[]})
    const { status } = useWallet()
    const allThreads = []
    const [threads, setThreads] = useState([])
        
    useEffect(() => {
      (async () => {
        
        if (connectedWallet) {
          setUpdating(true);
          checkIfUserHasProfile();
          try {
            setUserProfiles((await query.getProfiles(connectedWallet)).profiles)
          } catch {
            setUserProfiles([])
          }
          await refreshPosts();
          setUpdating(false);
        }
        
      })();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectedWallet]);


    const convert_epoch = (date) =>{
      return Date.parse(date)
    }

    const generateMockProfile = () => {
      if (updating) {
          //console.log(updating)
      }
        const getRandomElement = (List) => {
        return List[Math.floor(Math.random() * List.length)]
      }
      const handles = ["blissfulavocado", "gloomycheddar", "BionicBeaver", "StoicFranklin", "RustyTheCruty", "Juul"];
      const avatars = ["https://bootdey.com/img/Content/avatar/avatar1.png", "https://bootdey.com/img/Content/avatar/avatar2.png", "https://bootdey.com/img/Content/avatar/avatar3.png", "https://bootdey.com/img/Content/avatar/avatar4.png", "https://bootdey.com/img/Content/avatar/avatar5.png", "https://bootdey.com/img/Content/avatar/avatar6.png", "https://bootdey.com/img/Content/avatar/avatar7.png"];
      const bios = ['Too dead to die.', "I’m not always sarcastic. Sometimes, I’m sleeping.", "I prefer my puns intended.", "Just another papercut survivor.", 'Write something about you. What do you like more, cats or dogs? Why dogs?']
      return {
        handle: getRandomElement(handles),
        avatar: getRandomElement(avatars),
        bio: getRandomElement(bios)
      }
    }
 
    const checkIfUserHasProfile = async() => {
      let profile = {};
      try {
        profile = await query.getProfileByAddress(connectedWallet, connectedWallet.walletAddress);
      } catch {
        profile.profiles = [];
      }
      
      console.log(profile);
      if (profile.profiles.length === 0) {
        setNewUserModal(true);
        setUserProfile(generateMockProfile())
        setUpdating(false);
      } else {
        setUserProfile(profile.profiles[0])
        setNewUserModal(false);
        setUpdating(false);
      }
    }


    const submitData = async(data) => {
      if (data.method === 'submitPost') {
        await submitPost(data.subject, data.content)
      } else if ((data.method === 'submitProfile')) {
        await submitProfile()
      }
    }
    
    const refreshPosts = async () => {
      let threads = [];
      var user_profiles = {}

      try {
        setUserProfiles((await query.getProfiles(connectedWallet)).profiles)

      }catch {
        setUserProfiles([])
      }
      
      threads = (await query.getThreads(connectedWallet)).threads;
      for (let i = 0; i < threads.length; i++) {
        let thread_id = threads[i]['thread_id']
        let current_thread =  (await query.getMessagesByThreadId(connectedWallet, thread_id)).threads[0];
        let messages = current_thread['related_messages']
        let currentPosts = [];
        for (let j = 0; j < messages.length; j++) {
          if (!(messages[j].owner in user_profiles)) {
            user_profiles[messages[j].owner] = (await query.getProfileByAddress(connectedWallet, messages[j].owner)).profiles[0];
          }
          let post = {
            profileImage: user_profiles[messages[j].owner].avatar,
            owner: messages[j].owner,
            alias: user_profiles[messages[j].owner].handle,
            subject: messages[j].subject,
            content: messages[j].content,
            created: messages[j].created,
            attachment: messages[j].attachment,
            likes: messages[j].likes,
            message_id: messages[j]['message_id'],
            thread_id: thread_id,
            title_post: j === 0 ? true : false
          }
          currentPosts.push(post)
        } 
        allThreads.push({
          thread_id: thread_id,
          created: current_thread.created,
          title: currentPosts[0].subject,
          body: currentPosts[0].content,
          owner: currentPosts[0].owner,
          related_messages: currentPosts       
        })

      }
        
     setThreads([...allThreads]);
    }

    const submitProfile = async () => {
      setUpdating(true);
      let message = userProfile;
      message.created = convert_epoch(new Date()).toString();
      await execute.updateProfile(connectedWallet, message);
      await checkIfUserHasProfile();
      await refreshPosts();
    }


    const submitPost = async () => {
      setUpdating(true);
      try {
        let message = forumMessage;
        console.log(message);
        message.created = convert_epoch(new Date()).toString();
        message.attachment = message.attachment.length === 0 ? [] : message.attachment 
        console.log(message)
        await execute.createMessage(connectedWallet, message);
        setForumMessage({ content: '', subject: '', attachment: [] })
        await refreshPosts();
      }
      catch (e) {
        setUpdating(false);
        throw e;
      } 
      setUpdating(false);
    }

    return (
      <div>
        <ConnectWallet />
        {status === WalletStatus.WALLET_CONNECTED && (
            <DiscussionBoard threads={threads} 
                             onSubmit={submitData} 
                             showNewUserPopUP={showNewUserPopUP} 
                             userProfile={userProfile} 
                             setUserProfile={setUserProfile} 
                             setForumMessage={setForumMessage} 
                             refreshPosts={refreshPosts} 
                             userProfiles={userProfiles} 
            />
        )}
        {updating && <Spinner/>}
      </div>
    )
  }

export default App