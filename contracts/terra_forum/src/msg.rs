use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Addr;
use crate::state::Post;
use crate::state::Thread;
use crate::state::Profile;
use crate::state::Attachment;


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub messages: Vec<Post>,
    pub profiles: Vec<Profile>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SubmitMessage {content : String, subject: String, attachment: Vec<Attachment>, thread_id: Option<u32>, created: String},
    LikeMessage {index: u32},
    UpdateProfile {handle: String, avatar: String, bio: String,created: String},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    GetMessages {},
    GetMessageByAddress { addr: Addr },
    GetProfiles {},
    GetProfileByAddress { addr: Addr },
    GetThreads {},
    GetMessagesByThreadId {thread_id: u32},
    GetMessagesByContentOrSubject {content: String, subject: String}
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MessagesResponse {
    pub messages: Vec<Post>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ProfilesResponse {
    pub profiles: Vec<Profile>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ThreadsResponse {
    pub threads: Vec<Thread>,
}