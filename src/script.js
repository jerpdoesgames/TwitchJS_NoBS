function onChatMessage(aMessageUsername, aMessageBody)
{
    console.log("Chat Message | " + aMessageUsername + " | " + aMessageBody);
}

function onSubscribe(aSubscribedName, aSubTier, aIsGift)
{
    console.log(aSubscribedName + " has subscribed!");
}

function onSubGift(aGifterName, aGiftTier, aGiftCount, aIsAnonymous, aTotalGifts)
{
    console.log(aGifterName + " has gifted " + aTotalGifts + " subs to the channel!");
}

function onCheer(aCheerUser, aCheerAnon, aCheerBitsAmount, aCheerMessage)
{
    console.log(aCheerUser + " has cheered for " + aCheerBitsAmount + " bits!");
}

function onFollow(aFollowerName)
{
    console.log(aFollowerName + " has followed!");
}

function onCustomRewardRedeem(aRedeemerName, aRewardID, aRewardTitle, aRewardCost, aRewardPrompt, aRewardUserInput)
{
    console.log(aRedeemerName + " has redeemed a custom reward with ID:  " + aRewardID);
}

const helix = new twitchAPI();
const eventSub = new twitchEventSub();

eventSub.onChatMessage = onChatMessage;
eventSub.onSubscribe = onSubscribe;
eventSub.onCheer = onCheer;
eventSub.onFollow = onFollow;
eventSub.onSubGift = onSubGift;
eventSub.onCustomRewardRedeem = onCustomRewardRedeem;

eventSub.initialize();