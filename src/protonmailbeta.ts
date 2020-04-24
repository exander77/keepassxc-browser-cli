import {Inject} from "./inject";

// @ts-ignore
function login(credentials) {
    console.log('Filling login data...');
    // @ts-ignore
    var login = document.querySelector("#login");
    // @ts-ignore
    login.focus();
    // @ts-ignore
    document.execCommand('selectAll');
    // @ts-ignore
    document.execCommand('insertText', false, credentials.login);
    // @ts-ignore
    //login.value = credentials.login;
    // @ts-ignore
    var password = document.querySelector("#password");
    // @ts-ignore
    password.focus();
    // @ts-ignore
    document.execCommand('selectAll');
    // @ts-ignore
    document.execCommand('insertText', false, credentials.password);
    // @ts-ignore
    //password.value = credentials.password;
    // @ts-ignore
    document.querySelector("button.pm-button--primary").click();
}

function logincheck() {
    return document.getElementById("login");
}

window.onload = function(){
    console.log('Window loaded...');
    function wrapped(c: number, t: number) {
      console.log('Next search', c, t);
      setTimeout(() => {
          if (logincheck()) {
            console.log('Running main...');
            Inject(login).catch(err => {
                alert(err);
                window.location.reload();
                //console.error(err);
            });
            //otherwise check every five minutes
            wrapped(0, 300000);
          } else {
            if (c > 0) wrapped(c-1, Math.round(t*1.4));
            //otherwise check every five minutes
            else wrapped(0, 300000);
          }
      }, t);
    }
    wrapped(10, 100);
};
