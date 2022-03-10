import React, { useState, useEffect } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "./hand.svg";
import "./styles.scss";
import { useConnectedWallet, useWallet } from "@terra-money/wallet-provider";
import * as execute from '../contract/execute'

const particleList = Array.from(Array(10));

const LikeButton = () => {
    const [liked, setLiked] = useState(null);
    const [clicked, setClicked] = useState(false);
    const { status } = useWallet()
    const connectedWallet = useConnectedWallet()

//likeMessage
    return (
        <button
            onClick={() => {
                let like_message_index = 0;
                execute.likeMessage(connectedWallet, like_message_index);
                setLiked(!liked);
                setClicked(true);
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