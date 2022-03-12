#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr};
use cw2::set_contract_version;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, MessagesResponse, ProfilesResponse, ThreadsResponse};
use crate::state::{State, STATE};
use crate::state::Post;
use crate::state::Profile;
use crate::state::Thread;
//use regex::Regex;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:message_board";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = State {
        messages: Vec::new(),
        profiles: Vec::new(),
        threads: Vec::new(),
        owner: info.sender.clone(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    STATE.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::SubmitMessage {subject, content, attachement, thread_id, created} => try_submit(deps, info, subject, content, attachement, thread_id, created),
        ExecuteMsg::LikeMessage {index} => try_like(deps, info, index),
        ExecuteMsg::UpdateProfile {handle, avatar, bio, created} => try_update_profile(deps, info, handle, avatar, bio, created),

    }
}

fn put_and_get_index<T>(v: &mut Vec<T>, item: T) -> usize {
    let idx = v.len();
    v.push(item);
    idx
}

//This should be redesign for hashmap instead vec
pub fn try_submit(deps: DepsMut, info: MessageInfo, subject: String, content: String, attachement: String, thread_id: usize, created: String) -> Result<Response, ContractError> {
    //First enter new post into messages vec, message_id is 0
    let new_post = Post::new(info.sender, subject, content, attachement, thread_id, 0, created.clone());
    //placeholder index

    let mut index: usize = 0;
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        index = put_and_get_index(&mut state.messages, new_post.clone());
        *state.messages[index].message_id() = index;
        Ok(state)
    })?;

    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        match state.threads.iter_mut().find(|ref p| thread_id == *p.thread_id_immut()) {
            Some(thread) => {
                //Need to refactor with references
                thread.related_messages_ids().push(index);
                *thread.thread_id() = thread_id;
            }
            None => {
                let mut thread = Thread::new(Vec::new(), Vec::new(), thread_id, created);
                thread.related_messages_ids().push(index);
                state.threads.push(thread);
            }
        }               
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "try_submit"))
}

pub fn try_update_profile(deps: DepsMut, info: MessageInfo, handle: String, avatar: String, bio: String, created: String) -> Result<Response, ContractError> {

    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        match state.profiles.iter_mut().find(|ref p| info.sender == *p.owner_immut()) {
            Some(profile) => {
                *profile.handle() = handle;
                *profile.avatar() = avatar;
                *profile.bio() = bio;
            }
            None => {
                state.profiles.push(Profile::new(info.sender, handle, avatar, bio, created));
            }
        }               
        Ok(state)
    })?;
    Ok(Response::new().add_attribute("method", "try_update_profile"))
}

pub fn try_like(deps: DepsMut, info: MessageInfo, index: u32) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        match state.messages.get_mut(index as usize) {
            Some(post) => {
                post.like_message(info.sender);
                Ok(state)
            },
            None => Err(ContractError::PostDoesNotExist{})
        }
    })?;
    Ok(Response::new().add_attribute("method", "try_like"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetMessages {} => to_binary(&get_messages(deps)?),
        QueryMsg::GetMessageByAddress { addr } => to_binary(&get_message_by_addr(deps, addr)?),
        QueryMsg::GetProfiles {} => to_binary(&get_profiles(deps)?),
        QueryMsg::GetProfileByAddress { addr } => to_binary(&get_profile_by_addr(deps, addr)?),
        QueryMsg::GetThreads {} => to_binary(&get_threads(deps)?),
        QueryMsg::GetMessagesByThreadId { thread_id } => to_binary(&get_messages_by_thread_id(deps, thread_id)?),
        QueryMsg::GetMessagesByContentOrSubject { content, subject } => to_binary(&get_messages_by_content_or_subject(deps, content, subject)?)
        

    }
}

