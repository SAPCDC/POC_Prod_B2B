
function load() {
    //Moesif CORS
    
    $("#header").load("Header.html");
    $("#footer").load("Footer.html");
    
}


function SignInScreen(flag) {
    
    load();
    
    customLangParams = {

        this_field_is_required: 'Please enter %fieldname'
    };
    if (flag == 'b2c') {
        gigya.accounts.showScreenSet({
            screenSet: 'Online_Medical-RegistrationLogin',
            startScreen: 'gigya-login-screen',
            customLang: customLangParams,
            containerID: 'divsignin'
        });
    }

    if (flag == 'b2b') {
        gigya.accounts.showScreenSet({
            screenSet: 'Online_Medical-RegistrationLogin',
            startScreen: 'gigya-login-screen',
            customLang: customLangParams,
            containerID: 'divsignin'
        });
    }
    
    gigya.accounts.addEventHandlers({
        onLogin: onLogin

    });
}

function onLogin(response) {
    console.log("OnLogin:" + JSON.stringify(response));

    let UID = response.UID;
    var key = "UID";
    let DBName = "Users";
    let Table = "Users_Info";
    ProcessDB(DBName, Table, response, key);
    //Getdata('index.html');
    gigya.accounts.showScreenSet({
        screenSet: 'Online_Medical-RegistrationLogin',
        startScreen: 'gigya-tfa-verification-screen',
        customLang: customLangParams,
        onAfterSubmit: onTLogin,
        containerID: 'divsignin'
    });
    gigya.accounts.addEventHandlers({
        onLogin: onTLogin

    });
    
    function onTLogin(response) {
        console.log("OnTLogin:" + JSON.stringify(response));
        let errorCode = response.errorCode;
        getUID(DBName, Table, UID).then(function (SUID) {
            const Data = SUID.split(",");
            localStorage.setItem("SUID", Data[0]);
            localStorage.setItem("SName", "Roche");
            localStorage.setItem("SProvider", Data[2]);
            var session_UID = localStorage.getItem("SUID");
            var session_Name = localStorage.getItem("SName");
            if ((session_UID == null || typeof session_UID == "undefined") && errorCode == 0) {


                window.location = 'Loginb2c.html';

            }
            else {
                //console.log(session_UID);
                window.location = 'index.html';
            }
        });
    }

    
}

function Getdata(page,UID) {
    //alert('heree');
    //let UID = response.UID;
    let DBName = "Users";
    let Table = "Users_Info";
    getUID(DBName, Table, UID).then(function (SUID) {
        const Data = SUID.split(",");
        localStorage.setItem("SUID", Data[0]);
        localStorage.setItem("SName", Data[1]);
        var session_UID = localStorage.getItem("SUID");
        var session_Name = localStorage.getItem("SName");
        if (session_UID == null || typeof session_UID == "undefined") {

            
                window.location = 'Loginb2c.html';
           
        }
        else {
            //console.log(session_UID);
            window.location = page;
        }
    });
}
function Store(flag)
{
    localStorage.setItem("flag", flag);

}
function SignUpScreen(flag) {
    load();
    //let flag = localStorage.getItem("flag");
    console.log(flag);
    //window.location = "Register.html";
    customLangParams = {

        this_field_is_required: 'Please enter %fieldname'
    };
    if (flag == 'b2c') {
        //document.getElementById("divsignup").style.display = "none";
        gigya.accounts.showScreenSet({
            screenSet: 'Online_Medical-RegistrationLogin',
            startScreen: 'gigya-register-screen',
            customLang: customLangParams,
            containerID: 'divsignup'
        });
    }

    if (flag == 'b2b') {
        //document.getElementById("divsignup").style.display = "none";
        gigya.accounts.showScreenSet({
            screenSet: 'Online_Medical-RegistrationLogin',
            startScreen: 'gigya-org-register-screen',
            customLang: customLangParams,
            containerID: 'divsignup'
        });

    }
}
function ShowEditScreen() {

    
    gigya.accounts.showScreenSet({
        screenSet: 'Online_Medical-ProfileUpdate',
        startScreen: 'gigya-update-profile-screen',
        containerID: 'profile',
        onAfterSubmit: Update

    });

}

