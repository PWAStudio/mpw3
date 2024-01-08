/*! by Tom Thorogood <me@tomthorogood.co.uk> */
/*! This work is licensed under the Creative Commons Attribution 4.0
International License. To view a copy of this license, visit
http://creativecommons.org/licenses/by/4.0/ or see LICENSE. */

var mpw, fullname, masterpassword, version, sitename, counter, context, template, type, resulttype, password, error, id = 0;

function updateMPW() {
    error.textContent = password.value = "";

    if (!fullname.value ||
        !masterpassword.value ||
        !fullname.validity.valid ||
        !masterpassword.validity.valid ||
        !version.validity.valid) {
        return mpw = null;
    }

    mpw = new MPW(fullname.value, masterpassword.value, version.valueAsNumber);
    EnableFields();
    updatePassword();
}

function updatePassword() {
    error.textContent = password.value = "";

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

window.addEventListener("load", function () {
    fullname = document.querySelector("[name=fullname]");
    masterpassword = document.querySelector("[name=masterpassword]");
    version = document.querySelector("[name=version]");
    calculatekey = document.querySelector("[name=calculatekey]");
    sitename = document.querySelector("[name=site]");
    counter = document.querySelector("[name=counter]");
    context = document.querySelector("[name=context]");
    template = document.querySelector("[name=template]");
    type = document.querySelector("[name=type]");
    resulttype = document.querySelector(".resulttype");
    password = document.querySelector(".password");
    error = document.querySelector(".error");

    fullname.disabled = masterpassword.disabled = version.disabled = calculatekey.disabled = sitename.disabled = counter.disabled = context.disabled = template.disabled = type.disabled = password.disabled = false;

    updateMPW();
    calculatekey.addEventListener("click", updateMPW, false);

    sitename.addEventListener("input", updatePassword, false);
    counter.addEventListener("input", updatePassword, false);
    context.addEventListener("input", updatePassword, false);
    template.addEventListener("change", updatePassword, false);
    type.addEventListener("change", updatePassword, false);

    updateType();
    type.addEventListener("change", updateType, false);
}, false);