fn get_messages_by_content_or_subject(deps: Deps, content: String, subject: String) -> StdResult<MessagesResponse> {

    let state = STATE.load(deps.storage)?;
    let mut found_messages = Vec::new();
    
    //let re_content = Regex::new(&content).unwrap();
    //let re_subject = Regex::new(&subject).unwrap();
        for i in 0..state.messages.len() {
            if state.messages[i].content_immut().contains(&content) && !content.is_empty()  {
                found_messages.push(state.messages[i].clone());
            }
            if state.messages[i].subject_immut().contains(&subject) && !subject.is_empty() {
                found_messages.push(state.messages[i].clone());
            }
    }
    
    Ok(MessagesResponse { messages: found_messages })
}

fn get_messages(deps: Deps) -> StdResult<MessagesResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(MessagesResponse { messages: state.messages })
}
fn get_messages_by_thread_id(deps: Deps, thread_id: usize) -> StdResult<ThreadsResponse> {
    let state = STATE.load(deps.storage)?;
    let messages = state.messages
        .iter()
        .filter(|&message| thread_id.eq(*&message.thread_id_immut()))
        .cloned()
        .collect::<Vec<Post>>();

    let mut threads = state.threads;
        for i in 0..threads.len() {
            if *threads[i].thread_id_immut() == thread_id {
                threads[i].related_messages = messages.clone();
            }
    }       

    Ok(ThreadsResponse { threads: threads })
}

fn get_threads(deps: Deps) -> StdResult<ThreadsResponse> {
    let state = STATE.load(deps.storage)?;

    let mut threads_with_id = Vec::new();
        for i in 0..state.threads.len() {
            let mut thread = state.threads[i].clone();
            *thread.thread_id() = i; 
            threads_with_id.push(thread);
        }

    Ok(ThreadsResponse { threads: threads_with_id })
}


fn get_message_by_addr(deps: Deps, addr: Addr) -> StdResult<MessagesResponse> {
    let state = STATE.load(deps.storage)?;
    
    let messages = state.messages
        .iter()
        .filter(|&message| addr.eq(*&message.owner_immut()))
        .cloned()
        .collect::<Vec<Post>>();
    Ok(MessagesResponse { messages })
}

fn get_profiles(deps: Deps) -> StdResult<ProfilesResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(ProfilesResponse { profiles: state.profiles })
}

fn get_profile_by_addr(deps: Deps, addr: Addr) -> StdResult<ProfilesResponse> {
    let state = STATE.load(deps.storage)?;
    
    let profiles = state.profiles
        .iter()
        .filter(|&profile| addr.eq(profile.owner_immut()))
        .cloned()
        .collect::<Vec<Profile>>();
    Ok(ProfilesResponse { profiles })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies(&[]);
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(1000, "luna"));
        let instance_res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let query_response = query(deps.as_ref(), mock_env(), QueryMsg::GetMessages {}).unwrap();
        let query_value: MessagesResponse = from_binary(&query_response).unwrap();
        let response : Vec<Post> = Vec::new();        
        assert_eq!(0, instance_res.messages.len());
        assert_eq!(response, query_value.messages);
    }

   #[test]
    fn create_post() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));

        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
