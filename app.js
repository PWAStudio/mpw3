if ("serviceWorker" in navigator) {
    //window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("mfc.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    //})
}

//general
function get(f) {
    return document.querySelector(f).value;
}

function set(f, v) {
    document.querySelector(f).value = v;
}


//functions
function login()
{
   
    sessionStorage["mpwver"] = 3;
    sessionStorage["usrname"] = get("#usrname");
    sessionStorage["mstrpswd"] = get("#mstrpswd");


    updateMPW();

    document.location = "page2.html";
}

function copyClipboard()
{
    var copyText = document.getElementById("genPass");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    
    // Alert the copied text
    alert("Copied the text");
}


/* MPW app script*/
var mpw, fullname, masterpassword, version, sitename, counter, context, template, type, resulttype, password, error, id = 0;


function updateMPW() {
    //error.textContent = password.value = "";

    if (!fullname.value ||
        !masterpassword.value ||
        !fullname.validity.valid ||
        !masterpassword.validity.valid ||
        !version.validity.valid) {
        return mpw = null;
    }

    mpw = new MPW(fullname.value, masterpassword.value, version.valueAsNumber);
   //EnableFields();
   try{ 
   updatePassword();
   }
   catch(e){
    error.textContent = e.message;
   }
}

function updatePassword() {

    error.textContent = "";

    if(mpw == undefined)
        mpw = new MPW(sessionStorage["usrname"], sessionStorage["mstrpswd"], sessionStorage["mpwver"]);

    if(password)
        password.value = "";

    if (!mpw || !sitename.value ||
        !sitename.validity.valid ||
        !counter.validity.valid ||
        !context.validity.valid ||
        !template.validity.valid ||
        !type.validity.valid) {
        return;
    }

    var cid = ++id;

    var Type = type.value[0].toUpperCase() + type.value.slice(1).toLowerCase();
    var value = mpw["generate" + Type](sitename.value, counter.valueAsNumber, context.value, template.value);

    value.then(function (pass) {
        if (cid === id) {
            password.value = pass;
        }
    }, function (err) {
        if (cid === id) {
            error.textContent = err.message;
        }

        console.error(err);
    });
}

function updateType() {
    resulttype.textContent = type.selectedOptions[0].textContent;

    switch (type.value) {
        case "identification":
            template.value = "name";
            break;
        case "authentication":
            template.value = "long";
            break;
        case "recovery":
            template.value = "phrase";
            break;
    }

    updatePassword();
}

function EnableFields()
{
    if(fullname.value != null || !masterpassword.value != null)
    {
        sitename.disabled = false;
        counter.disabled = false;
        context.disabled = false;
        template.disabled = false;
        type.disabled = false;
    }
    else{
        alert("Fullnam/Master password missing");
    }


}

function page1Load()
{
    fullname = document.querySelector("#usrname");
    masterpassword = document.querySelector("#mstrpswd");
    version = document.querySelector("#mpwver");
    calculatekey = document.querySelector("#loginButton");
    error = document.querySelector(".error");
    updateMPW();
    calculatekey.addEventListener("click", updateMPW, false);

}


function page2Load()
{
    sitename = document.querySelector("#site");
    counter = document.querySelector("#counter");
    context = document.querySelector("#context");
    template = document.querySelector("#template");
    type = document.querySelector("#type");
    resulttype = document.querySelector(".resulttype");
    password = document.querySelector("#genPass");
    error = document.querySelector(".error");

    sitename.addEventListener("input", updatePassword, false);
    counter.addEventListener("input", updatePassword, false);
    context.addEventListener("input", updatePassword, false);
    template.addEventListener("change", updatePassword, false);
    type.addEventListener("change", updatePassword, false);

    updateType();
    type.addEventListener("change", updateType, false);
}


