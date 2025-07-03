class twitchAPI
{
    basePath = "https://api.twitch.tv/helix/";
    requestMethod = "POST";

    request(aEndpoint, aCallback, aBody)
    {
        let newRequest = new XMLHttpRequest();
        newRequest.open(this.requestMethod, "https://api.twitch.tv/helix/" + aEndpoint, true);
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

        newRequest.send(JSON.stringify(aBody));
    }
}