const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

function init() {
  const channel = new Date().getTime()
  const flow_url = params.flow_url || "https://hooks.mediaflows.cloudinary.com/v1/R2rIMz48lucNTVUA7wsQ";
  initPubnub(channel,flow_url)
}

function initPubnub(channel, flow_url) {
  console.log(channel,flow_url)
  // Update this block with your publish/subscribe keys
  pubnub = new PubNub({
    subscribeKey: "sub-c-71bd4496-d80d-11eb-9c5c-16be9712fca8",
    uuid: "myUniqueUUID"
  })

  pubnub.addListener({
    status: function (statusEvent) {
      if (statusEvent.category === "PNConnectedCategory") {
        console.log("Connected.")
        postAssetsToMediaFlows(flow_url,channel) 
      }
    },
    message: function (msg) {
      console.log(msg.message);
            if (msg.message.id === "mf_aO03ZXFrwVln0WaiKFZK") {
                  console.log("r")
                    const payload = msg.message.output;
                    var gallery = document.getElementById("g");
              
                    var img = document.getElementById(payload.public_id);
                     
                    if (img) {
                      if (payload.eager) {
                        img.src = payload.eager[0].secure_url
                        document.getElementById(payload.public_id+"_spinner").style.display = 'none';
                      }
              
                    }
          } else {
              console.log("n")
          }
  }
  })
  console.log("Subscribing...");

  pubnub.subscribe({
    channels: [channel]
  });
};

function postAssetsToMediaFlows(flow_url,channel) {
           window.cloudinary.customAction.getConfig().then(data => {
              const { assets, cloudName } = data;
              console.log(assets,cloudName)
             for (asset of assets) {
                  console.log(asset)

                 var gallery = document.getElementById("g");
                 var newNode = document.createElement('div');
                newNode.className ="frame"
        
                var newImage = document.createElement('img');
                 newImage.className = "main-img"
                 newImage.src = asset.secure_url
                 newImage.id = asset.public_id
                 
                var splinnerImage = document.createElement('img');
                splinnerImage.id = asset.public_id+"_spinner"
                splinnerImage.className = "child-img"
                splinnerImage.src = "https://res.cloudinary.com/damitai/image/upload/spinner.gif"
        
                 newNode.appendChild(newImage)
                 newNode.appendChild(splinnerImage)
                 gallery.prepend(newNode);










               
                  post(flow_url,channel,asset)
            }
            
          });
}

function post(flow_url,channel,paylod) {
        fetch(`${flow_url}?mf_publish_channel=${channel}`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paylod)
      })
      .then(response => response.json())
      .then(data => {
        //console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}
