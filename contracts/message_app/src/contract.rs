#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Addr};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, MessagesResponse, ProfilesResponse};
use crate::state::{State, STATE};
use crate::state::Post;
use crate::state::Profile;


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
        ExecuteMsg::SubmitMessage {subject, content, image, thread_index, created} => try_submit(deps, info, subject, content, image, thread_index, created),
        ExecuteMsg::LikeMessage {index} => try_like(deps, info, index),
        ExecuteMsg::UpdateProfile {nickname, profile_picture, created} => try_update_profile(deps, info, nickname, profile_picture, created),

    }
}

pub fn try_submit(deps: DepsMut, info: MessageInfo, subject: String, content: String, image: String, thread_index: u32, created: String) -> Result<Response, ContractError> {
    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        state.messages.push(Post::new(info.sender, subject, content, image, thread_index, created));
        Ok(state)
    })?;

    Ok(Response::new().add_attribute("method", "try_submit"))
}

pub fn try_update_profile(deps: DepsMut, info: MessageInfo, nickname: String, profile_picture: String, created: String) -> Result<Response, ContractError> {

    STATE.update(deps.storage, |mut state| -> Result<_, ContractError> {
        match state.profiles.iter_mut().find(|ref p| info.sender == p.owner) {
            Some(profile) => {
                profile.nickname = nickname;
                profile.profile_picture = profile_picture;
            }
            // o/w insert a new leaf at the end
            None => {
                state.profiles.push(Profile::new(info.sender, nickname, profile_picture, created));
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
        QueryMsg::GetProfileByAddress { addr } => to_binary(&get_profile_by_addr(deps, addr)?)        
    }
}

fn get_messages(deps: Deps) -> StdResult<MessagesResponse> {
    let state = STATE.load(deps.storage)?;
    Ok(MessagesResponse { messages: state.messages })
}

fn get_message_by_addr(deps: Deps, addr: Addr) -> StdResult<MessagesResponse> {
    let state = STATE.load(deps.storage)?;
    
    let messages = state.messages
        .iter()
        .filter(|&message| addr.eq(message.get_owner()))
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
        .filter(|&profile| addr.eq(profile.get_owner()))
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

        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), image: String::from("imageId"), created: String::from("1234567890"), thread_index: 0};
        println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessages {}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts : Vec<Post> = value.messages;
        println!("{:#?}", posts);
        assert_eq!(1, posts.len());
        assert_eq!("some subject", posts.get(0).unwrap().get_subject());
        assert_eq!("some content", posts.get(0).unwrap().get_content());

        assert_eq!("imageId", posts.get(0).unwrap().get_image());
        assert_eq!("1234567890", posts.get(0).unwrap().get_created());
        assert_eq!(0, posts.get(0).unwrap().get_thread_index());
        assert_eq!("some content", posts.get(0).unwrap().get_content());
        assert_eq!(0, posts.get(0).unwrap().get_likes().len());
    }
    #[test]
    fn create_profile() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));

        let msg = ExecuteMsg::UpdateProfile { nickname: String::from("BigBen"), profile_picture : String::from("ImageId"), created: String::from("1234567890")};
        println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        println!("{:#?}", profiles);
        assert_eq!(1, profiles.len());
        assert_eq!("BigBen", profiles.get(0).unwrap().get_nickname());
        assert_eq!("ImageId", profiles.get(0).unwrap().get_profile_picture());
        assert_eq!("1234567890", profiles.get(0).unwrap().get_created());
    }
    #[test]
    fn update_profile() {
        //GIVEN
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("anyone", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("creator", &coins(2, "token"));

        let msg = ExecuteMsg::UpdateProfile { nickname: String::from("BigBen"), profile_picture : String::from("ImageId"), created: String::from("1234567890")};
        println!("{:#?}", msg);
 
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        
        println!("{:#?}", profiles);
        
        assert_eq!(1, profiles.len());
        assert_eq!("BigBen", profiles.get(0).unwrap().get_nickname());
        assert_eq!("ImageId", profiles.get(0).unwrap().get_profile_picture());
        assert_eq!("1234567890", profiles.get(0).unwrap().get_created());
        
        let info = mock_info("creator", &coins(2, "token"));
        let msg = ExecuteMsg::UpdateProfile { nickname: String::from("SmallSam"), profile_picture : String::from("unicorn_shooting_star.jpg"), created: String::from("1234567890")};
        println!("{:#?}", msg);
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetProfiles {}).unwrap();
        let value: ProfilesResponse = from_binary(&res).unwrap();
        let profiles : Vec<Profile> = value.profiles;
        println!("{:#?}", profiles);
        assert_eq!(1, profiles.len());
        assert_eq!("SmallSam", profiles.get(0).unwrap().get_nickname());
        assert_eq!("unicorn_shooting_star.jpg", profiles.get(0).unwrap().get_profile_picture());
        assert_eq!("1234567890", profiles.get(0).unwrap().get_created());   
    }

    #[test]
    fn like_a_created_post() {
        let mut deps = mock_dependencies(&coins(2, "token"));
        let msg = InstantiateMsg { messages: Vec::new(), profiles: Vec::new() };
        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::SubmitMessage { content: String::from("some content"), subject : String::from("some subject"), image: String::from("imageId"), created: String::from("1234567890"), thread_index: 0};

        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let info = mock_info("anyone", &coins(2, "token"));
        let msg = ExecuteMsg::LikeMessage { index : 0};
        let _res = execute(deps.as_mut(), mock_env(), info, msg).unwrap();

        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetMessages {}).unwrap();
        let value: MessagesResponse = from_binary(&res).unwrap();
        let posts: &Post = value.messages.get(0).unwrap();
        assert_eq!(1, posts.get_likes().len());
    }
}
