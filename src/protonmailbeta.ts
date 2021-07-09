import {Inject} from "./inject";

// @ts-ignore
function login(credentials) {
    console.log('Filling login data...');
    // @ts-ignore
    var login = document.querySelector("#username");
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
    document.querySelector("button.button-henlo").click();
}

function logincheck() {
    return document.getElementById("username");
}

// @ts-ignore
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

window.onload = function(){
    //var done = false;
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
            if (document.getElementById('global_search')) {
              if (window.location.hash != '#reloaded') //setTimeout(() => {
              {
                  console.log('Reloading...');
                  window.location.hash = '#reloaded';
                  window.location.reload();
              }
              //}, 500); 
              return;
            }
            if (c > 0) wrapped(c-1, Math.round(t*1.4));
            //otherwise check every five minutes
            else wrapped(0, 300000);
          }
      }, t);
      // @ts-ignore
      //if (!done) done = (function() {var d = document.createElement('div'); d.innerHTML = '<li class="navigation__item"><a class="navigation__link" title="Inbox" href="/u/0/all-mail?filter=unread"><span class="flex flex-nowrap w100 flex-items-center"><svg viewBox="0 0 16 16" class="icon-16p navigation__icon flex-item-noshrink mr0-5 flex-item-centered-vert" role="img" focusable="false"><use xlink:href="#shape-unread"></use></svg><span class="flex-item-fluid ellipsis mw100">Unread</span><span class="flex flex-items-center"></span></span></a></li>'; var r = document.querySelector('.navigation__item:nth-child(1)'); if (r) { insertAfter(d.firstChild, r); return true; }; return false;})();
    }
    wrapped(10, 100);
};
