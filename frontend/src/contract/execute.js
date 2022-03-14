import { LCDClient, MsgExecuteContract, Fee } from "@terra-money/terra.js";
import { contractAdress } from "./address";

// ==== utils ====

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const _exec =
  (msg, fee = new Fee(200000, { uluna: 10000 })) =>
  async (wallet) => {
    const lcd = new LCDClient({
      URL: wallet.network.lcd,
      chainID: wallet.network.chainID,
    });

    const { result } = await wallet.post({
      fee,
      msgs: [
        new MsgExecuteContract(
          wallet.walletAddress,
          contractAdress(wallet),
          msg
        ),
      ],
    });

    while (true) {
      try {
        return await lcd.tx.txInfo(result.txhash);
      } catch (e) {
        if (Date.now() < untilInterval) {
          await sleep(500);
        } else if (Date.now() < until) {
          await sleep(1000 * 10);
        } else {
          throw new Error(
            `Transaction queued. To verify the status, please check the transaction hash: ${result.txhash}`
          );
        }
      }
    }
  };

// ==== execute contract ====

export const createMessage = async (wallet, message) => {
  return _exec({
    submit_message: {
      subject: message.subject,
      content: message.content,
      created: message.created,
      attachement: message.attachement,
      thread_id: message.thread_id,
    }
  })(wallet);
}


export const updateProfile = async (wallet, message) =>
  _exec({
    update_profile: {
      handle: message.handle,
      avatar: message.avatar,
      bio: message.bio,
      created: message.created
    }
  })(wallet);

export const likeMessage = async (wallet, index) =>
  _exec({
    like_message: { index }
  })(wallet);