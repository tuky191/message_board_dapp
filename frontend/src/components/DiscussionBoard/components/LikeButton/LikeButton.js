import React, { useState } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "./hand.svg";
import "./styles.scss";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";
import * as execute from '../../../../contract/execute'

const particleList = Array.from(Array(10));


const LikeButton = ({ index, likes, setPostLikesCount, PostlikesCount }) => {
    const [clicked, setClicked] = useState(false);
    const { status } = useWallet()
    const connectedWallet = useConnectedWallet()
    const initiateLikes = () => {
        return (likes?.find(like => like === connectedWallet.walletAddress ? true : false))
    }
    const [liked, setLiked] = useState(initiateLikes);

    const updateTerra = async (index) => {
        await execute.likeMessage(connectedWallet, index)
        setPostLikesCount(liked ? PostlikesCount - 1 : PostlikesCount + 1)
        setLiked(!liked)
        setClicked(true)
    }

    return (
        <button
            onClick={() => {
                updateTerra(index)
            }}
            onAnimationEnd={() => setClicked(false)}
            className={cn("like-button-wrapper", {
                liked,
                clicked,
            })}
        >
            {liked && (
                <div className="particles">
                    {particleList.map((_, index) => (
                        <div
                            className="particle-rotate"
                            style={{
                                transform: `rotate(${(360 / particleList.length) * index + 1
                                    }deg)`,
                            }}
                        >
                            <div className="particle-tick" />
                        </div>
                    ))}
                </div>
            )}
            <div className="like-button">
                <Hand />
                <span>Like</span>
                <span className={cn("suffix", { liked })}>d</span>
            </div>
        </button>
    );
};

export default LikeButton;