
function initializeAccount() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["encryptedWallet"]).then((result) => {
            if (result.encryptedWallet == undefined) {
                reject({ status: false, message: "no_account" });
            }
            resolve({ status: true, message: result.encryptedWallet })
        });
    });

}
function checkSession() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["session"]).then((result) => {
            if (result.session == undefined) {
                console.log("no session");
                reject({ status: false, message: "no_session" });
            }
            else {

                if (result.session.expirationTime < Date.now()) {
                    reject({ status: false, message: "session_expired" })
                }
                else {
                    resolve({ status: true, message: "session_valid" });
                }
            }
        });
    });

}

function createLoginSession(wallet) {
    console.log(wallet)
    var sessionData = {
        mySession: true,
        wallet: wallet,
        expirationTime: Date.now() + 30 * 60 * 1000 // 30 minutes from now,
    };

    chrome.storage.local.set({ session: sessionData });

    setTimeout(function () {
        chrome.storage.local.remove('session');
    }, 30 * 60 * 1000); // 30 minutes from now
}

function destroySession() {
    chrome.storage.local.remove('session');
}
function destroyWallet() {
    chrome.storage.local.remove('encryptedWallet');
}
module.exports = { initializeAccount, checkSession, createLoginSession, destroySession, destroyWallet };
