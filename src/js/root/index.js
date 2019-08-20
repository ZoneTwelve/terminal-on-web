(function(){
  var shell;
  window.onload = function(){
    //console.log("hello world");
    shell = document.querySelector(".shell-content");
    shell.sh = new bash();

    shell.apply = apply;
    shell.del = del;
    shell.exec = exec;
    shell.reset = reset;
    
    shell.status = "waiting";
    shell.input = "";
    shell.length = 0;
  }

  window.onkeydown = function(event){
    //console.log(shell.input, shell.length);
    if(shell.status==="waiting"){
      shell.reset();
      shell.apply('\n<span class="user-shell">bob@linux:~ </span>$ ');
      return shell.status = false;
    }
    if(event.key.length>1)
      switch(event.key){
        case "Enter":
          shell.apply("\n");
          shell.exec();
          shell.apply('<span class="user-shell">bob@linux:~ </span>$ ');
          document.querySelector(".shell-bg").scrollTop = document.querySelector(".shell-bg").scrollHeight;
        break;
        case "Backspace":
          shell.del();
        break;
      }
    else{
      shell.input+=event.key;
      shell.length++;
      switch(event.key){
        case " ":
          return shell.apply("　");
      }
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
    if(shell.sh[args[0]]!=undefined)
      shell.apply(shell.sh[args[0]](args)+"\n");
    else if(args[0]=="clear")
      shell.innerHTML = "";
    else if(args[0]!="")
      shell.apply(`Command <b>${htmlencode(args[0])}</b> not found - Enter <b>help</b> to find out more command\n`);
    this.reset();
  }

  function bash(){
    this.env = [];
  }
  bash.prototype.echo = function(args){
    args.shift();
    return htmlencode(args.join(" "));
  }
  function htmlencode(input){
    var str = input.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    });
    return str;
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
</ul>
Source Code: <a href="https://github.com/ZoneTwelve/ZOneTwelve.github.io">ZoneTwelve-GitHub</a>
`;
  }
  
  //var _0x9749=["\x70\x75\x73\x68","\x66\x69\x6C\x74\x65\x72","\x63\x61\x6C\x6C","\x66\x6F\x72\x45\x61\x63\x68","\x73\x74\x6F\x70","\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72"];var check=(function(){var _0xc624x2=[],_0xc624x3=2,_0xc624x4=false;setInterval(_0xc624x7,2);return {addListener:function(_0xc624x5){_0xc624x2[_0x9749[0]](_0xc624x5)},cancleListenr:function(_0xc624x5){_0xc624x2=_0xc624x2[_0x9749[1]](function(_0xc624x6){return _0xc624x6!==_0xc624x5})}};function _0xc624x7(){var _0xc624x8=new Date();debugger;if(new Date()- _0xc624x8> _0xc624x3){if(!_0xc624x4){_0xc624x2[_0x9749[3]](function(_0xc624x5){_0xc624x5[_0x9749[2]](null)})};_0xc624x4=true;window[_0x9749[4]]()}else{_0xc624x4=false}}})();check[_0x9749[5]](function(){})
})();
