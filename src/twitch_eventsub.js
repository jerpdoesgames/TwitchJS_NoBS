class twitchEventSub
{
    onMessage(aEvent)
    {
        console.log("Websocket onmessage =====");
        if (twitchConfig.debug)
        {
            console.log(aEvent);
        }

        let messageData = JSON.parse(aEvent.data);
        let messageType = messageData.metadata.message_type;

        switch(messageType)
        {
            case "session_welcome":
                console.log("Received EventSub welcome =====");
                this.sessionID = messageData.payload.session.id;
                this.subscribeToTopics();
                break;
            case "session_keepalive":
                console.log("Received keepalive - connection is still good.");
                break;
            case "notification":
                
                let subscriptionInfo = messageData.payload.subscription;
                let notifyType = subscriptionInfo.type;
                let eventInfo = messageData.payload.event;
                switch(notifyType)
                {
                    case "channel.chat.message":
                        let messageUsername = eventInfo.chatter_user_name;
                        let messageBody = eventInfo.message.text;
                        console.log("ChatMessage | " + messageUsername + " | " + messageBody);
                        if (this.onChatMessage != null)
                        {
                            this.onChatMessage(messageUsername, messageBody);
                        }
                        break;
                    case "channel.subscribe":
                        let subscribedName = eventInfo.user_name;
                        let isGift = eventInfo.is_gift;
                        let subTier = eventInfo.tier;
                        if (this.onSubscribe != null)
                        {
                            this.onSubscribe(subscribedName, subTier, isGift);
                        }
                        break;

                    case "channel.cheer":
                        let cheerUser = eventInfo.user_name;
                        let cheerAnon = eventInfo.is_anonymous;
                        let cheerBitsAmount = eventInfo.bits;
                        let cheerMessage = eventInfo.message;
                        if (this.onCheer != null)
                        {
                            this.onCheer(cheerUser, cheerAnon, cheerBitsAmount, cheerMessage);
                        }
                        break;
                    case "channel.follow":
                        let followerName = eventInfo.user_name;
                        if (this.onFollow != null)
                        {
                            this.onFollow(followerName);
                        }
                        break;
                    case "channel.subscription.gift":
                        let gifterName = eventInfo.user_name;
                        let giftCount = eventInfo.total;
                        let giftTier = eventInfo.tier;
                        let isAnonymous = eventInfo.is_anonymous;
                        let totalGifts = eventInfo.cumulative_total;
                        if (this.onSubscribe != null)
                        {
                            this.onSubGift(gifterName, giftTier, giftCount, isAnonymous, totalGifts);
                        }
                        break;
                    case "channel.channel_points_custom_reward_redemption.add":
                        let redeemerName = eventInfo.user_name;
                        let rewardID = eventInfo.reward.id;
                        let rewardTitle = eventInfo.reward.title;
                        let rewardCost = eventInfo.reward.cost;
                        let rewardPrompt = eventInfo.reward.prompt;
                        let rewardUserInput = eventInfo.user_input;
                        if (this.onCustomRewardRedeem != null)
                        {
                            this.onCustomRewardRedeem(redeemerName, rewardID, rewardTitle, rewardCost, rewardPrompt, rewardUserInput);
                        }
                        break;
                    default:
                        console.log("Unknown notification type: " + notifyType);
                }
                break;
            default:
                console.log("Unknown message type: " + messageType);
        }
    }

    // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/
    subscribeToTopics()
    {
        this.subscribe("channel.chat.message", "1"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatmessage
        this.subscribe("channel.subscribe", "1"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscribe
        this.subscribe("channel.follow", "2"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelfollow
        this.subscribe("channel.subscription.gift", "1"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelsubscriptiongift
        this.subscribe("channel.cheer", "1"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelcheer
        this.subscribe("channel.channel_points_custom_reward_redemption.add", "1"); // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchannel_points_custom_reward_redemptionadd
    }

    onOpen(aEvent)
    {
        console.log("Websocket onopen =====");
        if (twitchConfig.debug)
        {
            console.log(aEvent);
        }
    }

    onClose(aEvent)
    {
        console.log("Websocket onclose =====");
        if (twitchConfig.debug)
        {
            console.log(aEvent);
        }
    }

    onError(aEvent)
    {
        console.log("Websocket onerror =====");
        if (twitchConfig.debug)
        {
            console.log(aEvent);
        }
    }

    subscribe(aTopic, aVersion)
    {
        let requestbody = {
            type: aTopic,
            version: aVersion,
            condition: {
                broadcaster_user_id: twitchConfig.broadcasterID,
                moderator_user_id: twitchConfig.broadcasterID,
                user_id: twitchConfig.broadcasterID
            },
            transport: {
                method: "websocket",
                session_id: this.sessionID,
            }
        }

        helix.request("eventsub/subscriptions", null, requestbody);
    }

    initialize()
    {
        this.connection = new WebSocket(
            "wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds="+twitchConfig.keepaliveTimeoutSeconds
        );

        this.connection.onopen = this.onOpen.bind(this);
        this.connection.onclose = this.onClose.bind(this);
        this.connection.onmessage = this.onMessage.bind(this);
        this.connection.onerror = this.onError.bind(this);
    }
}