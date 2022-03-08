use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Item;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Post {
    owner: Addr,
    subject: String,
    content: String,
    likes: Vec<Addr>
}

impl Post {
    pub fn new(owner:Addr, subject : String, content: String) -> Post {
        Post {
            owner,
            subject,
            content,
            likes: Vec::new()
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

    pub fn like_message(&mut self, addr: Addr){
        let upvoted = self.likes.iter().position(|x| *x == addr.as_str());

        match upvoted {
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
    pub messages: Vec<Post>
}

pub const STATE: Item<State> = Item::new("state");
