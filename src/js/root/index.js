
(function(){
  var shell = new Object();
  let terc = "";
  window.onload = function(){
    shell = document.querySelector(".shell-content");
    request("/terminal.txt", function(content){
      terc = content;
      shell.innerHTML = content.substr(0, content.length-1);

      shell.sh = new bash();

      shell.apply = apply;
      shell.del = del;
      shell.exec = exec;
      shell.reset = reset;
      
      shell.status = "waiting";
      shell.input = "";
      shell.length = 0;
    });
  }

  window.onkeydown = function(event){
    if(shell.status!=undefined)
    //console.log(shell.input, shell.length);
    if(shell.status==="waiting"){
      shell.reset();
      shell.apply('\n<span class="user-shell">root@linux:~ </span>$ ');
      return shell.status = true;
    }
    if(event.key.length>1)
      switch(event.key){
        case "Enter":
          shell.apply("\n");
          shell.exec();
          if(shell.status==="waiting")
            return;
          shell.apply('<span class="user-shell">root@linux:~ </span>$ ');
          document.querySelector(".shell-bg").scrollTop = document.querySelector(".shell-bg").scrollHeight;
        break;
        case "Backspace":
          shell.del();
        break;
      }
    else{
      shell.input+=event.key;
      shell.length++;
      shell.apply(event.key);
    }
  }

  function apply(val){
    shell.innerHTML+=(val);
  }
  function del(){
    if(shell.length<1)
      return;
    shell.length--;
    shell.input = shell.input.substr(0, shell.length);
    shell.innerHTML = shell.innerHTML.substr(0, shell.innerHTML.length-1);
  }
  function reset(){
    shell.length = 0;
    shell.input = "";
  }
  function exec(){
    let args = shell.input.split(" ");
    let run = shell.sh.runenv(args);
    if(shell.sh[args[0]]!=undefined){
      shell.apply(shell.sh[args[0]](args, shell));
    }else if(run!=false){
      shell.apply(shell.sh[run.command[0]](run.command.slice(), shell));
      return this.reset();
    }else if(args[0]!=""){
      shell.apply(`Command <b>${htmlencode(args[0])}</b> not found - Enter <b>help</b> to find out more command\n`);
    }
    this.reset();
  }

  function bash(){
    this.env = [
      {shell:"cls", command:["clear"]},
      {shell:"uname", command:["echo", "Linux 1.0.0 #64-ZoneTwelve OS"]}
    ];
  }
  bash.prototype.runenv = function(args){
    //let state = false;
    for(let env of this.env){
      if(env.shell==args[0]&&typeof this[env.command[0]]==="function"){
        //this[env.command[0]](env.command.slice());
        return env;
      }
    }
    return false;
  }
  bash.prototype.echo = function(args){
    args.shift();
    return htmlencode(args.join(" ")+"\n");
  }
  function htmlencode(input){
    var str = input.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    });
    return str;
  }
  bash.prototype.clear = function(args, shell){
    shell.innerHTML = "";
    return "";
  }
  bash.prototype.rm = function(args){
    console.log(args);
    if(args.join(" ")=="rm -rf /"){
      for(var i=0,list=document.body.querySelectorAll("*");i<list.length;i++)
        list[i].remove();
      document.body.style.background = "#1A1A1A";
      document.body.style.color = "#f01f01";
      document.body.innerHTML = "<h1 class='shell-blink'>System been delete!!</h1>";
    }
  }
  bash.prototype.help = function(){
    return `Welcome to ZoneTwelve OS
This is a simulator of termianl
from <a href="https://zonetwelve.io">ZoneTwelve.io</a>, start development at 19/08/20
<b>Support command:</b>
<ul style="white-space:normal;">
<li>clear - Clean the screen</li>
<li>echo - Write arguments to the standard output.</li>
<li>help - Display information about builtin commands.</li>
<li>pause - Pause the execution of a batch file</li>
</ul>
Source Code: <a href="https://github.com/ZoneTwelve/ZOneTwelve.github.io">ZoneTwelve-GitHub</a>
`;
  }
  bash.prototype.pause = function(args, shell){
    shell.status = "waiting";
    //debugger;
    return "Press any key to continue ...";
  }

  function request(target, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        callback(xhttp.responseText);
      }
    };
    xhttp.open("GET", location.origin+target, true);
    xhttp.send();
  }
  
  //var _0x9749=["\x70\x75\x73\x68","\x66\x69\x6C\x74\x65\x72","\x63\x61\x6C\x6C","\x66\x6F\x72\x45\x61\x63\x68","\x73\x74\x6F\x70","\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72"];var check=(function(){var _0xc624x2=[],_0xc624x3=2,_0xc624x4=false;setInterval(_0xc624x7,2);return {addListener:function(_0xc624x5){_0xc624x2[_0x9749[0]](_0xc624x5)},cancleListenr:function(_0xc624x5){_0xc624x2=_0xc624x2[_0x9749[1]](function(_0xc624x6){return _0xc624x6!==_0xc624x5})}};function _0xc624x7(){var _0xc624x8=new Date();debugger;if(new Date()- _0xc624x8> _0xc624x3){if(!_0xc624x4){_0xc624x2[_0x9749[3]](function(_0xc624x5){_0xc624x5[_0x9749[2]](null)})};_0xc624x4=true;window[_0x9749[4]]()}else{_0xc624x4=false}}})();check[_0x9749[5]](function(){})
})();