async function Update(response) {
    //console.log("OnUpdate:" + JSON.stringify(response));
    var params = {
        "UID": localStorage.getItem("SUID"),
        "include": "identities-active,identities-all,identities-global,loginIDs,emails,profile,data, password,lastLoginLocation, regSource,irank,rba,subscriptions,userInfo",
        "extraProfileFields": "languages,address,phones, education, honors, publications, patents, certifications, professionalHeadline, bio, industry, specialties, work, skills, religion, politicalView, interestedIn, relationshipStatus, hometown, favorites, followersCount, followingCount, username, locale, verified, timezone, likes, samlData"
    }
    
    gigya.accounts.getAccountInfo({callback: getAccountInfoResponse });

}

function delay(n) {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}



function getAccountInfoResponse(response) {
    if (response.errorCode == 0) {
        var firstName = response.profile.firstName;
        var lastName = response.profile.lastName;
        var UserType = response.data.UserType;
        var UID = localStorage.getItem("SUID");
        let DBName = "Users";
        let Table = "Users_Info";
        //var Data = response;
        //alert(firstName);
        var Data = JSON.parse(JSON.stringify(response));
        
        UpdateData(DBName, Table, Data, UID);
        var elem = document.getElementById('ni');
        if (typeof elem !== 'undefined' && elem !== null) {
            document.getElementById('ni').onclick = function () {
                Getdata('MyProfile.html', UID);
            };
        }
        
        //cancel();
        
        passwordreset();

        //Getdata('MyProfile.html',UID);
        //Delete(DBName, Table, UID).then(function (SUID) {
            //Delete(DBName, Table, UID);
            
        //});
        //ProcessDB(DBName, Table, Data, UID);
        //alert('Profle Updated');
        //Getdata('MyProfile.html');
        
       
    }
    else {
        alert('Error :' + response.errorMessage);
    }
}


function SignOut() {
    
    function printResponse(response) {
        if (response.errorCode == 0) {

            localStorage.clear()
            alert('Logged out');
            window.location.href = 'Home.html';


        }
        else {
            alert('Error :' + response.errorMessage);
        }
    }
    gigya.accounts.logout({ callback: printResponse });

}

function ForgotPass() {

    load();
    customLangParams = {

        this_field_is_required: 'Please enter %fieldname'
    };

    gigya.accounts.showScreenSet({
        screenSet: 'Online_Medical-RegistrationLogin',
        startScreen: 'gigya-reset-password-screen',
        customLang: customLangParams,
        containerID: 'divsignin'
    });
    
}

function passwordreset() {
    
    var elem = document.getElementById('passchangesuccess');
    if (typeof elem !== 'undefined' && elem !== null) {
        document.getElementById('passchangesuccess').onclick = function () {
            SignOut();
        };
    }
}

function cancel() {

    var elem = document.getElementById('Cancel');
    if (typeof elem !== 'undefined' && elem !== null) {
        alert('clicked');
        document.getElementById('Cancel').onclick = function () {
            window.location = 'MyProfile.html';
        };
    }
}


function ChangePassScreen() {
    load();
    customLangParams = {

        this_field_is_required: 'Please enter %fieldname'
    };

    gigya.accounts.showScreenSet({
        screenSet: 'Online_Medical-ProfileUpdate',
        startScreen: 'gigya-change-password-screen',
        customLang: customLangParams,
        containerID: 'divsignup',
        onAfterSubmit: passwordreset
    });
}


function CheckLogin() {
    //let flag;
    var session_UID = localStorage.getItem("SUID");
    var session_Name = localStorage.getItem("SName");
    if (session_UID == null || typeof session_UID == "undefined") {
        //flag = 0;
        alert('Please Login to Proceed');
        window.location  = 'Loginb2c.html';

    }
    else {
        //console.log(session_UID);
        //window.location.href = page;
        //flag = 1;
    }

    return session_UID;
}

function NewUserStore(response) {

    let UID = response.UID;
    let DBName = "Users";
    let Table = "Users_Info";
    ProcessDB(DBName, Table, response, UID);
}