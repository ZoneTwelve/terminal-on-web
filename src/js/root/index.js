
(function(){
  var shell = new Object();
  let terc = undefined;
  window.onload = function(){
    document.querySelector(".terminal").setup = setup;
    document.body.close = closeWindow;
    document.querySelector("#terminal").onclick = function(){
      if(this.className.indexOf("app-active")>-1){
        return document.querySelector(".terminal").style.display = document.querySelector(".terminal").style.display=="none"?"block":"none";
      }
      document.querySelector('.terminal').style.display = 'block';
      document.querySelector(".shell-content").innerHTML = "";
      //setTimeout(function(){
      document.querySelector('.terminal').setup();
      //}, 100);
      document.querySelector('#terminal').className+=' app-active';
      //if(document.querySelector(".terminal").style.display=="none")
      //  document.querySelector(".terminal").style.display = "none";
      /*
      if(this.className.indexOf("app-active")==-1)
        document.body.close('terminal');
      if(document.querySelector(".terminal").style.display=="none")
        setTimeout(function(){
          document.querySelector('.terminal').style.display = 'block';
          if(this.className.indexOf("app-active")!=-1){
            document.querySelector('.terminal').setup();
            document.querySelector('#terminal').className+=' app-active';
          }
        }, 100)
      else
        document.querySelector(".terminal").style.display = "none";
      */
    }
    request("/terminal.txt", function(content){
      terc = content;
      setup(terc);
    });
  }
  function setup(content = terc){
    shell = document.querySelector(".shell-content");
    shell.innerHTML = "";

    shell.innerHTML = content.substr(0, content.length-1);

    shell.sh = new bash();

    shell.apply = apply;
    shell.del = del;
    shell.exec = exec;
    shell.reset = reset;
    shell.pwd = "/home/ZoneTwelve";
    shell.passwd = [
      {
        name:"root",
        group:"root"
      },
      {
        name:"ZoneTwelve",
        group:"ZoneTwelve sudo"
      }
    ]
    shell.user = ["ZoneTwelve", "root"];
    shell.filesystem = [{
      name:"",
      type:1,
      access:755,
      owner:"root:root",
      content:[
        
        {
          name:"home",
          type:1,
          access:755,
          owner:"root:root",
          content:[
            
            {
              name:"root",
              type:1,
              access:750,
              owner:"root:root",
              content:[]
            },
            {
              name:"ZoneTwelve",
              type:1,
              access:750,
              owner:"ZoneTwelve:ZoneTwelve",
              content:[
                
                {
                  name:"exploit",
                  type:0,
                  access:110,
                  owner:"ZoneTwelve:ZoneTwelve",
                  content:null,
                }

              ]
            }

          ]
        },{
          name:"tmp",
          type:1,
          access:775,
          owner:"root:root",
          content:[
            
            {
              name:".sess_flag",
              type:0,
              access:664,
              owner:"ZoneTwelve:ZoneTwelve",
              content:"Z0{1t's-my-new-terminal}\n"
            }

          ]
        }

      ]
    }];

    shell.status = "waiting";
    shell.input = "";
    shell.length = 0;
  }

  window.onkeydown = function(event){
    if(shell.status!=undefined)
    //console.log(shell.input, shell.length);
    if(shell.status==="waiting"){
      shell.reset();
      shell.apply("\n"+su(shell.user[shell.user.length-1], shell.pwd));
      return shell.status = true;
    }
    if(event.key.length>1)
      switch(event.key){
        case "Enter":
          shell.apply("\n");
          shell.exec();
          if(shell.status==="waiting")
            return;
          shell.apply(su(shell.user[shell.user.length-1], shell.pwd));
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
  bash.prototype.pwd = function(args, shell){
    return shell.pwd+"\n";
  }
  bash.prototype.whoami = function(args, shell){
    return shell.user[shell.user.length-1]+"\n";
  }
  bash.prototype.exit = function(args, shell){
    if(shell.user.length>1)
      shell.user.pop();
    else
      return closeWindow("terminal");
    return "";
  }
  bash.prototype.cd = function(args, shell){
    let path = args[1];
    if(path==".."){
      path = shell.pwd.split("/");
      path.pop();
      path = path.join("/");
    }
    if(path==".")
      return "";

    if(path==undefined){
      args[1] = `/home/${shell.user[shell.user.length-1]}`;
      console.log(args);
      return this.cd(args, shell)
    }

    if(path[0]!="/")
      path = shell.pwd+"/"+path;

    let fs = shell.filesystem;
    var ps = path.split("/").filter(v=>v!="");
    ps.unshift("");
    for(var i=0;i<ps.length;i++){
      var find = false;
      let p = ps[i];
      for(let folder of fs){
        //console.log(`'${p}'`, "vs", `'${folder.name}'`, find);
        if(folder.type==0)
          return `bash: cd: ${htmlencode(path)}: Not a directory`;
        if(folder.name==p&&!find){
          fs = folder.content;
          find = true;
          console.log("folder found", `'${p}'`, "vs", `'${folder.name}'`, find);
        }
      }
      //console.log(i, fs);
      if(!find)
        return `bash: cd: ${htmlencode(path)}: No such file or directory\n`;
      find = false;
    }
    if(path=="")
      path = "/";
    shell.pwd = path;
    return "";
  }
  bash.prototype.ls = function(args, shell){
    let path = args[2]||args[1]||shell.pwd;
    let argv = args[1];
    if(path=="-al"){
      argv = path
      path = shell.pwd;
    }
    if(path==".")
      path = shell.pwd;
    else if(path==".."){
      path = shell.pwd.replace(/\/\S+/, "");
    }
    console.log(path);
    if(path[0]!="/")
      path = shell.pwd+"/"+path;

    let fs = shell.filesystem;
    var ps = path.split("/").filter(v=>v!="");
    ps.unshift("");
    for(var i=0;i<ps.length;i++){
      var find = false;
      let p = ps[i];
      for(let folder of fs){

        if(folder.name==p&&!find){
          fs = folder.content;
          find = true;
          console.log("folder found", `'${p}'`, "vs", `'${folder.name}'`, find);
        }
      }
      if(!find)
        return `ls: cannot access ${htmlencode(path)}: No such file or directory\n`;
      find = false;
    }
    if(fs==null)
      return `ls: cannot access ${htmlencode(path)}: No such file or directory\n`;
    if(typeof fs==="string")
      return fs;
    if(argv!=undefined){
      return fs.map(v=>this.filestruct(v)).join("\n")+"\n";
    }
    return fs.map(v=>v.name).join(" ")+"\n";
  }
  bash.prototype.filestruct = function(file){
    console.log(file);
    let access = "rwx";
    let othera = ("00"+(    file.access      %10).toString(2)).substr(-3).split("").map((v,i)=>v==1?access[i]:"-").join("");
    let groupa = ("00"+((~~(file.access/10)) %10).toString(2)).substr(-3).split("").map((v,i)=>v==1?access[i]:"-").join("");
    let ownera = ("00"+((~~(file.access/100))%10).toString(2)).substr(-3).split("").map((v,i)=>v==1?access[i]:"-").join("");

    //let othera = (file.access%10).toString(2).split("").map((v, i)=>v==1?access[i]:"-").join("");
    //let groupa = ((~~(file.acces/10))%10).toString(2).split("").map((v, i)=>v==1?access[i]:"-").join("");
    //let ownera = ("00"+((~~(file.access/100))%10).toString(2)).substr(-3).split("").map((v, i)=>v==1?access[i]:"-").join("");
    return `${file.type==1?"d":"-"}${ownera}${groupa}${othera} ${file.owner.replace(/:/, " ")} ${file.name}`;
  }
  /*
  bash.prototype.cd = function(args, shell){
    let path = args[1];
    let fs = shell.filesystem;
    console.log(fs);
    if(path=="/"){
      shell.pwd = "/";
      return "";
    }
    for(var i=0,ps=path.split("/");i<ps.length;i++){
      let p = ps[i];
      console.log(p, ps);
      let inside = false;
      for(let folder of fs){
        let inside = false;
        console.log("vs", folder.name, p);
        if(folder.name==p){
          find = true;
          console.log(i, fs, p, folder);
          fs = folder.content;

        }
        console.log("owo", fs);
        if(!find)
          return `1 bash: cd: ${htmlencode(path)}: No such file or directory`
      }
      shell.pwd = path;
      return "";
    }
  }*/

  bash.prototype.help = function(){
    return `Welcome to ZoneTwelve OS
This is a simulator of termianl
from <a href="https://zonetwelve.io">ZoneTwelve.io</a>, start development at 19/08/20
<b>Support command:</b>
<ul style="white-space:normal;">
<li>clear - Clean the screen</li>
<li>echo - Write arguments to the standard output.</li>
<li>help - Display information about builtin commands.</li>
<li>exit - Exit the shell.</li>
<li>pause - Pause the execution of a batch file</li>
<li>uname - print system information</li>
<li>cd - Change the directory.</li>
<li>ls - list directory contents or print file content</li>
<li>pwd - Print the name of the current working directory.</li>
</ul>Source Code: <a href="https://github.com/ZoneTwelve/ZOneTwelve.github.io">ZoneTwelve-GitHub</a>
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
      if(this.readyState ==4 && this.status == 200){
        callback(xhttp.responseText);
      }
    };
    xhttp.open("GET", location.origin+target, true);
    xhttp.send();
  }
  
  function su(name, pwd){
    return `<span class="user-shell">${name}@linux:${pwd.split("/").pop()==name?"~":pwd} </span>$ `;
  }
  function closeWindow(target){
    document.querySelector("."+target).style.display = "none";
    document.querySelector("#"+target).classList.remove("app-active");
  }

  //var _0x9749=["\x70\x75\x73\x68","\x66\x69\x6C\x74\x65\x72","\x63\x61\x6C\x6C","\x66\x6F\x72\x45\x61\x63\x68","\x73\x74\x6F\x70","\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72"];var check=(function(){var _0xc624x2=[],_0xc624x3=2,_0xc624x4=false;setInterval(_0xc624x7,2);return {addListener:function(_0xc624x5){_0xc624x2[_0x9749[0]](_0xc624x5)},cancleListenr:function(_0xc624x5){_0xc624x2=_0xc624x2[_0x9749[1]](function(_0xc624x6){return _0xc624x6!==_0xc624x5})}};function _0xc624x7(){var _0xc624x8=new Date();debugger;if(new Date()- _0xc624x8> _0xc624x3){if(!_0xc624x4){_0xc624x2[_0x9749[3]](function(_0xc624x5){_0xc624x5[_0x9749[2]](null)})};_0xc624x4=true;window[_0x9749[4]]()}else{_0xc624x4=false}}})();check[_0x9749[5]](function(){})
})();
