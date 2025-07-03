class twitchAPI
{
    basePath = "https://api.twitch.tv/helix/";

    request(aEndpoint, aCallback, aBody, aMethod)
    {
        aMethod = aMethod ? aMethod : "POST";
        let newRequest = new XMLHttpRequest();
        newRequest.open(aMethod, "https://api.twitch.tv/helix/" + aEndpoint, true);
        newRequest.setRequestHeader('Authorization', 'Bearer ' + twitchConfig.oauthToken);
        newRequest.setRequestHeader('Client-Id', twitchConfig.clientID);
        newRequest.setRequestHeader('Content-Type', "application/json");

        newRequest.onreadystatechange = function()
        {
            if (newRequest.readyState == 4)
            {
                let responseData = JSON.parse(newRequest.responseText);
                if (twitchConfig.debug)
                {
                    console.log("httprequest onreadystatechange (" + newRequest.status + ") =========");
                    console.log(responseData);
                }

                if (aCallback)
                {
                    aCallback(responseData);
                }
            }
        };

        if (aBody)
        {
            newRequest.send(JSON.stringify(aBody));
        }
        else
        {
            newRequest.send();
        }
    }
}