//      println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessages {}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts : Vec<Post> = value.messages;
        println!("{:#?}", posts);
        assert_eq!(2, posts.len());
        assert_eq!("some subject", posts.get(0).unwrap().subject_immut());
        assert_eq!("some content", posts.get(0).unwrap().content_immut());

        assert_eq!("attachementId", posts.get(0).unwrap().attachement_immut());
        assert_eq!("1234567890", posts.get(0).unwrap().created_immut());
        assert_eq!(0, *posts.get(0).unwrap().thread_id_immut());
        assert_eq!("some content", posts.get(0).unwrap().content_immut());
        assert_eq!(0, posts.get(0).unwrap().likes_immut().len());

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetThreads {}).unwrap();
        let value: ThreadsResponse = from_binary(&res).unwrap();
        let threads : Vec<Thread> = value.threads;
        println!("{:#?}", threads);
        assert_eq!(1, threads.len());
        assert_eq!(0, *threads.get(0).unwrap().thread_id_immut());
        //assert_eq!("some content", threads.get(0).unwrap().get_related_messages());

    }
  #[test]
    fn get_threads() {

        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetThreads {}).unwrap();
        let value: ThreadsResponse = from_binary(&res).unwrap();
        let threads : Vec<Thread> = value.threads;
        println!("{:#?}", threads);
        assert_eq!(1, threads.len());
        assert_eq!(0, *threads.get(0).unwrap().thread_id_immut());
        
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessagesByThreadId {thread_id: 0}).unwrap();
        let value: ThreadsResponse = from_binary(&res).unwrap();
        let threads : Vec<Thread> = value.threads;
        println!("{:#?}", threads);
               
        //assert_eq!(0, *threads.get(0).unwrap().message_id_immut());
        //assert_eq!(1, *threads.get(1).unwrap().message_id_immut());
    }


    #[test]
    fn create_profile() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));

        let msg = ExecuteMsg::UpdateProfile { handle: String::from("BigBen"), avatar: String::from("attachementId"), bio: String::from("Story of MY LIFE"), created: String::from("1234567890")};
        println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        println!("{:#?}", profiles);
        assert_eq!(1, profiles.len());
        assert_eq!("BigBen", profiles.get(0).unwrap().handle_immut());
        assert_eq!("attachementId", profiles.get(0).unwrap().avatar_immut());
        assert_eq!("Story of MY LIFE", profiles.get(0).unwrap().bio_immut());
        assert_eq!("1234567890", profiles.get(0).unwrap().created_immut());
    }
    #[test]
    fn update_profile() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("anyone", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("creator", &coins(2, "token"));

        let msg = ExecuteMsg::UpdateProfile { handle: String::from("BigBen"), avatar : String::from("attachementId"), bio: String::from("Story of MY LIFE"), created: String::from("1234567890")};
        println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        
        println!("{:#?}", profiles);
        
        assert_eq!(1, profiles.len());
        assert_eq!("BigBen", profiles.get(0).unwrap().handle_immut());
        assert_eq!("attachementId", profiles.get(0).unwrap().avatar_immut());
        assert_eq!("Story of MY LIFE", profiles.get(0).unwrap().bio_immut());
        assert_eq!("1234567890", profiles.get(0).unwrap().created_immut());
        
        let info = mock_info("creator", &coins(2, "token"));
        let msg = ExecuteMsg::UpdateProfile { handle: String::from("SmallSam"), avatar : String::from("unicorn_shooting_star.jpg"), bio : String::from("I come from small willage, just south of New New York"), created: String::from("1234567890")};
        println!("{:#?}", msg);
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        println!("{:#?}", profiles);
        assert_eq!(1, profiles.len());
        assert_eq!("SmallSam", profiles.get(0).unwrap().handle_immut());
        assert_eq!("unicorn_shooting_star.jpg", profiles.get(0).unwrap().avatar_immut());
        assert_eq!("I come from small willage, just south of New New York", profiles.get(0).unwrap().bio_immut());
        assert_eq!("1234567890", profiles.get(0).unwrap().created_immut());   
    }

    #[test]
    fn like_a_created_post() {
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};

        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::LikeMessage { index : 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessages {}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts: &Post = value.messages.get(0).unwrap();
        assert_eq!(1, posts.likes_immut().len());
    }

   #[test]
    fn search_post_by_subject_or_content() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();

        //MESSAGE #1
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("One Thing is certain, we cannot go that way."), subject : String::from("Subject from the other side"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        //MESSAGE #2
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("Mary has a little lamb"), subject : String::from("Is this all there is for me"), attachement: String::from("attachementId"), created: String::from("1234567890"), thread_id: 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        //SEARCH BY SUBJECT
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessagesByContentOrSubject {subject: String::from("the other side"), content: String::from("")}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts : Vec<Post> = value.messages;
        println!("{:#?}", posts);
        assert_eq!(1, posts.len());
        assert_eq!("Subject from the other side", *posts.get(0).unwrap().subject_immut());

        //SEARCH BY SUBJECT
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessagesByContentOrSubject {subject: String::from(""), content: String::from("Mary has a little")}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts : Vec<Post> = value.messages;
        println!("{:#?}", posts);
        assert_eq!(1, posts.len());
        assert_eq!("Mary has a little lamb", *posts.get(0).unwrap().content_immut());
    }



}
