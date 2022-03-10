use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Addr;
use crate::state::Post;
use crate::state::Profile;


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub messages: Vec<Post>,
    pub profiles: Vec<Profile>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    SubmitMessage {content : String, subject: String, image: String, thread_index:u32, created: String},
    LikeMessage {index: u32},
    UpdateProfile {nickname: String, profile_picture: String, created: String},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    GetMessages {},
    GetMessageByAddress { addr: Addr },
    GetProfiles {},
    GetProfileByAddress { addr: Addr }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MessagesResponse {
    pub messages: Vec<Post>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ProfilesResponse {
    pub profiles: Vec<Profile>,
}