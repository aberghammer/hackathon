//create a connection with the chrome extension
//open popup of the chrome extesnsion
//send a message to background.js

window.onload = () => {
    console.log("we loaded facebook in...");
    //get the current url of the page
    let url = window.location.href;

    if (url === "https://www.facebook.com/adpreferences/ad_topics") {
        console.log("we are on the ad preferences page");

        //from here we can run the script to collect all the ad preferences from the page

        //correct one we wanted. 
        //first we need to click a button to load all the ad preferences
        //then we can run the script to collect all the ad preferences from the page
        const containerClass = "x1i10hfl x1qjc9v5 xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r xeuugli xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x87ps6o x1lku1pv x1a2a7pz x168nmei x13lgxp2 x5pf9jr xo71vjh x78zum5 xdt5ytf x1mq37bv x19cbwz6 x79zeqe xgugjxj x2oemzd";
        let basicElements = document.getElementsByClassName(containerClass);

        console.log(basicElements.length);
        for (let i = 0; i < basicElements.length; i++) {
            console.log(basicElements[i].textContent);

            if (basicElements[i].textContent === "Meer weergeven") {
                basicElements[i].addEventListener("click", function () {
                    //we call function later because we assume it takes quite some time to load..
                    console.log("clicked on the meer weergeven.. ")
                    setTimeout(function () {
                        console.log("after 10 seconds we will print all the ad preferences");
                        let classes = document.getElementsByClassName(containerClass);

                        for (let i = 0; i < classes.length; i++) {
                            console.log(classes[i].textContent);
                            chrome.runtime.sendMessage({ id:i, value:classes[i].textContent }, function(response) {
                                console.log(response.farewell);
                            });
                        }
                    }, 10000);



                });

            }
        };
    }


}
