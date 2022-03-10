use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Profile {
    pub owner: Addr,
    pub nickname: String,
    pub profile_picture: String,
    pub created: String
}

impl Profile {
    pub fn new(owner:Addr, nickname : String, profile_picture: String, created: String) -> Profile {
        Profile {
            owner,
            nickname,
            profile_picture,
            created
        }
    }
    pub fn get_owner(&self) -> &Addr {
        &self.owner
    }

    pub fn get_nickname(&self) -> &String {
        &self.nickname
    }

    pub fn get_profile_picture(&self) -> &String {
        &self.profile_picture
    }
    pub fn get_created(&self) -> &String {
        &self.created
    }    

}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Post {
    owner: Addr,
    subject: String,
    content: String,
    image: String,
    likes: Vec<Addr>,
    thread_index: u32,
    created: String
}

impl Post {
    pub fn new(owner:Addr, subject : String, content: String, image: String, thread_index: u32, created: String) -> Post {
        Post {
            owner,
            subject,
            content,
            likes: Vec::new(),
            image,
            thread_index,
            created
        }
    }

    pub fn get_owner(&self) -> &Addr {
        &self.owner
    }

    pub fn get_content(&self) -> &String {
        &self.content
    }

    pub fn get_subject(&self) -> &String {
        &self.subject
    }

    pub fn get_likes(&self) -> &Vec<Addr> {
        &self.likes
    }
    pub fn get_image(&self) -> &String {
        &self.image
    }

    pub fn get_created(&self) -> &String {
        &self.created
    }

    pub fn get_thread_index(&self) -> u32 {
        self.thread_index
    }

    pub fn like_message(&mut self, addr: Addr){
        let liked = self.likes.iter().position(|x| *x == addr.as_str());

        match liked {
            Some(index) => {
                self.likes.remove(index);
            },
            None => {
                self.likes.push(addr);
            }
        }
    }
}


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub owner: Addr,
    pub messages: Vec<Post>,
    pub profiles: Vec<Profile>
}

pub const STATE: Item<State> = Item::new("state");
