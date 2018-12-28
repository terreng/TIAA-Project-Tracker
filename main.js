var inanim = false;
var sactive = false;
var userjson;
var loaduserdata = false;
var taskRef;
var checkRef;

function initFunction() {
  var config = {
    apiKey: "AIzaSyC_hSeVGx_EdM1fId-Yo5bb120WRn0UDL4",
    authDomain: "auth.tiaapt.com",
    databaseURL: "https://tiaaprojecttracker.firebaseio.com",
    projectId: "tiaaprojecttracker",
    storageBucket: "tiaaprojecttracker.appspot.com",
    messagingSenderId: "521465993348"
  };
  firebase.initializeApp(config);
  readyFunction();
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

		  gid("username").disabled = false;
	gid("username").value = "";
	gid("password").value = "";
	
	firebase.database().ref("users/"+firebase.auth().currentUser.uid).on('value', function(snapshot) {
		
	if (loaduserdata == false) {
		loaduserdata = true;
	} else {
		document.body.style.display = "none"
		return location.reload();
	}
	
	userjson = snapshot.val(); 
	
	firebase.database().ref("private/"+firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
	
	privateuserjson = snapshot.val() || {}; 
	
	if (userjson != null) {} else {
	userjson = new Array();
	} 
	
	afterLogin(); 
	document.getElementById("everything_loader").style.display = "none";

	}).catch(function(error) {alert("Login error: Error code: "+error.code)});
	
	})
	
  } else {
document.getElementById("everything_loader").style.display = "none";
    gid("login_normal").style.display = "block";
    gid("controlpanel").style.display = "none";
  gid("login_enter").style.display = "block";
gid("login_load").style.display = "none";

gid("username").disabled = false;
gid("ra_title").innerHTML = "TIAAPT Admin";
gid("ra_title_2").innerHTML = "TIAAPT Admin";
gid("log_text").innerHTML = "Log In";

if (location.hash == "#register") {
signUp();
}
  }
});


}

function loginWithGoogle() {
gid("login_load_normal").style.display = "block";
gid("login_enter_normal").style.display = "none";
gid("create_account_admin").style.display = "none";
	
var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  'hd': 'apps4pps.net'
});
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
if (isios) {
firebase.auth().signInWithPopup(provider);
} else {
firebase.auth().signInWithRedirect(provider);
}
}

function readyFunction() {
document.getElementById("everything").style.display = "block";
}

function adminLogin() {
gid("login").style.display = "block";
gid("login_normal").style.display = "none";
}

function studentLogin() {
gid("login").style.display = "none";
gid("login_normal").style.display = "block";
}


function logOut() {	
firebase.auth().signOut().then(function() {
gid("create_account").style.display = "block";
if (taskRefListenerActive) {
taskRef.off();
checkRef.off();
taskRefListenerActive = false;
}
if (isMobile) {
toggleSidebar();
}
}).catch(function(error) {
  showAlert("Error","Error code: "+error.code)
});
	
}

function signUp() {
secretsignup = true;
gid("ra_title").innerHTML = "TIAAPT Admin";
gid("ra_title_2").innerHTML = "TIAAPT Admin";
gid("login_error").innerHTML = "";
gid("username").disabled = false;
gid("username").value = "";
gid("password").value = "";
gid('username').focus();
gid("log_text").innerHTML = "Register";
gid("create_account").style.display = "none";
}

function logIn() {
	
gid("login_enter").style.display = "none";
gid("login_load").style.display = "block";
gid("login_error").innerHTML = "";
gid('username').blur();
gid('password').blur();
gid("create_account").style.display = "none"
	  firebase.auth().signInWithEmailAndPassword(gid("username").value, gid("password").value).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(error.code)
  console.log(error.message)

  gid("login_error").innerHTML = error.code.replace("auth/invalid-email","Invalid email").replace("auth/wrong-password","Password incorrect").replace("auth/user-not-found","Account not found").replace("auth/user-disabled","Account frozen");
  gid("login_enter").style.display = "block";
gid("login_load").style.display = "none";
if (error.code.indexOf("password") > 1) {
gid('password').focus();
} else {
gid('username').focus();
}
  
  });
	
}

function toggleSidebar() {
if (inanim == false) {
if (sactive == false) {
sactive = true;
inanim = true;
gid("sidebar").style.display = "block"
gid("dk_bk").style.display = "block"
gid("sidebar").classList.add("slideIn");
gid("dk_bk").classList.add("fadeIn");
gid("sidebar").classList.remove("slideOut");
gid("dk_bk").classList.remove("fadeOut");
setTimeout(function() {
inanim = false;
}, 200);
} else {
sactive = false;
inanim = true;
gid("sidebar").classList.add("slideOut");
gid("dk_bk").classList.add("fadeOut");
setTimeout(function() {
gid("sidebar").style.display = "none"
gid("dk_bk").style.display = "none"
inanim = false;
}, 200);
gid("sidebar").classList.remove("slideIn");
gid("dk_bk").classList.remove("fadeIn");
}
}
}

gid = function(id) {return document.getElementById(id)};

function afterLogin() {

openHome();

gid("home_button").style.display = "none";
gid("points_button").style.display = "none";
gid("groups_button").style.display = "none";
gid("queue_button").style.display = "none";
gid("leaderboard_button").style.display = "none";

gid("controlpanel").style.display = "block";
gid("login").style.display = "none";
gid("login_normal").style.display = "none";
var string = String(firebase.auth().currentUser.email);
gid("profile_photo").style.display = "none";
if (firebase.auth().currentUser.emailVerified) {
var string = String(firebase.auth().currentUser.displayName)
gid("prof_name").innerHTML = htmlescape(string);
gid("prof_school").innerHTML = userjson.school;
gid("profile_photo").src = firebase.auth().currentUser.photoURL;
gid("profile_photo_2").src = firebase.auth().currentUser.photoURL;
gid("profile_photo").style.display = "block";
if (userjson && userjson.group) {
gid("home_button").style.display = "block";
if (["#home","#points","#leaderboard","#settings"].indexOf(location.hash) == -1) {
history.replaceState(undefined, undefined, "#home");
}
} else {
if (["#points","#leaderboard","#settings"].indexOf(location.hash) == -1) {
history.replaceState(undefined, undefined, "#settings");
}
}
gid("points_button").style.display = "block";
gid("leaderboard_button").style.display = "block";
} else {
gid("groups_button").style.display = "block";
gid("queue_button").style.display = "block";
gid("leaderboard_button").style.display = "block";
if (["#queue","#groups","#leaderboard","#settings"].indexOf(location.hash) == -1) {
history.replaceState(undefined, undefined, "#queue");
}
}

gid("settings_button").style.display = "block";
gid("welcome_button").style.display = "none";
if (userjson.verified !== true && userjson.admin !== "admin") {
gid("home_button").style.display = "none";
gid("points_button").style.display = "none";
gid("groups_button").style.display = "none";
gid("queue_button").style.display = "none";
gid("settings_button").style.display = "none";
gid("leaderboard_button").style.display = "none";
gid("welcome_button").style.display = "block";
	history.replaceState(undefined, undefined, "#welcome");
	loadSetup();
}

gid("c_username").innerHTML = string;
if (gid(location.hash.split("#")[1]+"_content")) {
switchSection(location.hash.split("#")[1])
} else {
switchSection("home")
}

if (firebase.auth().currentUser.email.indexOf("@apps4pps.net") == -1 && userjson.admin !== "admin" && false) {
	gid("welcome_button").style.display = "none";
	gid("welcome_content").style.display = "none";
	showAlert("Invalid email address","The TIAA Project Tracker is only accessible to apps4pps.net domain users","tryagain",function() {logOut()});
}

}

function openHome() {
	

}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function switchSection(tab) {
if (isMobile && sactive) {
toggleSidebar();
}
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("option");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    gid(tab+"_content").style.display = "block";
	gid(tab+"_button").className += " active";
gid("menu_icon").style.display = "block";
gid("close_icon").style.display = "none";
history.replaceState(undefined, undefined, "#"+tab);
if (tab == "home") {
gid("navtitle").innerHTML = "Projects"
gid("content_title").innerHTML = "Projects"
loadHome();
}
if (tab == "points") {
gid("navtitle").innerHTML = "Points"
gid("content_title").innerHTML = "Points"
loadPoints();
}
if (tab == "leaderboard") {
gid("navtitle").innerHTML = "Leaderboard"
gid("content_title").innerHTML = "Leaderboard"
loadLeaderboard();
}
if (tab == "groups") {
gid("navtitle").innerHTML = "Groups & Users"
gid("content_title").innerHTML = "Groups & Users"
loadGroups();
}
if (tab == "queue") {
gid("navtitle").innerHTML = 'Approval Queue<div style="float: right;" onclick="queueRefresh(2)"><i class="material-icons" id="refresh2" style="font-size: 35px;padding-bottom: 1px;">refresh</i></div>'
gid("content_title").innerHTML = 'Approval Queue<div onclick="queueRefresh(1)" style="float: right;margin-right: 288px;cursor:pointer;"><i id="refresh1" class="material-icons" style="font-size: 35px;padding-bottom: 1px;">refresh</i></div>'
loadQueue();
}
if (tab == "settings") {
gid("navtitle").innerHTML = "Profile & Settings"
gid("content_title").innerHTML = "Profile & Settings"
loadSettings();
}
if (tab == "welcome") {
gid("navtitle").innerHTML = "Account Setup"
gid("content_title").innerHTML = "Account Setup"
loadSetup();
}
gid("content").scrollTop = 0;
}

function formatPhone(phone) {
if (phone) {
  var x = phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? ' - ' + x[3] : '');
} else {
	return undefined;
}
}

function rawPhone(phone) {
	return phone;
}

function loadSettings() {
	
gid("ac_uid").innerHTML = "Account ID: "+firebase.auth().currentUser.uid;
if (firebase.auth().currentUser.emailVerified) {
	gid("account_settings").style.display = "none";
	gid("phone_settings").style.display = "block";
	gid("profile_info").style.display = "block";
	gid("group_settings").style.display = "block";
	gid("phone_box").innerHTML = formatPhone(privateuserjson.phone) || "<i>Unknown</i>";
	gid("group_settings").innerHTML = real_spinner;
	
	if (userjson.group) {
	firebase.database().ref("groups").once('value').then(function(snapshot) {
	
	groups = snapshot.val();
	
	if (groups != null && groups[userjson.group] != null) {
	
	gid("group_settings").innerHTML = '<div class="profile_group_name">Group: '+htmlescape(groups[userjson.group].name)+'</div>'+real_spinner;
	
	for (var i = 0; i < groups[userjson.group].members.length; i++) {
		
	if (groups[userjson.group].members[i] != firebase.auth().currentUser.uid) {
	var c_userid = groups[userjson.group].members[i];
	getUserData(c_userid);
	}
		
	}
	if (groups[userjson.group].members.length == 1) {
		renderUsers();
	}
	
	function getUserData(c_userid) {
	firebase.database().ref("users/"+c_userid).once('value').then(function(snapshot) {
	var thispublicdata = snapshot.val();
	firebase.database().ref("private/"+c_userid).once('value').then(function(snapshot) {
	var thisprivatedata = snapshot.val();
	gotUserInfo(c_userid,thispublicdata,thisprivatedata);
	}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	}
	
	var usersingroup = {};
	
	function gotUserInfo(userid,useridjson,useridjsonp) {
		usersingroup[userid] = [];
		usersingroup[userid]["public"] = useridjson;
		usersingroup[userid]["private"] = useridjsonp;
		if (Object.keys(usersingroup).length == groups[userjson.group].members.length-1) {
			renderUsers();
		}
	}
	
	function renderUsers() {
		
	var pendhtml = '<div class="user"><div><img src="'+firebase.auth().currentUser.photoURL.split("/mo/").join("/s84/")+'"></div><div>'+firebase.auth().currentUser.displayName+'</div><div></div></div>';
	
	if (usersingroup != null) {
	for (var e = 0; e < Object.keys(usersingroup).length; e++) {
		
		var cingroup = usersingroup[Object.keys(usersingroup)[e]];
		
		if (cingroup && cingroup['public'] && cingroup['private']) {
		pendhtml += '<div class="user"><div><img src="'+cingroup['public'].picture.split("/mo/").join("/s84/")+'"></div><div>'+cingroup['public'].name+'</div><div><a href="tel:/'+cingroup['private'].phone+'"><i class="material-icons" style="padding-right: 5px;color: black;">call</i></a><a href="sms:/'+cingroup['private'].phone+'"><i class="material-icons" style="padding-left: 7px;color: black;">chat</i></a></div></div>';
		}
		
	}
	}
	
	gid("group_settings").innerHTML = '<div class="profile_group_name">Group: '+htmlescape(groups[userjson.group].name)+'</div>'+pendhtml;
		
	}
	
	} else {
		gid("group_settings").style.display = "none";
	}
	
	}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	} else {
		gid("group_settings").style.display = "none";
	}
} else {
	gid("account_settings").style.display = "block";
	gid("phone_settings").style.display = "none";
	gid("profile_info").style.display = "none";
	gid("group_settings").style.display = "none";
}

}

function showAlert(title,message,type,yesfunction) {
if (type == "cancel") {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "block";
gid("p_ok").style.display = "none";
} else {
gid("p_ok").style.display = "block";
if (type == "confirm") {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "block";
gid("p_ok").innerHTML = "CONFIRM"
gid("p_ok").classList.add("red")
gid("p_ok_link").onclick = function () {yesfunction()}
} else {
gid("p_ok").classList.remove("red")


if (type == "submit") {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "block";
gid("p_ok").innerHTML = "SUBMIT"
gid("p_ok_link").onclick = function () {yesfunction()}
} else {
if (type == "done") {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "none";
gid("p_ok").innerHTML = "DONE"
gid("p_ok_link").onclick = function () {yesfunction()}
} else {
if (type == "tryagain") {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "block";
gid("p_ok").innerHTML = "TRY AGAIN"
gid("p_ok_link").onclick = function () {yesfunction()}
} else {
gid("p_ok_link").onclick = function () {hideAlert()}
if (type == "hidden") {
gid("panel-bottomA").style.display = "none";
} else {
gid("panel-bottomA").style.display = "block";
gid("p_cancel").style.display = "none";
gid("p_ok").innerHTML = "OK"
}
}
}
}


}
}
gid("panel-title").innerHTML = title;
gid("panel-content").innerHTML = message;
gid("prompt").style.display = "block";
}

function hideAlert() {
gid("prompt").style.display = "none";
}


function createPostProgress(text) {
showAlert("Please wait",text+"...<div style='margin-bottom: 10px'/>","hidden");	
}

function changePassword() {
showAlert("Change Password","<input onkeypress='if(event.keyCode==13) {gid(\"new_password\").focus();}' type='password' class='c_text' id='old_password' placeholder='Current Password'><div class='padding'><input onkeypress='if(event.keyCode==13) {gid(\"new_password2\").focus();}' type='password' class='c_text' id='new_password' placeholder='New Password'><div class='padding'><input onkeypress='if(event.keyCode==13) {confirmChangePassword();}' type='password' class='c_text' id='new_password2' placeholder='Retype New Password'>","submit",function() {confirmChangePassword()});
setTimeout(function() {
gid("old_password").focus();
},1)
}

function reverse_string(s){
    return s.split("").reverse().join("");
}

function confirmChangePassword() {
var oldpass = gid("old_password").value;
var newpass = gid("new_password").value;
if(newpass == gid("new_password2").value && oldpass.length > 0 && newpass.length > 0) {
showAlert("Are you sure you want to change your password?","You are about to change your password to: <div style='padding-bottom:10px'></div>"+newpass,"confirm",function() {doChangePassword(oldpass,newpass)});
} else {
showAlert("Error","Invalid current or new password")
}
}

function doChangePassword(oldpass,newpass) {
createPostProgress("Updating password");
var user = firebase.auth().currentUser;
var cred = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email,oldpass);
user.reauthenticateWithCredential(cred).then(function() {
user.updatePassword(newpass).then(function() {
showAlert("Password Changed","Your password was updated successfully");
}).catch(function(error) {
if (error.code == "auth/weak-password") {
showAlert("Error","The new password you entered is too weak. Your password has not been changed.");
} else {
showAlert("Error","An error occured. Your password has not been changed.</br>Error code: "+error.code);
}
});
}).catch(function(error) {
if (error.code == "auth/wrong-password") {
showAlert("Error","The password you entered is incorrect. Your password has not been changed.");
} else {
showAlert("Error","An error occured. Your password has not been changed.</br>Error code: "+error.code);
}
});
}

function closeAccount() {
showAlert("Delete Account","<input onkeypress='if(event.keyCode==13) {confirmDeleteAccount();}' type='password' class='c_text' id='my_password' placeholder='Confirm Password'>","confirm",function() {confirmDeleteAccount()});
setTimeout(function() {
gid("my_password").focus();
},1)
}

function confirmDeleteAccount() {
var oldpass = gid("my_password").value;
showAlert("Delete Account","Please type the following:</br><div style='padding-bottom:5px'></div>"+String(firebase.auth().currentUser.uid).substring(0,12).split("I").join("P").split("l").join("b")+"<div style='padding-bottom:10px'></div><input onkeypress='if(event.keyCode==13) {confirmDeleteAccount2("+oldpass+");}' type='text' class='c_text' id='del_context_password' placeholder='Confirmation Text'>","confirm",function() {confirmDeleteAccount2(oldpass)});
gid("del_context_password").focus();
}

function confirmDeleteAccount2(oldpass) {
var constring = gid("del_context_password").value;
showAlert("Are you sure you want to delete your account?","Once you do this, there's no going back!","confirm",function() {actuallyDeleteAccount(oldpass,constring)})
}

function actuallyDeleteAccount(oldpass,constring) {
createPostProgress("Deleting account");
if (constring == String(firebase.auth().currentUser.uid).substring(0,12).split("I").join("P").split("l").join("b")) {
var user = firebase.auth().currentUser;
var cred = firebase.auth.EmailAuthProvider.credential(firebase.auth().currentUser.email,oldpass);
user.reauthenticateWithCredential(cred).then(function() {
user.delete().then(function() {
location.reload();
}).catch(function(error) {
showAlert("Error","An error occured. Your account has not been deleted.</br>Error code: "+error.code);
});
}).catch(function(error) {
if (error.code == "auth/wrong-password") {
showAlert("Error","The password you entered is incorrect. Your account has not been deleted.");
} else {
showAlert("Error","An error occured. Your account has not been deleted.</br>Error code: "+error.code);
}
});

} else {
showAlert("Error","The confirmation text you entered was incorrect. Your account has not been deleted.")
}
}

var tasks;
var checks;

function loadHome() {
	
if (!userjson || !userjson.group) {
	return gid('tasks_list').innerHTML = "";
}
	
gid('tasks_list').innerHTML = real_spinner;
edittask = false;
	
firebase.database().ref("groups/"+userjson.group+"/tasks").once('value').then(function(snapshot) {
	
tasks = snapshot.val();

firebase.database().ref("checks/"+firebase.auth().currentUser.uid).once('value').then(function(snapshot) {

checks = snapshot.val();
var pendhtml = "";

if (tasks != null) {
for (var i = Object.keys(tasks).length-1; i > -1; i--) {
	
var ctask = tasks[Object.keys(tasks)[i]];
var taskid = Object.keys(tasks)[i];
var task_class = '';

var banner = '<div class="task_edit"><div>This is a draft</div><div onclick="submitTask(\''+taskid+'\')">Submit</div></div>';
var task_items = '';
task_class = "edit_list";

var task_sort = [];

if (ctask.items != null) {
for (var e = 0; e < Object.keys(ctask.items).length; e++) {
	
citem = ctask.items[Object.keys(ctask.items)[e]];
var itemid = Object.keys(ctask.items)[e];

var m_icon = determineIcon(taskid,itemid);

var text_disabled = ""
if (tasks[taskid].status != null && tasks[taskid].status != "rejected") {
	text_disabled = 'readonly="readonly"'	
}

var c_task_item = '<div class="task_item" onclick="checkItem(\''+taskid+'\',\''+itemid+'\')" id="item_'+itemid+'"><i class="material-icons" id="drag_'+citem.pos+'">'+m_icon+'</i><textarea '+text_disabled+' type="text" placeholder="List item">'+citem.text+'</textarea><i onclick="removeItem(\''+itemid+'\',\''+taskid+'\','+(tasks[taskid].status == "approved")+')" class="material-icons">close</i></div>'
task_sort[e] = [citem.pos,c_task_item];

}
}

function taskSort(a,b) {
	return a[0] - b[0];
}
task_sort = task_sort.sort(taskSort);

for (var r = 0; r < task_sort.length; r++) {
	
	task_items += task_sort[r][1];
	
}

if (tasks[taskid].status == "pending") {
	banner = '<div class="task_edit"><div>Waiting for approval...</div><div onclick="cancelTask(\''+taskid+'\')">Cancel</div></div>';
	task_class = "";
}
if (tasks[taskid].status == "rejected") {
	banner = '<div class="task_edit"><div>Draft was rejected</div><div onclick="submitTask(\''+taskid+'\')">Submit</div></div>'
}
if (tasks[taskid].status == "approved") {
	var point_prog = calcPointsAndProgress(taskid);
	banner = '<div class="task_status"><div>Progress: '+Math.round(point_prog[0]*100)+'%</div><div>'+Math.floor(point_prog[1])+'/'+ctask.points+' <i class="material-icons">stars</i></div><div style="background: linear-gradient(to right, #1088ff, #ad19d2 '+Math.round(point_prog[0]*100)+'%, #d2d2d2 0%);"></div></div><div style="display: none" class="task_edit"><div>You have unsaved changes</div><div onclick="submitChanges(\''+taskid+'\')">Submit</div></div>'
}
if (tasks[taskid].status == "delete") {
	banner = '<div class="task_edit"><div>Pending deletion...</div><div onclick="cancelTaskDelete(\''+taskid+'\')">Cancel</div></div>';
	task_class = "";
}

var task_add = '<div class="task_item add_item" onclick="addItem(\''+taskid+'\')"><i class="material-icons">add</i><div>Add item</div></div>';

if (tasks[taskid].status != null && tasks[taskid].status != "rejected") {
	task_add = '<div style="display: none" class="task_item add_item" onclick="addItem(\''+taskid+'\',undefined,true)"><i class="material-icons">add</i><div>Add item</div></div>';
	task_class = "";
}
	
pendhtml += '<div class="task" id="task_'+taskid+'"><div class="task_top"><div>'+ctask.name+'</div><div><i onclick="taskMenu(\''+taskid+'\')" class="material-icons">more_vert</i></div></div>'+banner+'<div class="task_items '+task_class+'">'+task_items+task_add+'</div></div>'
	
}
}

var none = false;

if (pendhtml.length == 0) {
pendhtml = '<div class="error_gray"><center><i class="material-icons">list_alt</i></center>No tasks were found</div>';
none = true;
}

tasks_list.innerHTML = pendhtml;

if (none != true) {
for (var i = 0; i < tasks_list.children.length; i++) {
	
var cctask = tasks_list.children[i];

for (var e = 0; e < cctask.querySelector(".task_items").children.length; e++) {
	
var ccitem = cctask.querySelector(".task_items").children[e];

if (!ccitem.classList.contains("add_item") && ccitem.querySelector("textarea")) {
	
var textarea = tasks_list.children[i].querySelector(".task_items").children[e].querySelector("textarea");
	
initTextarea(textarea,cctask.id.split("task_")[1],tasks[cctask.id.split("task_")[1]].status == "pending" || tasks[cctask.id.split("task_")[1]].status == "delete",tasks[cctask.id.split("task_")[1]].status == "approved");
	
}	
}	
}
}

if (taskRefListenerActive == false) {
taskRef = firebase.database().ref("groups/"+userjson.group+"/tasks");
taskRef.on('value', function(snapshot) {
  updateTasksAndLists(snapshot.val());
});
checkRef = firebase.database().ref("checks/"+firebase.auth().currentUser.uid);
checkRef.on('value', function(snapshot) {
  updateChecks(snapshot.val());
  if (location.hash == "#points") {
	  loadPoints();
  }
});
taskRefListenerActive = true;
}
if (taskRefListenerActive == "almost") {
checkRef.off();
taskRef = firebase.database().ref("groups/"+userjson.group+"/tasks");
taskRef.on('value', function(snapshot) {
  updateTasksAndLists(snapshot.val());
});
checkRef = firebase.database().ref("checks/"+firebase.auth().currentUser.uid);
checkRef.on('value', function(snapshot) {
  updateChecks(snapshot.val());
  if (location.hash == "#points") {
	  loadPoints();
  }
});
taskRefListenerActive = true;
}

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

var taskRefListenerActive = false;

function initTextarea(textarea,cctaskid,skipall,nonetwork) {
  textarea.style.height = ""; /* Reset the height*/
  textarea.style.height = textarea.scrollHeight + "px";
  
if (skipall !== true) {
	
textarea.oninput = function() {
  textarea.style.height = ""; /* Reset the height*/
  textarea.style.height = textarea.scrollHeight + "px";
  if (nonetwork !== true) {
  firebase.database().ref("groups/"+userjson.group+"/tasks/"+cctaskid+"/items/"+textarea.parentElement.id.split("item_")[1]+"/text").set(textarea.value).catch(function(error) {showAlert("Error","Error code: "+error.code)});
  }
  tasks[cctaskid].items[textarea.parentElement.id.split("item_")[1]].text = textarea.value;
};

textarea.onkeydown = function(event) {
	
if (event.keyCode==13) {
	event.preventDefault();
	
	var newval = "";
	if (textarea.selectionStart != textarea.value.length) {
		newval = textarea.value.substring(textarea.selectionStart,textarea.value.length);
		textarea.value = textarea.value.substring(0,textarea.selectionStart);
		textarea.oninput();
	}
	
	var next = textarea.parentElement.nextSibling;
if (next.classList.contains("add_item")) {
	var additem = addItem(cctaskid,undefined,nonetwork);
	if (additem != false) {
	var newbox = additem.querySelector("textarea");
	newbox.value = newval;
	newbox.selectionStart = 0;
	newbox.selectionEnd = 0;
	newbox.focus();
	newbox.oninput();
	}
} else {
	var additem = addItem(cctaskid,Number(textarea.previousElementSibling.id.split("drag_")[1])+1,nonetwork);
	if (additem != false) {
	var newbox = additem.querySelector("textarea");
	newbox.value = newval;
	newbox.selectionStart = 0;
	newbox.selectionEnd = 0;
	newbox.focus();
	newbox.oninput();
	}
}


}

if (event.keyCode==8) {
	if (textarea.value.length == 0) {
		event.preventDefault();
		var newbox = false;
		if (textarea.parentElement.previousSibling) {
		newbox = textarea.parentElement.previousSibling.querySelector("textarea");
		} else {
		if (textarea.parentElement.nextSibling && textarea.parentElement.nextSibling.querySelector("textarea")) {
		newbox = textarea.parentElement.nextSibling.querySelector("textarea");
		}
		}
		removeItem(textarea.parentElement.id.split("item_")[1],cctaskid,nonetwork);
		if (newbox) {
		newbox.selectionStart = newbox.value.length;
		newbox.selectionEnd = newbox.value.length;
		newbox.focus();
		}
	} else {
	if (textarea.selectionStart == 0 && textarea.selectionEnd == 0 && textarea.parentElement.previousSibling) {
		event.preventDefault();
		var newbox = textarea.parentElement.previousSibling.querySelector("textarea");
		var orig_length = newbox.value.length;
		newbox.value += textarea.value;
		newbox.selectionStart = orig_length;
		newbox.selectionEnd = orig_length;
		newbox.oninput();
		removeItem(textarea.parentElement.id.split("item_")[1],cctaskid,nonetwork);
		newbox.focus();
	}
	}
}
	
}

textarea.previousElementSibling.addEventListener("touchstart", function(e) {itemDragStart(e,nonetwork)}, false);

}
}

var item_startDragOffset = false;
var item_startDragPos = false;
var item_emptySpacePos = false;
var item_startPixelOffset = false;
var initemdrag = false;
var itemCurrentWho = false;
var inDragTask = "";
var nonetwork_drag = false;

function itemDragStart(event,nonetwork) {
	
inDragTask = event.target.parentElement.parentElement.parentElement.id.split("task_")[1];
if (nonetwork) {
if (inDragTask !== edittask){
	return true;
}
}

nonetwork_drag = nonetwork;
	
event.preventDefault();
event.stopPropagation();

if (initemdrag !== false) {
	return itemDragEnd();
}

event.target.nextSibling.blur();

who = Number(event.target.id.split("drag_")[1]);

itemCurrentWho = who;

initemdrag = who;

var empty = document.createElement('div');
empty.classList.add("item_space");
item_emptySpacePos = who;

gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.parentNode.insertBefore(empty, gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.nextSibling);

gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.classList.add("item_in_drag");

gid("task_"+inDragTask).querySelector("#drag_"+who).addEventListener('touchmove', handleTouchMove);
gid("task_"+inDragTask).querySelector("#drag_"+who).addEventListener('touchend', handleTouchEnd);
gid("task_"+inDragTask).querySelector("#drag_"+who).addEventListener('touchcancel', handleTouchEnd);

item_startDragOffset = gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.offsetTop;
item_startDragPos = who;

gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.style.top = (item_startDragOffset-gid("content").scrollTop)+"px";

item_startPixelOffset = (event.targetTouches[0].pageY-item_startDragOffset)-21;
}

function itemDragMove(who,event) {
if (initemdrag !== false) {

event.preventDefault();
event.stopPropagation();
	
var dragPos = event.targetTouches[0].pageY-item_startPixelOffset;
var dragPosAdj = dragPos - gid("content").scrollTop;

var maxTopDrag = item_startDragOffset-(42*item_startDragPos);
var maxBottomDrag = item_startDragOffset+(42*(Object.keys(tasks[inDragTask].items).length-item_startDragPos));

if (dragPos < maxTopDrag+18) {
	
	dragPosAdj = maxTopDrag+18 - ((maxTopDrag+18-dragPos)/3)/2.5 - gid("content").scrollTop;
	dragPos = maxTopDrag+19;
	
};

if (dragPos > maxBottomDrag-18) {
	dragPosAdj = maxBottomDrag-18 + ((dragPos+18-maxBottomDrag)/3)/2.5 - gid("content").scrollTop;
	dragPos = maxBottomDrag-19;

}

for (var i = 0; i < Object.keys(tasks[inDragTask].items).length; i++) {
if (dragPos > maxTopDrag+(i*42) && dragPos < maxBottomDrag-((Object.keys(tasks[inDragTask].items).length-i-1)*42)) {
	if (i !== item_emptySpacePos) {
		document.querySelector(".item_space").outerHTML = "";
		var gets = gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.parentElement.querySelectorAll(".task_item:not(.item_in_drag):not(.add_item)");
		for (var e = 0; e < gets.length+1; e++) {
			if (i == e) {
				var empty = document.createElement('div');
				empty.classList.add("item_space");
				item_emptySpacePos = e;
				
				if (e == Object.keys(tasks[inDragTask].items).length - 1) {
					gets[0].parentNode.insertBefore(empty, gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.parentElement.querySelector(".add_item"));
				} else {
				if (e == 0) {
					gets[0].parentNode.insertBefore(empty, gets[0]);
				} else {
					gets[0].parentNode.insertBefore(empty, gets[e-1].nextSibling);
				}
				}
			}
		}
	}
}
}

gid("task_"+inDragTask).querySelector("#drag_"+who).parentElement.style.top = (dragPosAdj-21)+"px";
	
}
}

function handleTouchMove(event) {
	itemDragMove(who,event);
}

function handleTouchEnd(event) {
	itemDragEnd();
}

function itemDragEnd(dontsave) {
if (initemdrag !== false) {

if (initemdrag !== true && inDragTask) {
gid("task_"+inDragTask).querySelector("#drag_"+initemdrag).removeEventListener('touchmove', handleTouchMove);
gid("task_"+inDragTask).querySelector("#drag_"+initemdrag).removeEventListener('touchend', handleTouchEnd);
gid("task_"+inDragTask).querySelector("#drag_"+initemdrag).removeEventListener('touchcancel', handleTouchEnd);
}

initemdrag = false;

gid("task_"+inDragTask).querySelector(".task_items").insertBefore(gid("task_"+inDragTask).querySelector(".item_in_drag"),gid("task_"+inDragTask).querySelector(".item_space"));
gid("task_"+inDragTask).querySelector(".item_in_drag").style.top = "";
gid("task_"+inDragTask).querySelector(".item_in_drag").classList.remove("item_in_drag");
document.querySelector(".item_space").outerHTML = "";
var childs = gid("task_"+inDragTask).querySelector(".task_items").children;
var newposarray = {};
for (var i = 0; i < childs.length; i++) {
if (!childs[i].classList.contains("add_item")) {
	childs[i].querySelector("i").id = "drag_"+i;
	tasks[inDragTask].items[childs[i].id.split("item_")[1]].pos = i;
	newposarray[childs[i].id.split("item_")[1]] = {};
	newposarray[childs[i].id.split("item_")[1]].pos = i;
}
}
if (dontsave != true && nonetwork_drag !== true) {
firebase.database().ref("groups/"+userjson.group+"/tasks/"+inDragTask+"/items").update(tasks[inDragTask].items).then(function(snapshot) {

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}
}
}


function addItem(taskid,index,nonetwork) {
	
if (tasks[taskid].items && Object.keys(tasks[taskid].items).length > 9) {
	return false;
}
	
if (index) {
for (var i = 0; i < Object.keys(tasks[taskid].items).length; i++) {
if (tasks[taskid].items[Object.keys(tasks[taskid].items)[i]].pos > index-1) {
	tasks[taskid].items[Object.keys(tasks[taskid].items)[i]].pos += 1;
}
}
}
	
var new_item_id = firebase.database().ref().child("groups/"+userjson.group+"/tasks/"+taskid+"/items").push().key;
	
var new_item = document.createElement("div");
new_item.classList.add("task_item");
new_item.id = "item_"+new_item_id;
new_item.onclick = function() {checkItem(taskid,new_item_id)};
new_item.innerHTML = '<i class="material-icons">drag_indicator</i><textarea type="text" value="" placeholder="List item"></textarea><i onclick="removeItem(\''+new_item_id+'\',\''+taskid+'\','+nonetwork+')" class="material-icons">close</i>';

if (index != null) {
gid("task_"+taskid).querySelector(".task_items").insertBefore(new_item,gid("task_"+taskid).querySelector(".task_items").children[index+1]);
} else {
gid("task_"+taskid).querySelector(".task_items").insertBefore(new_item,gid("task_"+taskid).querySelector(".add_item"));
}

var textarea = new_item.querySelector("textarea");

initTextarea(textarea,taskid,undefined,nonetwork)

textarea.previousElementSibling.id = "drag_"+(index || Object.keys(tasks[taskid].items || {}).length);

if (!tasks[taskid].items) {
	tasks[taskid].items = {};
}

tasks[taskid].items[new_item_id] = {};
tasks[taskid].items[new_item_id].text = "";
tasks[taskid].items[new_item_id].pos = index || Object.keys(tasks[taskid].items).length-1;

redrawJustOrder(taskid);

if (index != null) {
} else {
	gid("item_"+new_item_id).querySelector("textarea").focus();
}

if (nonetwork !== true) {
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/items/").set(tasks[taskid].items).then(function(snapshot) {

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}

return new_item;
}

function removeItem(itemid, taskid, nonetwork) {
	
if (gid("item_"+itemid).nextElementSibling && gid("item_"+itemid).nextElementSibling.querySelector("textarea")) {
	gid("item_"+itemid).nextElementSibling.querySelector("textarea").focus();
} else {
if (gid("item_"+itemid).previousElementSibling && gid("item_"+itemid).previousElementSibling.querySelector("textarea")) {
	gid("item_"+itemid).previousElementSibling.querySelector("textarea").focus();
}
}
	
gid("item_"+itemid).parentElement.removeChild(gid("item_"+itemid));

var deleted_item_pos = tasks[taskid].items[itemid].pos;

for (var i = 0; i < Object.keys(tasks[taskid].items).length; i++) {
	
var thisitem = tasks[taskid].items[Object.keys(tasks[taskid].items)[i]];

if (thisitem.pos > deleted_item_pos) {
	tasks[taskid].items[Object.keys(tasks[taskid].items)[i]].pos -= 1;
}
	
}

delete tasks[taskid].items[itemid];

redrawJustOrder(taskid);

if (nonetwork !== true) {
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/items").set(tasks[taskid].items).then(function(snapshot) {

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}
	
}

function updateTasksAndLists(newtasks) {

if (newtasks != null) {
for (var e = 0; e < Object.keys(newtasks).length; e++) {
	
var ctask = newtasks[Object.keys(newtasks)[e]];
var ctaskid = Object.keys(newtasks)[e];

if (!tasks || !tasks[ctaskid]) {//brand new task

return loadHome();
	
} else {

if (tasks[ctaskid].name != ctask.name) {//update name
	
gid("task_"+ctaskid).querySelector(".task_top").querySelector("div").innerHTML = htmlescape(ctask.name);
tasks[ctaskid].name = ctask.name;
	
}

if (tasks[ctaskid].status != ctask.status || tasks[ctaskid].points != ctask.points) {//update status, points, or anything else that requires compelete redraw

return loadHome();
	
}

if (ctask.items != null) {
for (var i = 0; i < Object.keys(ctask.items).length; i++) {
	
var citem = ctask.items[Object.keys(ctask.items)[i]];
var citemid = Object.keys(ctask.items)[i];

if (!tasks[ctaskid].items || !tasks[ctaskid].items[citemid]) {//brand new item

itemDragEnd(true)

var new_item = document.createElement("div");
new_item.classList.add("task_item");
new_item.id = "item_"+citemid;
new_item.onclick = function() {checkItem(ctaskid,citemid)};
new_item.innerHTML = '<i class="material-icons">drag_indicator</i><textarea type="text" value="" placeholder="List item"></textarea><i onclick="removeItem(\''+citemid+'\',\''+ctaskid+'\')" class="material-icons">close</i>';

gid("task_"+ctaskid).querySelector(".task_items").insertBefore(new_item,gid("task_"+ctaskid).querySelector(".add_item"));

var textarea = new_item.querySelector("textarea");

initTextarea(textarea,ctaskid);

textarea.previousElementSibling.id = "drag_"+(citem.pos);

if (!tasks[ctaskid].items) {
	tasks[ctaskid].items = {};
}
tasks[ctaskid].items[citemid] = {text: citem.text, pos: citem.pos};

redrawJustOrder(ctaskid);
	
} else {

if (tasks[ctaskid].items[citemid].text != citem.text) {//update text
	
gid("item_"+citemid).querySelector("textarea").value = citem.text;
tasks[ctaskid].items[citemid].text = citem.text;
	
}

if (tasks[ctaskid].items[citemid].pos != citem.pos) {//update position

itemDragEnd(true)
	
tasks[ctaskid].items[citemid].pos = citem.pos;

redrawJustOrder(ctaskid);
	
}

}
	
}
}
}
}
}

if (tasks != null) {
for (var e = 0; e < Object.keys(tasks).length; e++) {
	
var ctask = tasks[Object.keys(tasks)[e]];
var ctaskid = Object.keys(tasks)[e];

if (!newtasks || !newtasks[ctaskid]) {//task deleted

itemDragEnd(true)
	
gid("task_"+ctaskid).outerHTML = "";
delete tasks[ctaskid];

if (tasks_list.children.length == 0) {
	tasks_list.innerHTML = '<div class="error_gray"><center><i class="material-icons">list_alt</i></center>No tasks were found</div>';
}
	
} else {

if (ctask.items != null) {
for (var i = 0; i < Object.keys(ctask.items).length; i++) {
	
var citem = ctask.items[Object.keys(ctask.items)[i]];
var citemid = Object.keys(ctask.items)[i];

if (!newtasks[ctaskid].items || !newtasks[ctaskid].items[citemid]) {//item deleted

itemDragEnd(true)
	
gid("item_"+citemid).outerHTML = "";
delete tasks[ctaskid].items[citemid];
redrawJustOrder(ctaskid)
	
}

}
} else {

delete tasks[ctaskid].items;
var childs = gid("task_"+ctaskid).querySelector(".task_items").children;
for (var i = 0; i < childs.length; i++) {
	if (!childs[i].classList.contains("add_item")) {
		childs[i].outerHTML = "";
	}
}
	
}

}
}
}

}

function redrawJustOrder(ctaskid) {
	
var task_sort = [];

var titems = tasks[ctaskid].items;

for (var i = 0; i < Object.keys(titems).length; i++) {
	
var thisitem = titems[Object.keys(titems)[i]];

task_sort[i] = [thisitem.pos,Object.keys(titems)[i]]
	
}

function taskSort(a,b) {
	return a[0] - b[0];
}
task_sort = task_sort.sort(taskSort);

for (var i = 0; i < task_sort.length; i++) {

gid("item_"+task_sort[i][1]).querySelector("i").id = "drag_"+i;
gid("task_"+ctaskid).querySelector(".task_items").insertBefore(gid("item_"+task_sort[i][1]),gid("task_"+ctaskid).querySelector(".add_item"));
	
}
	
}

function createTask() {
	
showAlert("Create a new task",'<input onkeypress="if(event.keyCode==13) {valNewTask()}" class="c_text" id="taskname" placeholder="Task name"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="group_error_text"></div>',"submit",valNewTask);

taskname.focus();
	
}

function valNewTask() {
	
var gn = taskname.value;

if (gn.length > 0) {
	
createPostProgress("Creating task")
	
firebase.database().ref("groups/"+userjson.group+"/tasks").push({
    name : gn
}).then(
function (snap) {

hideAlert();
loadHome();

}
).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
	group_error_text.innerHTML = "Please enter a task name";
}
	
}

function updateProfile() {
showAlert("Update Profile","<div style='font-size: 20px'>Name:<div style='padding-top: 5px'></div><input type='text' class='c_text' id='edit1' placeholder='First Last'></br><div style='padding-top: 10px'></div>Grade:<div style='padding-top: 5px'></div><select style='font-size: 20px;' id='edit2'><option value='Freshman'>Freshman</option><option value='Sophomore'>Sophomore</option><option value='Junior'>Junior</option><option value='Senior'>Senior</option><option value='Teacher'>Teacher</option></select><div style='padding-top: 10px'></div>Phone:<div style='padding-top: 5px'></div><select style='font-size: 20px;' id='edit3'><option value='Android'>Android</option><option value='iOS'>iOS</option></select></div>","submit",function() {saveProfile()});
gid("edit1").focus();
gid("edit1").value = userjson[firebase.auth().currentUser.uid].name || "";
gid("edit2").value = userjson[firebase.auth().currentUser.uid].grade || "Freshman";
gid("edit3").value = userjson[firebase.auth().currentUser.uid].device || "Android";
}

function saveProfile() {
var newname = gid("edit1").value.trim();
var newgrade = gid("edit2").value;
var newdevice = gid("edit3").value;
createPostProgress("Updating profile");
firebase.database().ref('users/'+firebase.auth().currentUser.uid).update({
    name: newname,
	grade: newgrade,
	device: newdevice
}).then(function () {
	
if (userjson != null) {} else {
userjson = new Array();
}

if (userjson[firebase.auth().currentUser.uid] != null) {} else {
userjson[firebase.auth().currentUser.uid] = new Array();
}
	
userjson.name = newname;
userjson.grade = newgrade;
userjson.device = newdevice;
	
hideAlert();
loadSettings();
openHome();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}

function htmlescape(str) {
if (str == undefined) {
return str;
}
str = String(str);
return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
} 


function editPhone(setup) {
showAlert("Edit Phone Number","<input type='tel' class='c_text' id='edit1' placeholder='Phone number'><div id='p_error' style='display: none'></div>","submit",function() {savePhone(setup)});
gid("edit1").focus();
gid("edit1").value = privateuserjson.phone || "";
}

function savePhone(setup) {
var newphone = gid("edit1").value;
if (String(newphone) !== String(Number(newphone)) && newphone.length > 0) {
	gid("p_error").style.display = "block"
	gid("edit1").focus();
	return gid("p_error").innerHTML = "Error: Phone number contains invalid characters"
}
if (String(newphone).length !== 10) {
	gid("p_error").style.display = "block"
	gid("edit1").focus();
	return gid("p_error").innerHTML = "Error: Invalid phone number"
}
createPostProgress("Updating phone number");
firebase.database().ref('private/'+firebase.auth().currentUser.uid+"/phone").set(newphone).then(function () {

privateuserjson.phone = newphone;

if (setup) {
	
gid("setup_phone").innerHTML = formatPhone(privateuserjson.phone) || "<i>Enter phone number</i>";
gid("phone_continue").classList.remove("gray");
	
}
	
hideAlert();
loadSettings();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}

function loadSetup() {
	
gid("school_continue").classList.add("gray");

for (var i = 0; i < gid("school_container").children.length; i++) {
	gid("school_container").children[i].classList.remove("school_selected");
}

gid("setup_1").style.display = "block";
gid("setup_2").style.display = "none";
gid("setup_3").style.display = "none";

if (userjson.school) {
	
	
gid("setup_1").style.display = "none";
gid("setup_3").style.display = "block";
}
	
}

var selected_school = false;
var schools = ["Roosevelt","Lincoln"];

function selectSchool(schoolid) {
	
selected_school = schools[schoolid];

for (var i = 0; i < gid("school_container").children.length; i++) {
	gid("school_container").children[i].classList.remove("school_selected");
}

gid("school_"+schoolid).classList.add("school_selected");
gid("school_continue").classList.remove("gray");
	
}

function setup_step(stepid) {
	
if (stepid == 1 && selected_school) {
	
gid("setup_1").style.display = "none";
gid("setup_2").style.display = "block";

gid("setup_phone").innerHTML = formatPhone(privateuserjson.phone) || "<i>Enter phone number</i>";
if (!privateuserjson.phone) {
	gid("phone_continue").classList.add("gray");
}
	
}

if (stepid == 2 && privateuserjson.phone) {
	
confirmProfile();
	
}
	
}

function setup_step_back(stepid) {
	
if (stepid == 2) {
	
gid("setup_1").style.display = "block";
gid("setup_2").style.display = "none";
	
}

if (stepid == 3) {
	
gid("setup_2").style.display = "block";
gid("setup_3").style.display = "none";
	
}
	
}

function setupPhoneNumber() {
	editPhone(true);
}

function confirmProfile() {
	
showAlert("Submit account for approval?","Please verify that the following information is correct:<br><br>School: "+selected_school+"<br>Phone: "+formatPhone(privateuserjson.phone),"confirm",function() {
	
createPostProgress("Submitting");
firebase.database().ref('users/'+firebase.auth().currentUser.uid+"/school").set(selected_school).then(function () {
	
userjson.school = selected_school;

gid("setup_2").style.display = "none";
gid("setup_3").style.display = "block";
hideAlert();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

})
	
}

function getUserPoints(userid) {

var total = 0;

if (checks != null && checks[userid] != null) {
if (checks[userid].points != null) {
for (var i = Object.keys(checks[userid].points).length-1; i > -1; i--) {
	total += checks[userid].points[Object.keys(checks[userid].points)[i]].points;
}
}
	
for (var i = Object.keys(checks[userid].items).length-1; i > -1; i--) {
	
var cgroupid = Object.keys(checks[userid].items)[i];
	
for (var r = Object.keys(checks[userid].items[cgroupid]).length-1; r > -1; r--) {
	
var ctaskid = Object.keys(checks[userid].items[cgroupid])[r];
var ctask = checks[userid].items[cgroupid][Object.keys(checks[userid].items[cgroupid])[r]];
var this_task_points = 0;

if (ctask) {
for (var e = 0; e < Object.keys(ctask).length; e++) {
	
var citem = ctask[Object.keys(ctask)[e]];
var citemid = Object.keys(ctask)[e];

if (citem.status && citem.points != null) {
this_task_points += citem.points;
}
	
}
}

if (groups && groups[cgroupid] && groups[cgroupid].tasks && groups[cgroupid].tasks[ctaskid]) {
var task_points = Math.floor((groups[cgroupid].tasks[ctaskid].points/Object.keys(groups[cgroupid].tasks[ctaskid].items).length)*this_task_points);

total += task_points;
}
	
}
}
}

if (total < 0) {
	total = 0;
}

return total;
	
}

function loadGroups() {
	
gid("users_list").style.display = "block";
gid("groups_list").style.display = "none";
gid("user_bio").style.display = "none";

user_list_content.innerHTML = real_spinner;

firebase.database().ref("private").once('value').then(function(snapshot) {
privateusers = snapshot.val();
firebase.database().ref("checks").once('value').then(function(snapshot) {
checks = snapshot.val();
firebase.database().ref("groups").once('value').then(function(snapshot) {
groups = snapshot.val();
firebase.database().ref("users").once('value').then(function(snapshot) {
	
users = snapshot.val();
var pendhtml = "";

if (groups != null) {
for (var i = 0; i < Object.keys(groups).length; i++) {
var cgroup = groups[Object.keys(groups)[i]];
if (cgroup != null) {
pendhtml += "<div class='group_title'>"+htmlescape(cgroup.name)+"</div>";
if (cgroup.members != null && cgroup.members.length > 0) {
for (var e = 0; e < cgroup.members.length; e++) {
var cuser = users[cgroup.members[e]];
if (cuser && cuser.verified == true) {
pendhtml += "<div class='user' onclick='openUser(\""+cgroup.members[e]+"\")'><div><img src='"+cuser.picture.split("/mo/").join("/s84/")+"'></img></div><div>"+htmlescape(cuser.name)+"</div><div>"+getUserPoints(cgroup.members[e])+"<i class='material-icons'>stars</i></div></div>";
users[cgroup.members[e]].ingroup = true;
}
}
} else {
pendhtml += '<div style="text-align: center;color: gray;font-size: 18px;padding-bottom: 10px;padding-top: 5px;">No group members</div>'
}
}
}
}

var nogrouphtml = "";
if (users != null) {
for (var i = 0; i < Object.keys(users).length; i++) {
var cuser = users[Object.keys(users)[i]];
if (cuser && cuser.verified == true && cuser.ingroup !== true && cuser.admin != "admin") {
	nogrouphtml += "<div class='user'><div onclick='openUser(\""+Object.keys(users)[i]+"\")'><img src='"+cuser.picture.split("/mo/").join("/s84/")+"'></img></div><div onclick='openUser(\""+Object.keys(users)[i]+"\")'>"+htmlescape(cuser.name)+"</div><div class='assign' onclick='assignUser(\""+Object.keys(users)[i]+"\")'>Assign</div></div>";
}
}
}
if (nogrouphtml != "") {
	nogrouphtml = "<div class='group_title'>Unassigned</div>"+nogrouphtml;
	pendhtml = nogrouphtml+pendhtml;
}

gid("user_list_content").innerHTML = pendhtml;

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function assignUserGroup() {
	assignUser(open_user);
}

function assignUser(uid) {
	
var cuser = users[uid];
var pendhtml = "<div style='overflow: hidden; margin-bottom: -10px;'>";

var before_group = false;
if (users && users[uid] && users[uid].group) {
	before_group = users[uid].group;
}

for (var i = 0; i < Object.keys(groups).length; i++) {
var cgroup = groups[Object.keys(groups)[i]];

var userstring = " (0 members)"
if (cgroup.members != null && cgroup.members.length > 0) {
if (cgroup.members.length > 1) {
userstring = " ("+cgroup.members.length+" members)"
} else {
userstring = " (1 member)"
}
}

var dis_style = "";
if (before_group == Object.keys(groups)[i]) {
dis_style = 'style="color: gray;pointer-events: none;"';
}

pendhtml += '<div '+dis_style+' class="post_attach" onclick="confirmAssign(\''+uid+'\','+i+')"><div class="pa_left"><i class="material-icons">group</i></div><div class="pa_right">'+htmlescape(cgroup.name)+userstring+'</div></div>'
	
}

if (before_group && groups && groups[before_group]) {
	pendhtml += '<div class="post_attach" onclick="confirmAssign(\''+uid+'\',-1)"><div class="pa_left"><i class="material-icons">close</i></div><div class="pa_right">No group (Unassigned)</div></div>'
}

pendhtml += "</div>"

showAlert('Choose group for "'+htmlescape(cuser.name)+'"',pendhtml,"cancel",function() {});
	
}

function confirmAssign(userid,groupid) {

if (groupid == -1) {
var grn = "[DELETED GROUP]";
if (groups && groups[users[userid].group]) {
grn = htmlescape(groups[users[userid].group].name);
}
showAlert('Remove user "'+htmlescape(users[userid].name)+'" from group "'+grn+'"?',"This user will become unassigned","confirm",function(){actualAssign(userid,groupid)});
} else {
showAlert('Assign user "'+htmlescape(users[userid].name)+'" to group "'+htmlescape(groups[Object.keys(groups)[groupid]].name)+'"?',"","confirm",function(){actualAssign(userid,groupid)});
}
	
}

function actualAssign(userid,groupid) {

createPostProgress("Assigning user")

if (users && users[userid].group && groups && groups[users[userid].group]) {
	
var mem_array = groups[users[userid].group].members;
if (mem_array.indexOf(userid) > -1) {
	mem_array.splice(mem_array.indexOf(userid),1);
	firebase.database().ref("groups/"+users[userid].group+"/members").set(mem_array).then(function() {
	
doNewGroup();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
} else {
	doNewGroup();
}
	
} else {
doNewGroup();
}

function doNewGroup() {
if (groupid == -1) {
firebase.database().ref("users/"+userid+"/group").set(null).then(function() {
	
hideAlert();
loadGroups();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
} else {
firebase.database().ref("users/"+userid+"/group").set(Object.keys(groups)[groupid]).then(function() {
	
var mem_array = groups[Object.keys(groups)[groupid]].members;
if (mem_array != null) {
	mem_array.push(userid);
} else {
	mem_array = [userid];
}
	
firebase.database().ref("groups/"+Object.keys(groups)[groupid]+"/members").set(mem_array).then(function() {
	
hideAlert();
loadGroups();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}
}

}

var open_user;

function openUser(uid) {
	
open_user = uid;
	
gid("users_list").style.display = "none";
gid("groups_list").style.display = "none";
gid("user_bio").style.display = "block";

gid("bio_name").innerHTML = htmlescape(users[uid].name);
gid("bio_pic").src = users[uid].picture;
var group_text = "Unassigned";
gid("assign_button").innerHTML = "Assign group";
if (users[uid].group) {
var grn = "[DELETED GROUP]";
if (groups && groups[users[uid].group]) {
	grn = htmlescape(groups[users[uid].group].name);
}
	group_text = grn;
	gid("assign_button").innerHTML = "Change group";
}
gid("bio_details").innerHTML = '<div class="prof_detail truncate"><i class="material-icons">email</i>'+htmlescape(privateusers[uid].email)+'</div><a style="color: black;" href="sms:/'+privateusers[uid].phone+'"><div class="prof_detail truncate"><i class="material-icons">phone</i>'+formatPhone(privateusers[uid].phone)+'</div></a><div class="prof_detail truncate"><i class="custom-icons">0</i>'+htmlescape(users[uid].school)+'</div><div class="prof_detail truncate"><i class="material-icons">group</i>'+group_text+'</div><div class="prof_detail truncate"><i class="material-icons">stars</i>'+getUserPoints(uid)+'</div>';
	
}

function deleteUser() {
	
showAlert('Delete user "'+htmlescape(users[open_user].name)+'"?',"This action cannot be undone.","confirm",function(){actualUserDelete()});
	
}

function actualUserDelete() {
	
createPostProgress("Deleting user")
	
firebase.database().ref('users/'+open_user+"/delete").set(true).then(function () {

showAlert("User pending deletion","This user account will be deleted momentarily")
loadGroups();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function giveUserPoints() {
	
showAlert('Give "'+htmlescape(users[open_user].name)+'" points','<input onkeypress="if(event.keyCode==13) {this.nextSibling.focus()}" type="tel" style="margin-bottom: 12px;" class="c_text" id="pointvalue" placeholder="Points"><input onkeypress="if(event.keyCode==13) {valGiveUserPoints()}" class="c_text" id="pointdesc" placeholder="Short description"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="points_error_text"></div>',"submit",function(){valGiveUserPoints()});

gid("pointvalue").focus();
	
}

function valGiveUserPoints() {
	
var vpoints = gid("pointvalue").value;
var vdesc = gid("pointdesc").value;

if (vpoints.length > 0 && String(vpoints) == String(Number(vpoints)) && String(vpoints) != "NaN" && !(vpoints > 999) && !(vpoints < -999)) {
	
if (vdesc.length > 0) {
	
createPostProgress("Giving user points");

firebase.database().ref("checks/"+open_user+"/points").push({
    points : Number(vpoints),
	desc : vdesc
}).then(
function (snap) {

hideAlert();
loadGroups();

}
).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
	points_error_text.innerHTML = "Please enter a short description";
	gid("pointdesc").focus();
}
	
} else {
	points_error_text.innerHTML = "Please enter a valid point value";
	gid("pointvalue").focus();
}
	
}

var groups;

var real_spinner = '<div class="real_spinner"><svg class="spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="10" stroke-linecap="butt" cx="50" cy="50" r="40"></circle></svg></div>';

function manageGroups() {
	
gid("users_list").style.display = "none";
gid("groups_list").style.display = "block";
gid("user_bio").style.display = "none";

group_list_content.innerHTML = real_spinner;

firebase.database().ref("groups").once('value').then(function(snapshot) {
	
groups = snapshot.val();
var pendhtml = "";

if (groups != null) {
for (var i = 0; i < Object.keys(groups).length; i++) {
	
var group = groups[Object.keys(groups)[i]];
var group_s = "";

if (group.members && group.members.length > 0) {
if (group.members.length > 1) {
	group_s = group.members.length+" group members"
} else {
	group_s = "1 group member"
}
} else {
	group_s = "No group members"
}
	
pendhtml += '<div class="post_item"><div class="item_left"><div style="font-size: 25px;" class="ell">'+htmlescape(group.name)+'</div><div style="font-size: 17px; padding-top: 3px;" class="ell">'+group_s+'</div></div><div class="item_right"><a title="Edit groups" onclick="editGroup('+i+')"><div class="item_icon item_icon_inv"><i class="material-icons">edit</i></div></a><a title="Delete group" onclick="deleteGroup('+i+')"><div class="item_icon item_icon_inv"><i class="material-icons">delete</i></div></a></div></div>';
	
}
}

if (pendhtml.length > 0) {
group_list_content.innerHTML = pendhtml;
} else {
group_list_content.innerHTML = '<div style="text-align: -webkit-center;font-size: 76px;color: gray;"><i class="material-icons">error_outline</i></div><div style="text-align: -webkit-center;font-size: 22px;color:gray;">No groups found</div><div class="padding"></div>';
}

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function editGroup(id) {
	
showAlert("Edit group",'<input onkeypress="if(event.keyCode==13) {valEditGroup('+id+')}" class="c_text" id="groupname" placeholder="New group name"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="group_error_text"></div>',"submit",function() {valEditGroup(id)});

groupname.focus();
groupname.value = groups[Object.keys(groups)[id]].name;
	
}

function valEditGroup(id) {
	
var gn = groupname.value;

if (gn.length > 0) {
	
createPostProgress("Updating group");
	
firebase.database().ref("groups/"+Object.keys(groups)[id]+"/name").set(gn).then(function(snap) {
	
hideAlert();
manageGroups();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
	group_error_text.innerHTML = "Please enter a group name";
}
	
}

function deleteGroup(id) {
	
showAlert('Delete "'+htmlescape(groups[Object.keys(groups)[id]].name)+'" group?',"This action cannot be undone<div style='padding-top: 10px'></div>All group tasks and lists will be deleted. Group members, their points, and their pictures will not be deleted","confirm",function(){confirmDeleteGroup(id)});
	
}

function confirmDeleteGroup(id) {
	
firebase.database().ref("groups/"+Object.keys(groups)[id]).set(null).then(function(snap) {
	
hideAlert();
manageGroups();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function createGroup() {
	
showAlert("Create new group",'<input onkeypress="if(event.keyCode==13) {valNewGroup()}" class="c_text" id="groupname" placeholder="Group name"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="group_error_text"></div>',"submit",valNewGroup);

groupname.focus();
	
}

function valNewGroup() {
	
var gn = groupname.value;

if (gn.length > 0) {
	
createPostProgress("Creating group")
	
firebase.database().ref("groups").push({
    name : gn
}).then(
function (snap) {

hideAlert();
manageGroups();

}
).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
	group_error_text.innerHTML = "Please enter a group name";
}
	
}

function groupsBack() {
	
gid("users_list").style.display = "block";
gid("groups_list").style.display = "none";
gid("user_bio").style.display = "none";
	
}

var users;
var private_checks;

function loadQueue() {
	
queue_content.innerHTML = real_spinner;
	
firebase.database().ref("/").once('value').then(function(snapshot) {

users = snapshot.val().users;
groups = snapshot.val().groups;
checks = snapshot.val().checks;
private_checks = snapshot.val().private_checks;
privateusers = snapshot.val()['private'] || {};

var pendhtml = "";

if (users != null) {
for (var i = 0; i < Object.keys(users).length; i++) {
	
var cuser = users[Object.keys(users)[i]];
var cprivateuser = privateusers[Object.keys(users)[i]];

if (cprivateuser && cuser.name != null && cuser.school != null && cuser.admin !== "admin" && cuser.verified !== true && cuser['delete'] !== true) {
	
pendhtml += '<div class="approval_card" id="user_'+Object.keys(users)[i]+'" onclick="approveCard(\'user\',\''+Object.keys(users)[i]+'\')"><div class="unexp"><div class="app_left"><i class="material-icons">account_circle</i></div><div class="app_right"><div class="app_title truncate">Account needs approval</div><div class="app_desc truncate">'+htmlescape(cuser.name)+'</div></div></div><div class="expand_content"><div class="prof_top"><img src="'+cuser.picture+'"></img><div>'+htmlescape(cuser.name)+'</div></div><center><div class="prof_details"><div class="prof_detail truncate"><i class="material-icons">email</i>'+htmlescape(cprivateuser.email)+'</div><div class="prof_detail truncate"><i class="material-icons">phone</i>'+formatPhone(cprivateuser.phone)+'</div><div class="prof_detail truncate"><i class="custom-icons">0</i>'+htmlescape(cuser.school)+'</div></div></center><div class="actionbar"><div onclick="appDeleteUser(\''+Object.keys(users)[i]+'\')" class="actionbar_item ac_red"><i class="material-icons">close</i>Delete</div><div class="actionbar_item ac_green" onclick="appApproveUser(\''+Object.keys(users)[i]+'\')"><i class="material-icons">check</i>Approve</div></div></div></div>'
	
}
	
}
}

if (groups != null) {
for (var i = 0; i < Object.keys(groups).length; i++) {
	
var cgroup = groups[Object.keys(groups)[i]];
var cgroupid = Object.keys(groups)[i];

if (cgroup.tasks != null) {
for (var e = 0; e < Object.keys(cgroup.tasks).length; e++) {
	
var ctask = cgroup.tasks[Object.keys(cgroup.tasks)[e]];
var ctaskid = Object.keys(cgroup.tasks)[e];
var faketaskid = ctaskid.split("_").join("$");

if (ctask.status == "pending") {
	
var itemhtml = '<div style="overflow: hidden;padding-bottom: 1px;">';
var taskitem_sort = [];

if (ctask.items != null) {
for (var r = 0; r < Object.keys(ctask.items).length; r++) {
var citeml = ctask.items[Object.keys(ctask.items)[r]];
taskitem_sort[r] = [citeml.pos,'<div style="height: 26px;padding-top: 6px;"><div style="float: left;"><i class="material-icons" style="font-size: 26px;">check_box_outline_blank</i></div><div style="float: left;width: calc(100% - 31px);padding-left: 5px;font-size: 20px;">'+citeml.text+'</div></div>'];
}

function taskSort(a,b) {
	return a[0] - b[0];
}
taskitem_sort = taskitem_sort.sort(taskSort);
for (var r = 0; r < taskitem_sort.length; r++) {
	
	itemhtml += taskitem_sort[r][1];
	
}
}

itemhtml += '</div>';

var itemam = "no items";
if (ctask.items && Object.keys(ctask.items)) {
if (Object.keys(ctask.items).length > 1) {
	itemam = Object.keys(ctask.items).length+" items"
} else {
	itemam = "1 item"
}
}

pendhtml += '<div class="approval_card" id="taskapp_'+faketaskid+'" onclick="approveCard(\'taskapp\',\''+faketaskid+'\')"><div class="unexp"><div class="app_left"><i class="material-icons">list_alt</i></div><div class="app_right"><div class="app_title truncate">Task needs approval</div><div class="app_desc truncate">'+htmlescape(cgroup.name)+": "+htmlescape(ctask.name)+'</div></div></div><div class="expand_content"><center style="font-size: 20px;padding-top: 2.5px;">&quot;'+ctask.name+'&quot; by '+cgroup.name+'</center><center style="font-size: 18px;padding-top: 3px;">Task has '+itemam+'</center>'+itemhtml+'<div class="actionbar"><div class="actionbar_item ac_red" onclick="appRejectTask(\''+cgroupid+'\',\''+ctaskid+'\')"><i class="material-icons">close</i>Reject</div><div class="actionbar_item ac_green" onclick="appApproveTask(\''+cgroupid+'\',\''+ctaskid+'\')"><i class="material-icons">check</i>Approve</div></div></div></div>'
	
}

if (ctask.status == "delete") {
	
var itemhtml = '<div style="overflow: hidden;padding-bottom: 1px;">';
var taskitem_sort = [];

if (ctask.items != null) {
for (var r = 0; r < Object.keys(ctask.items).length; r++) {
var citeml = ctask.items[Object.keys(ctask.items)[r]];
taskitem_sort[r] = [citeml.pos,'<div style="overflow:hidden;padding-top: 6px;"><div style="float: left;"><i class="material-icons" style="font-size: 26px;">check_box_outline_blank</i></div><div style="float: left;width: calc(100% - 31px);padding-left: 5px;font-size: 20px;">'+citeml.text+'</div></div>'];
}

function taskSort(a,b) {
	return a[0] - b[0];
}
taskitem_sort = taskitem_sort.sort(taskSort);
for (var r = 0; r < taskitem_sort.length; r++) {
	
	itemhtml += taskitem_sort[r][1];
	
}
}

itemhtml += '</div>';

var itemam = "no items";
if (ctask.items && Object.keys(ctask.items)) {
if (Object.keys(ctask.items).length > 1) {
	itemam = Object.keys(ctask.items).length+" items"
} else {
	itemam = "1 item"
}
}

pendhtml += '<div class="approval_card" id="deleteapp_'+faketaskid+'" onclick="approveCard(\'deleteapp\',\''+faketaskid+'\')"><div class="unexp"><div class="app_left"><i class="material-icons">delete</i></div><div class="app_right"><div class="app_title truncate">Task deletion request</div><div class="app_desc truncate">'+htmlescape(cgroup.name)+": "+htmlescape(ctask.name)+'</div></div></div><div class="expand_content"><center style="font-size: 20px;padding-top: 2.5px;">Team '+cgroup.name+' has requested to delete task &quot;'+ctask.name+'&quot;</center><center style="font-size: 18px;padding-top: 3px;">Task has '+itemam+'. This action will result in the loss of any points earned towards this task by anyone in the group.</center>'+itemhtml+'<div class="actionbar"><div class="actionbar_item ac_red" onclick="appRejectDelTask(\''+cgroupid+'\',\''+ctaskid+'\')"><i class="material-icons">close</i>Restore</div><div class="actionbar_item ac_green" onclick="appApproveDelTask(\''+cgroupid+'\',\''+ctaskid+'\')"><i class="material-icons">check</i>Delete</div></div></div></div>'
	
}

if (ctask.items != null) {
for (var r = 0; r < Object.keys(ctask.items).length; r++) {
	
var citem = ctask.items[Object.keys(ctask.items)[r]];


	
}
}
	
}
}
	
}
}

if (checks != null) {
for (var i = 0; i < Object.keys(checks).length; i++) {
	
var ccheck = checks[Object.keys(checks)[i]];
var cuserid = Object.keys(checks)[i];

for (var o = 0; o < Object.keys(ccheck.items).length; o++) {
	
var cgroupid = Object.keys(ccheck.items)[o];
	
for (var e = 0; e < Object.keys(ccheck.items[cgroupid]).length; e++) {
	
var ctask = ccheck.items[cgroupid][Object.keys(ccheck.items[cgroupid])[e]];
var ctaskid = Object.keys(ccheck.items[cgroupid])[e];
var faketaskid = ctaskid.split("_").join("$");

for (var r = 0; r < Object.keys(ctask).length; r++) {

var citem = ctask[Object.keys(ctask)[r]];
var citemid = Object.keys(ctask)[r];
var fakeitemid = citemid.split("_").join("$");

if (citem.status == "waiting") {
if (private_checks && private_checks[cuserid] && private_checks[cuserid].items && private_checks[cuserid].items[cgroupid] && private_checks[cuserid].items[cgroupid][ctaskid] && private_checks[cuserid].items[cgroupid][ctaskid][citemid]) {
	
var citemprivate = private_checks[cuserid].items[cgroupid][ctaskid][citemid];

if (citemprivate.image) {
var imgproof = '<img onclick="imageClick(\''+fakeitemid+'\',\''+cuserid+'\',\''+citemprivate.image+'\')" onload="proofImgLoaded(this)" style="height: 0px;max-width: 100%;max-height: 220px;" src="'+citemprivate.image+'"></img><div style="background-color: rgb(138, 171, 138);width: 250px;text-align: center;font-size: 22px;color: white;border-radius: 6px;padding-top: 60px;padding-bottom: 61px;margin-top: -20px;margin-bottom: 4px;">Image loading...</div>'
} else {
var imgproof = '<div style="height: 100px;width: 200px;background: #d6d6d6;border-radius:5px;margin-top: 0px;margin-bottom: 5px;display: block;"><i class="material-icons" style="font-size: 50px;color: #616161;text-align: center;width: 200px;padding-top: 12px;">photo_camera</i><div style="color: #616161;font-size: 20px;text-align: center;padding-top: 4px;">No image uploaded</div></div>'
}

if (citemprivate.description) {
var descproof = '<div style="font-size: 20px;padding-top: 4px;padding-bottom: 2px;margin-bottom: 5px;">&quot;'+htmlescape(citemprivate.description)+'&quot;</div>'
} else {
var descproof = '<div style="font-size: 20px;padding-top: 4px;padding-bottom: 2px;margin-bottom: 5px;"><i>No description provided</i></div>'
}

if (!citemprivate.description || !citemprivate.image) {
descproof += '<div style="font-size: 20px;padding: 4px;margin-top: 4px;background-color: #ffdabf;border-radius: 5px;margin-bottom: 7px;margin-top:0px;">Reason for missing info:<div style="padding-top: 5px;"></div>&quot;'+citemprivate.excuse+'&quot;</div>';
}
	
pendhtml += '<div class="approval_card" id="item_'+fakeitemid+'!!!!'+cuserid+'" onclick="approveCard(\'item\',\''+fakeitemid+'!!!!'+cuserid+'\')"><div class="unexp"><div class="app_left"><i class="custom-icons">3</i></div><div class="app_right"><div class="app_title truncate">Item awaiting review</div><div class="app_desc truncate">'+htmlescape(users[cuserid].name)+': &quot;'+htmlescape(groups[users[cuserid].group].tasks[ctaskid].items[citemid].text)+'&quot;</div></div></div><div class="expand_content"><center style="font-size: 20px;padding-top: 2.5px;">'+htmlescape(users[cuserid].name)+' has requested review for item &quot;'+htmlescape(groups[users[cuserid].group].tasks[ctaskid].items[citemid].text)+'&quot;</center><div class="prof_details prof_item"><div class="prof_detail"><i class="material-icons">group</i>'+htmlescape(groups[users[cuserid].group].name)+'</div><div class="prof_detail"><i class="material-icons">person</i>'+htmlescape(users[cuserid].name)+'</div><div class="prof_detail"><i class="material-icons">list_alt</i>'+htmlescape(groups[users[cuserid].group].tasks[ctaskid].name)+'</div><div class="prof_detail"><i class="material-icons">check_box</i>&quot;'+htmlescape(groups[users[cuserid].group].tasks[ctaskid].items[citemid].text)+'&quot;</div></div>'+imgproof+descproof+'<div class="actionbar"><div class="actionbar_item ac_red" onclick="appDeclineItem(\''+cgroupid+'\',\''+cuserid+'\',\''+ctaskid+'\',\''+citemid+'\')"><i class="material-icons">close</i>Decline</div><div class="actionbar_item ac_green" onclick="appApproveItem(\''+cgroupid+'\',\''+cuserid+'\',\''+ctaskid+'\',\''+citemid+'\')"><i class="material-icons">check</i>Approve</div></div></div></div>'
	
}
}
}
}
}
}
}

if (pendhtml.length > 0) {
pendhtml += "<div id='ignore_pls' style='padding-bottom:10px'></div>"
}

queue_content.innerHTML = pendhtml;

expanded_cards = [];
suspended_cards = false;

if (auto_expand && gid('queue_content').children.length > 0) {
	
approveCard(gid('queue_content').children[0].id.split("_")[0],gid('queue_content').children[0].id.split("_")[1]);
	
}

if (pendhtml.length === 0) {
queue_content.innerHTML = '<div class="error_gray"><center><i class="material-icons">check</i></center>You\'re all caught up!</div>';
}
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

var expanded_cards = [];
var suspended_cards = false;
var auto_expand = true;

function approveCard(type,id,skip) {

if (suspended_cards) {
	return true;
}

if (expanded_cards.length > 0 && !skip && expanded_cards[0] !== type+"_"+id) {
	approveCard(expanded_cards[0].split("_")[0],expanded_cards[0].split("_")[1],true);
}

if (expanded_cards.indexOf(type+"_"+id) > -1) {
	
expanded_cards.splice(expanded_cards.indexOf(type+"_"+id),1);

gid(type+"_"+id).querySelector(".unexp").style.opacity = 1;
gid(type+"_"+id).querySelector(".expand_content").style.opacity = 0;

gid(type+"_"+id).style.height = "49px";
	
} else {
	
expanded_cards.push(type+"_"+id);

gid(type+"_"+id).querySelector(".unexp").style.opacity = 0;
gid(type+"_"+id).querySelector(".expand_content").style.height = 'unset';
gid(type+"_"+id).querySelector(".expand_content").style.opacity = 1;

gid(type+"_"+id).style.height = Number(gid(type+"_"+id).querySelector(".expand_content").clientHeight-12)+"px";

}
	
}

function dismissCard(type,id) {

if (expanded_cards.indexOf(type+"_"+id) > -1) {
expanded_cards.splice(expanded_cards.indexOf(type+"_"+id),1);
}
suspended_cards = false;
gid(type+"_"+id).style.height = "0px";
gid(type+"_"+id).style.marginTop = "-12px";
gid(type+"_"+id).style.opacity = 0;
gid(type+"_"+id).classList.add("dismissed");

if (auto_expand) {
	
var elem = gid(type+"_"+id);
var expanded_yet = false;

while(true) {
	
if (elem.nextSibling && elem.nextSibling.id !== "ignore_pls") {
if (!elem.nextSibling.classList.contains("dismissed")) {
	approveCard(elem.nextSibling.id.split("_")[0],elem.nextSibling.id.split("_")[1]);
	expanded_yet = true;
	break;
} else {
	elem = elem.nextSibling;
}
} else {
	break;
}
	
}

if (!expanded_yet) {
	
var elem = gid(type+"_"+id);
	
while(true) {
	
if (elem.previousSibling) {
if (!elem.previousSibling.classList.contains("dismissed")) {
	approveCard(elem.previousSibling.id.split("_")[0],elem.previousSibling.id.split("_")[1]);
	expanded_yet = true;
	break;
} else {
	elem = elem.previousSibling;
}
} else {
	break;
}
	
}
	
}

}
	
}

function disableCard(type,id) {

suspended_cards = true;
gid(type+"_"+id).querySelector(".actionbar").classList.add("actionbar_disabled");
	
}

function enableCard(type,id) {

suspended_cards = false;
gid(type+"_"+id).querySelector(".actionbar").classList.remove("actionbar_disabled");
	
}

function appApproveUser(uid) {
	
disableCard("user",uid);
	
//createPostProgress("Approving account");
firebase.database().ref('users/'+uid+"/verified").set(true).then(function () {

dismissCard("user",uid);
//hideAlert();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function appDeleteUser(uid) {
disableCard("user",uid);
	
//createPostProgress("Approving account");
firebase.database().ref('users/'+uid+"/delete").set(true).then(function () {

dismissCard("user",uid);
//hideAlert();

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function taskMenu(taskid) {
	
var pendhtml = '<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" onclick="renameTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">edit</i></div><div class="pa_right">Rename</div></div><div class="post_attach" onclick="deleteTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">delete</i></div><div class="pa_right">Delete draft</div></div><div class="post_attach" onclick="submitTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">send</i></div><div class="pa_right">Submit for approval</div></div></div>'
	
if (tasks[taskid].status == "pending") {
	
pendhtml = '<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" onclick="cancelTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">close</i></div><div class="pa_right">Cancel approval request</div></div></div>'
	
}

if (tasks[taskid].status == "delete") {
	
pendhtml = '<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" onclick="cancelTaskDelete(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">close</i></div><div class="pa_right">Cancel deletion request</div></div></div>'
	
}

if (tasks[taskid].status == "approved") {
	
if (edittask == taskid) {
	
pendhtml = '<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" onclick="submitChanges(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">send</i></div><div class="pa_right">Submit changes</div></div><div class="post_attach" onclick="cancelChanges(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">close</i></div><div class="pa_right">Discard changes</div></div></div>'
	
} else {
	
pendhtml = '<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" onclick="renameTask(\''+taskid+'\',true)"><div class="pa_left"><i class="material-icons">edit</i></div><div class="pa_right">Rename</div></div><div class="post_attach" onclick="editTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">edit</i></div><div class="pa_right">Edit items</div></div><div class="post_attach" onclick="requestDeleteTask(\''+taskid+'\')"><div class="pa_left"><i class="material-icons">delete</i></div><div class="pa_right">Delete task</div></div></div>'

}
	
}

showAlert('Task options',pendhtml,"cancel",function() {});
	
	
}

function deleteTask(taskid) {
	
showAlert('Are you sure you want to delete this task draft?',"This action cannot be undone<div style='padding-top: 10px'></div>This will also delete the task for all teammates","confirm",function(){confirmDeleteTask(taskid)});
	
}

function confirmDeleteTask(taskid) {
	
createPostProgress("Deleting task")
	
gid("task_"+taskid).outerHTML = "";
delete tasks[taskid];

if (tasks_list.children.length == 0) {
	tasks_list.innerHTML = '<div class="error_gray"><center><i class="material-icons">list_alt</i></center>No tasks were found</div>';
}
	
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid).set(null).then(function(snap) {
	
hideAlert();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function requestDeleteTask(taskid) {
	
showAlert('Are you sure you want to delete this task?',"All users in this group will loose all points earned towards this task<div style='padding-top: 10px'></div>This action requires approval","confirm",function(){confirmDeleteTaskR(taskid)});
	
}

function confirmDeleteTaskR(taskid) {
	
createPostProgress("Sending task deletion request")
	
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/status").set("delete").then(function(snap) {
	
hideAlert();
loadHome();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function renameTask(taskid,penalty) {
	
showAlert("Rename this task",'<input onkeypress="if(event.keyCode==13) {valNewTaskName(\''+taskid+'\','+penalty+')}" class="c_text" id="taskname" placeholder="Task name"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="group_error_text"></div>',"submit",function() {valNewTaskName(taskid,penalty)});

taskname.focus();
taskname.value = tasks[taskid].name;
	
}

function valNewTaskName(taskid,penalty) {
	
if (tasks[taskid].name == taskname.value) {
	return hideAlert();
}
	
var gn = taskname.value;

if (gn.length > 0) {
	
if (penalty) {
	
var newval = tasks[taskid].points-1;
if (newval < 0) {newval = 0};

var s = "s";
if (newval == 1) {s = ""};
	
showAlert("Rename task","This action result in the loss of 1 point value for this task<div style='padding-top: 10px'></div>New value: "+newval+" point"+s,"confirm",function() {
	
createPostProgress("Renaming task")
	
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid).update({
	name: gn,
	points: newval
}).then(
function (snap) {

hideAlert();
loadHome();

}
).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
})
	
} else {
	
createPostProgress("Renaming task")
	
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/name").set(gn).then(
function (snap) {

hideAlert();

}
).catch(function(error) {showAlert("Error","Error code: "+error.code)});

}
	
} else {
	group_error_text.innerHTML = "Please enter a task name";
}
	
}

function submitTask(taskid) {
	
showAlert('Submit this task for approval?',"No changes can be made after this task is submitted","confirm",function(){confirmSubmitTask(taskid)});
	
}

function confirmSubmitTask(taskid) {
	
createPostProgress("Submitting task")

firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/status").set("pending").then(function(snap) {
	
hideAlert();
loadHome();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function cancelTask(taskid) {
	
showAlert('Cancel task approval request?',"This will enable you to make changes to this task","confirm",function(){confirmCancelTask(taskid)});
	
}

function confirmCancelTask(taskid) {
	
createPostProgress("Cancelling approval request")

firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/status").set(null).then(function(snap) {
	
hideAlert();
loadHome();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function cancelTaskDelete(taskid) {
	
showAlert('Cancel task deletion request?',"The task will be restored, with no penatly or progress lost","confirm",function(){confirmCancelTaskDelete(taskid)});
	
}

function confirmCancelTaskDelete(taskid) {
	
createPostProgress("Cancelling deletion request")

firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid+"/status").set("approved").then(function(snap) {
	
hideAlert();
loadHome();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function appApproveTask(groupid,taskid) {
	
var fake_task_id = taskid.split("_").join("$");
disableCard("taskapp",fake_task_id);

setTimeout(function() {
	enableCard("taskapp",fake_task_id);
},0)
	
showAlert("Approve task",'<div style="padding-bottom: 12px;">How many points is this task worth?</div><input onkeypress="if(event.keyCode==13) {valApproveTask(\''+groupid+'\',\''+taskid+'\',\''+fake_task_id+'\')}" class="c_text" type="tel" id="taskpoints" placeholder="Points"><div style="color: red; font-size: 18px; padding-top: 3px; margin-bottom: -2px" id="group_error_text"></div>',"submit",function() {valApproveTask(groupid,taskid,fake_task_id)})
	
taskpoints.focus();
	
}

function valApproveTask(groupid,taskid,fake_task_id) {
	
var pnts = taskpoints.value;

if (pnts.length > 0 && String(pnts) == String(Number(pnts)) && String(pnts) != "NaN" && !(pnts > 999) && pnts > 0) {
	
hideAlert();
	
disableCard("taskapp",fake_task_id);

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid+"/orig_points").set(Number(pnts)).then(function () {

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid+"/points").set(Number(pnts)).then(function () {

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid+"/status").set("approved").then(function () {

dismissCard("taskapp",fake_task_id);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
	group_error_text.innerHTML = "Please enter a valid point value";
	taskpoints.focus();
}
	
}

function appRejectTask(groupid,taskid) {
	
var fake_task_id = taskid.split("_").join("$");
	
disableCard("taskapp",fake_task_id);

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid+"/status").set("rejected").then(function () {

dismissCard("taskapp",fake_task_id);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function appRejectDelTask(groupid,taskid) {
	
var fake_task_id = taskid.split("_").join("$");
	
disableCard("deleteapp",fake_task_id);

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid+"/status").set("approved").then(function () {

dismissCard("deleteapp",fake_task_id);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function appApproveDelTask(groupid,taskid) {
	
var fake_task_id = taskid.split("_").join("$");
	
disableCard("deleteapp",fake_task_id);
setTimeout(function() {
	enableCard("deleteapp",fake_task_id);
},0)

showAlert("Are you sure you want to delete this task?","This action cannot be undone.<div style='padding-top: 10px'></div>This task has already been approved. Deleting it will result in all members of the group loosing all points earned towards the task.","confirm",function() {
	appApproveDelTaskReal(groupid,taskid);
	hideAlert();
})
	
}

function appApproveDelTaskReal(groupid,taskid) {
	
var fake_task_id = taskid.split("_").join("$");
	
disableCard("deleteapp",fake_task_id);

firebase.database().ref('groups/'+groupid+"/tasks/"+taskid).set(null).then(function () {

dismissCard("deleteapp",fake_task_id);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

var edittask = false;
var orig_task = false;

function editTask(taskid) {
	
if (edittask !== false) {
	return showAlert("Already editing task","You have another task with unsaved changes. These changes must be saved or discarded before you can edit this task.")
}

edittask = taskid;
orig_task = JSON.parse(JSON.stringify(tasks[taskid] || {}));
hideAlert();

gid("task_"+taskid).querySelector(".task_status").style.display = "none";
gid("task_"+taskid).querySelector(".task_edit").style.display = "block";
gid("task_"+taskid).querySelector(".task_items").classList.add("edit_list");
gid("task_"+taskid).querySelector(".add_item").style.display = "block";

var childs = gid("task_"+taskid).querySelector(".task_items").children;

for (var i = 0; i < childs.length-1; i++) {
	childs[i].querySelector("i").innerHTML = "drag_indicator";
	childs[i].querySelector("textarea").readOnly = false;
}
	
}

function cancelChanges(taskid,nolh) {
	
edittask = false;
hideAlert();

gid("task_"+taskid).querySelector(".task_status").style.display = "block";
gid("task_"+taskid).querySelector(".task_edit").style.display = "none";
gid("task_"+taskid).querySelector(".task_items").classList.remove("edit_list");
gid("task_"+taskid).querySelector(".add_item").style.display = "none";

var childs = gid("task_"+taskid).querySelector(".task_items").children;

for (var i = 0; i < childs.length-1; i++) {
	childs[i].querySelector("i").innerHTML = determineIcon(taskid,childs[i].id.split("item_")[1]);
	childs[i].querySelector("textarea").readOnly = true;
}

if (nolh !== true) {
loadHome();
}
	
}

function submitChanges(taskid) {
	
var adds = 0;
var deletes = 0;
var edits = 0;
var reorder = false;
	
if (orig_task != null && orig_task.items != null) {
for (var i = 0; i < Object.keys(orig_task.items).length; i++) {
	
var citem = orig_task.items[Object.keys(orig_task.items)[i]];
var citemid = Object.keys(orig_task.items)[i];

if (tasks[taskid].items != null && tasks[taskid].items[citemid] != null) {

if (tasks[taskid].items[citemid].pos != citem.pos) {
	reorder = true;
}

if (tasks[taskid].items[citemid].text != citem.text) {
	edits += 1;
}

} else {
	
deletes += 1;
	
}
	
}
}

if (tasks[taskid] != null && tasks[taskid].items != null) {
for (var i = 0; i < Object.keys(tasks[taskid].items).length; i++) {
	
var citem = tasks[taskid].items[Object.keys(tasks[taskid].items)[i]];
var citemid = Object.keys(tasks[taskid].items)[i];

if (orig_task.items != null && orig_task.items[citemid] != null) {

} else {
	
adds += 1;
	
}
	
}
}

if (adds == 0 && deletes == 0 && edits == 0 && reorder == false) {
	return cancelChanges(taskid,true);
}

var summary = "";

if (adds > 0) {
	var adds_s = "s";
	if (adds == 1) {adds_s = ""};
	summary += "Added "+adds+" item"+adds_s+" <span style='color: red'>(-"+adds+" point"+adds_s+")</span><br>";
}

if (deletes > 0) {
	var deletes_s = "s";
	if (deletes == 1) {deletes_s = ""};
	summary += "Removed "+deletes+" item"+deletes_s+" <span style='color: red'>(-"+deletes+" point"+deletes_s+")</span><br>";
}

if (edits > 0) {
	var edits_s = "s";
	if (edits == 1) {edits_s = ""};
	summary += "Edited "+edits+" item"+edits_s+" <span style='color: red'>(-"+edits+" point"+edits_s+")</span><br>";
}

if (reorder) {
	summary += "Item order changed <span style='color: red'>(-1 point)</span><br>";
}

var loss = adds+deletes+edits;
if (reorder) {loss += 1};

var s = "s";
if (loss == 1) {s = ""};

var newval = tasks[taskid].points-loss;
if (newval < 0) {newval = 0};

var s2 = "s";
if (newval == 1) {s2 = ""};

showAlert("Edit items",'This action result in the loss of '+loss+' point value'+s+' for this task<div style="padding-top: 10px"></div>'+summary+'<div style="padding-top: 10px"></div>New value: '+newval+' point'+s2,"confirm",function() {
	
createPostProgress("Updating items")
	
tasks[taskid].points -= loss;
if (tasks[taskid].points < 0) {tasks[taskid].points = 0};

var updarr = {
	"points": newval,
	"items": tasks[taskid].items
}
	
firebase.database().ref("groups/"+userjson.group+"/tasks/"+taskid).update(updarr).then(function(snap) {

hideAlert();
loadHome();
	
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

})

}

var checkitemcurrent = false;

function checkItem(taskid,itemid) {
if (taskid !== edittask && tasks[taskid].status == "approved") {

if (checks && checks.items && checks.items[userjson.group] && checks.items[userjson.group][taskid] && checks.items[userjson.group][taskid][itemid]) {
if (checks.items[userjson.group][taskid][itemid].status == "approved") {
if (checks.items[userjson.group][taskid][itemid].points !== 1) {
	showAlert("Partial completion","This item is considered completed, but you have recieved either partial or no points towards the task")
}
} else {
	showAlert("Pending review...","This item must be reviewed before any points are issued")
}
} else {
	checkitemcurrent = [taskid,itemid];
	openCheckItemScreen();
	gid("check_text").innerHTML = '"'+htmlescape(tasks[taskid].items[itemid].text)+'"';
}

}
}

function openCheckItemScreen() {
	
gid("close_icon").style.display = "block";
gid("menu_icon").style.display = "none";
gid("check_content").style.display = "block";
gid("home_content").style.display = "none";
gid("desc_img").style.display = "block";
gid("file_input").value = null;
gid("desc_imgrender").style.display = "none";
gid("navtitle").innerHTML = "Complete task item";
gid("desctext").value = "";
selected_image = false;
descChange();
	
}

function closeCheckItemScreen() {
	
gid("close_icon").style.display = "none";
gid("menu_icon").style.display = "block";
gid("check_content").style.display = "none";
gid("home_content").style.display = "block";
gid("navtitle").innerHTML = "Projects";
loadHome();
	
}

function descChange() {
	
var len = gid("desctext").value.length;

if (len > 120) {
	gid("desc_char").style.color = "red";
} else {
	gid("desc_char").style.color = "black";
}

gid("desc_char").innerHTML = len+"/120";
	
}

var selected_image = false;
var img_size = false;

function updateDescImages() {

img_size = false;
	
if (document.getElementById('file_input').files.length == 1) {
var thistype = document.getElementById('file_input').files[0].type;
if (thistype == "image/png" || thistype == "image/jpeg" || thistype == "image/gif" || thistype == "image/webp") {
selected_image = document.getElementById('file_input').files[0];
} else {
return showAlert("Error","The following images could not be uploaded because they are not of a supported file format:<div style='padding-top: 10px'></div>"+document.getElementById('file_input').files[0].name.toString().split(",").join("</br>")+"<div style='padding-top: 10px'></div>Supported formats are: png, jpeg, gif, webp.");
}

gid('file_input').value = null;
	
var pendhtml = "<img onclick='discardImage()' id='img_select' style='max-height: 180px; max-width: 100%;' onload='img_size = [gid(\"img_select\").naturalWidth,gid(\"img_select\").naturalHeight]'></img><style scoped='scoped' onload='showImg()'></style>";

gid("desc_imgrender").innerHTML = pendhtml;
gid("desc_imgrender").style.display = "block";
gid("desc_img").style.display = "none";
}
	
}

function showImg() {
	
var reader = new FileReader();
reader.onloadend = function() {
gid("img_select").src = reader.result;
}
reader.readAsDataURL(selected_image);
	
}

function discardImage() {
	
selected_image = false;
img_size = false;
gid("desc_imgrender").style.display = "none";
gid("desc_img").style.display = "block";
	
}

function submitCheck() {
	
if (selected_image && img_size && gid("desctext").value.length > 0) {
	
actualSubmitCheck();
	
} else {
	
var without = "";
if (selected_image == false || img_size == false) {
	without = "image";
}
if (gid("desctext").value.length == 0) {
if (without == "image") {
	without += " or description"
} else {
	without = "description"
}
}
	
showAlert("Submit without "+without+"?",'<textarea style="margin-top:0px" class="c_textarea" placeholder="Why aren\'t you able to provide this evidence?" id="evidencetext" onchange="evidenceChange();" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></textarea><div style="font-size: 20px; padding-top: 2px; text-align: right; color: black;" id="evidence_char">0/120</div>',"submit",function() {
	
if (gid("evidencetext").value.length > 0) {
	
actualSubmitCheck(gid("evidencetext").value);

} else {

gid("evidence_char").style.color = "red";
gid("evidence_char").innerHTML = "This is required";
gid("evidencetext").focus();
	
}
	
});

gid("evidencetext").focus();
	
}
	
}

function evidenceChange() {
	
var len = gid("evidencetext").value.length;

if (len > 120) {
	gid("evidence_char").style.color = "red";
} else {
	gid("evidence_char").style.color = "black";
}

gid("evidence_char").innerHTML = len+"/120";
	
}

function actualSubmitCheck(excuse) {
	
var taskid = checkitemcurrent[0];
var itemid = checkitemcurrent[1];
	
if (selected_image) {
	
createPostProgress("Uploading image");
var file = selected_image;
var ext = selected_image.type.replace("image/","");
var uploadTask = firebase.storage().ref().child('users/'+firebase.auth().currentUser.uid+'/'+itemid+'.'+ext).put(file).then(function(snapshot) {
databaseWrite('https://firebasestorage.googleapis.com/v0/b/tiaaprojecttracker.appspot.com/o/users%2F'+firebase.auth().currentUser.uid+'%2F'+itemid+'.'+ext+'?alt=media');
}).catch(function(error) {showAlert("Error","Error code: "+error.code+"<div style='padding-top: 10px'></div>"+"Server response:</br>"+error.serverResponse)});
	
} else {
	databaseWrite();
}
	
function databaseWrite(imgurl) {
createPostProgress("Submitting");

firebase.database().ref("private_checks/"+firebase.auth().currentUser.uid+"/items/"+userjson.group+"/"+taskid+"/"+itemid).set({
    excuse: excuse || null,
	description: gid("desctext").value || null,
	image: imgurl || null
}).then(
function () {
	
firebase.database().ref("checks/"+firebase.auth().currentUser.uid+"/items/"+userjson.group+"/"+taskid+"/"+itemid+"/status").set("waiting").then(
function () {

hideAlert();
closeCheckItemScreen();
if (!checks) {
	checks = {};
}
if (!checks.items) {
	checks.items = {}
}
if (!checks.items[userjson.group]) {
	checks.items[userjson.group] = {}
}
if (!checks.items[userjson.group][taskid]) {
	checks.items[userjson.group][taskid] = {}
}
checks.items[userjson.group][taskid][itemid] = {
    status: "waiting"
}

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
}
	
}

function determineIcon(taskid,itemid) {
var m_icon = "drag_indicator"
if (tasks[taskid].status == "approved" || tasks[taskid].status == "delete") {
if (checks && checks.items && checks.items[userjson.group] && checks.items[userjson.group][taskid] && checks.items[userjson.group][taskid][itemid]) {
	m_icon = "access_time";
if (checks.items[userjson.group][taskid][itemid].status == "approved") {
if (checks.items[userjson.group][taskid][itemid].points == 1) {
	m_icon = "check_box";
} else {
	m_icon = "indeterminate_check_box";
}
}
} else {
	m_icon = "check_box_outline_blank";
}
}
if (tasks[taskid].status == "pending") {
	m_icon = "check_box_outline_blank";
}
return m_icon;
}

function updateChecks(new_checks) {

checks = new_checks;

for (var i = 0; i < Object.keys(tasks).length; i++) {

var ctask = tasks[Object.keys(tasks)[i]];
var ctaskid = Object.keys(tasks)[i];

if (ctask.status == "approved") {
for (var e = 0; e < Object.keys(ctask.items).length; e++) {

var citem = ctask.items[Object.keys(ctask.items)[e]];
var citemid = Object.keys(ctask.items)[e];

if (gid("item_"+citemid) != null && edittask !== ctaskid) {
gid("item_"+citemid).querySelector("i").innerHTML = determineIcon(ctaskid,citemid);
}

}

point_prog = calcPointsAndProgress(ctaskid);

gid("task_"+ctaskid).querySelector(".task_status").children[0].innerHTML = "Progress: "+Math.round(point_prog[0]*100)+"%";
gid("task_"+ctaskid).querySelector(".task_status").children[1].innerHTML = point_prog[1]+"/"+ctask.points+" <i class='material-icons'>stars</i>";
gid("task_"+ctaskid).querySelector(".task_status").children[2].style = "background: linear-gradient(to right, #1088ff, #ad19d2 "+Math.round(point_prog[0]*100)+"%, #d2d2d2 0%);"

}

}

}

function calcPointsAndProgress(taskid) {
	
var ctask = tasks[taskid];

var progress = 0;
var points = 0;
	
for (var e = 0; e < Object.keys(ctask.items).length; e++) {

var citem = ctask.items[Object.keys(ctask.items)[e]];
var citemid = Object.keys(ctask.items)[e];

if (checks && checks.items && checks.items[userjson.group] && checks.items[userjson.group][taskid] && checks.items[userjson.group][taskid][citemid] && checks.items[userjson.group][taskid][citemid].status) {
	
progress += 1;
points += checks.items[userjson.group][taskid][citemid].points || 0;
	
}

}

if (Object.keys(ctask.items).length > 0) {
return [progress/Object.keys(ctask.items).length,Math.floor((ctask.points/Object.keys(ctask.items).length)*points)]
} else {
return [0,0];
}
	
}

function appApproveItem(groupid,userid,taskid,itemid) {
	
var fakeitemid = itemid.split("_").join("$");
	
disableCard("item",fakeitemid+"!!!!"+userid);
	
showAlert('Approve item','<div style="overflow: hidden; margin-bottom: -10px;"><div class="post_attach" style="margin-bottom: 14px;" onclick="actualApproveItem(\''+groupid+'\',\''+userid+'\',\''+taskid+'\',\''+itemid+'\',1)"><div class="pa_left"><i class="material-icons">stars</i></div><div class="pa_right">Full points</div></div><div class="post_attach" style="margin-bottom: 14px;" onclick="actualApproveItem(\''+groupid+'\',\''+userid+'\',\''+taskid+'\',\''+itemid+'\',0.5)"><div class="pa_left"><i class="material-icons" style="color: #b7b7b7;">stars</i><i class="material-icons" style="width: 16px;overflow: hidden;margin-left: -32px;">stars</i></div><div class="pa_right">Half points</div></div><div class="post_attach" style="margin-bottom: 10px;" onclick="actualApproveItem(\''+groupid+'\',\''+userid+'\',\''+taskid+'\',\''+itemid+'\',0)"><div class="pa_left"><i class="material-icons" style="color: #b7b7b7;">stars</i></div><div class="pa_right">No points</div></div></div>',"cancel",function() {});

setTimeout(function() {
	enableCard("item",fakeitemid+"!!!!"+userid);
},0);
	
}

function actualApproveItem(groupid,userid,taskid,itemid,points) {

hideAlert();

var fakeitemid = itemid.split("_").join("$");
	
disableCard("item",fakeitemid+"!!!!"+userid);

firebase.database().ref('checks/'+userid+"/items/"+groupid+"/"+taskid+"/"+itemid).update({
	status: "approved",
	points: points
}).then(function () {

dismissCard("item",fakeitemid+"!!!!"+userid);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});

}

function appDeclineItem(groupid,userid,taskid,itemid) {
	
var fakeitemid = itemid.split("_").join("$");
	
disableCard("item",fakeitemid+"!!!!"+userid);

firebase.database().ref('checks/'+userid+"/items/"+groupid+"/"+taskid+"/"+itemid).set(null).then(function () {

dismissCard("item",fakeitemid+"!!!!"+userid);

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
}

function proofImgLoaded(img) {
img.nextSibling.style.display = "none";
img.style.height = "";
if (expanded_cards[0] == img.parentElement.parentElement.id) {

img.parentElement.parentElement.style.height = (img.parentElement.clientHeight-12)+"px";

}
}

function imageClick(itemid,userid,imgsrc) {
	
var fakeitemid = itemid.split("_").join("$");

disableCard("item",fakeitemid+"!!!!"+userid);

setTimeout(function() {
	enableCard("item",fakeitemid+"!!!!"+userid);
},0);

window.open(imgsrc, '_blank');
	
}

function loadPoints() {
if (taskRefListenerActive == false) {
checkRef = firebase.database().ref("checks/"+firebase.auth().currentUser.uid);
checkRef.on('value', function(snapshot) {
	checks = snapshot.val();
  if (location.hash == "#points") {
	  loadPoints();
  }
});
taskRefListenerActive = "almost";
}
if (checks) {

gid("points_box").style.display = "none";
gid("pointshistory_box").style.display = "none";
gid("point_load").innerHTML = real_spinner;

firebase.database().ref("groups").once('value').then(function(snapshot) {
	
groups = snapshot.val();
	
gid("points_box").style.display = "block";
gid("pointshistory_box").style.display = "block";
gid("point_load").innerHTML = "";

var pendhtml = "";
var total = 0;
var history_entries = [];

if (checks != null) {

if (checks.points != null) {
for (var i = Object.keys(checks.points).length-1; i > -1; i--) {
if (checks.points[Object.keys(checks.points)[i]].points > 0) {
	history_entries.push([Object.keys(checks.points)[i],'<div class="po_item"><div class="po_left"><div class="truncate">Bonus points</div><div class="truncate">'+checks.points[Object.keys(checks.points)[i]].desc+'</div></div><div class="po_right">'+checks.points[Object.keys(checks.points)[i]].points+'<i class="material-icons">stars</i></div></div>']);
} else {
	history_entries.push([Object.keys(checks.points)[i],'<div class="po_item"><div class="po_left"><div class="truncate">Penalty</div><div class="truncate">'+checks.points[Object.keys(checks.points)[i]].desc+'</div></div><div class="po_right" style="color:red;">'+checks.points[Object.keys(checks.points)[i]].points+'<i class="material-icons" style="color:black;">stars</i></div></div>']);
}
total += checks.points[Object.keys(checks.points)[i]].points;
}
}

for (var i = Object.keys(checks.items).length-1; i > -1; i--) {
	
var cgroupid = Object.keys(checks.items)[i];
	
for (var r = Object.keys(checks.items[cgroupid]).length-1; r > -1; r--) {
	
var ctaskid = Object.keys(checks.items[cgroupid])[r];
var ctask = checks.items[cgroupid][Object.keys(checks.items[cgroupid])[r]];
var this_task_points = 0;

if (ctask) {
for (var e = 0; e < Object.keys(ctask).length; e++) {
	
var citem = ctask[Object.keys(ctask)[e]];
var citemid = Object.keys(ctask)[e];

if (citem.status && citem.points != null) {
this_task_points += citem.points;
}
	
}
}

if (groups && groups[cgroupid] && groups[cgroupid].tasks && groups[cgroupid].tasks[ctaskid]) {
var task_points = Math.floor((groups[cgroupid].tasks[ctaskid].points/Object.keys(groups[cgroupid].tasks[ctaskid].items).length)*this_task_points);

var pen_string = "";
var pen = groups[cgroupid].tasks[ctaskid].points-groups[cgroupid].tasks[ctaskid].orig_points;
if (pen !== 0) {
	pen_string = " <span style='color: red'>("+String(pen)+")</span>";
}

history_entries.push([ctaskid,'<div class="po_item"><div class="po_left"><div class="truncate">'+groups[cgroupid].tasks[ctaskid].name+'</div><div class="truncate">'+groups[cgroupid].tasks[ctaskid].points+'/'+groups[cgroupid].tasks[ctaskid].orig_points+' points possible'+pen_string+'</div></div><div class="po_right">'+task_points+'<i class="material-icons">stars</i></div></div>']);
total += task_points;

}
	
}
}

}

history_entries.sort(function(b, a){
    if(a[0] < b[0]) { return -1; }
    if(a[0] > b[0]) { return 1; }
    return 0;
})

for (var i = 0; i < history_entries.length; i++) {
	pendhtml += history_entries[i][1];
}

if (pendhtml.length > 0) {
	gid("ph_content").innerHTML = pendhtml;
} else {
	gid("ph_content").innerHTML = '<div style="text-align: center;color: gray;padding-top: 18px;padding-bottom: 15px;font-size: 17px;">You haven\'t received any points yet</div>';
}

if (total < 0) {
	total = 0;
}

gid("point_number").innerHTML = total+" points";

}).catch(function(error) {showAlert("Error","Error code: "+error.code)});
	
} else {
gid("points_box").style.display = "none";
gid("pointshistory_box").style.display = "none";
gid("point_load").innerHTML = real_spinner;
}
}

function queueRefresh(num) {

gid("refresh"+num).classList.remove("spin_twice");
window.requestAnimationFrame(function() {
window.requestAnimationFrame(function() {
if (gid("refresh"+num)) {
	gid("refresh"+num).classList.add("spin_twice");
}
})
})
loadQueue();
	
}

var lead_groups;
var lead_users;
var lead_checks;

function loadLeaderboard() {
	
gid("lead_contents").style.display = "none";
gid("lead_loader").style.display = "block";
	
firebase.database().ref("groups").once('value').then(function(snapshot) {
lead_groups = snapshot.val();
firebase.database().ref("users").once('value').then(function(snapshot) {
lead_users = snapshot.val();
firebase.database().ref("checks").once('value').then(function(snapshot) {
lead_checks = snapshot.val();

gid("lead_loader").style.display = "none";
gid("lead_contents").style.display = "block";
loadLead(1);

})//.catch(function(error) {showAlert("Error","Error code: "+error.code)});
})//.catch(function(error) {showAlert("Error","Error code: "+error.code)});
})//.catch(function(error) {showAlert("Error","Error code: "+error.code)});

}

function loadLead(tab) {

gid("tab_1").classList.remove("active_tab");
gid("tab_2").classList.remove("active_tab");
gid("tab_"+tab).classList.add("active_tab");

var userpoints_array = [];

if (lead_users != null) {
for (var o = 0; o < Object.keys(lead_users).length; o++) {
	
var userid = Object.keys(lead_users)[o];

if (lead_users[userid].admin == "admin") {
	continue;
}
	
var total = 0;

if (lead_checks != null && lead_checks[userid] != null) {
if (lead_checks[userid].points != null) {
for (var i = Object.keys(lead_checks[userid].points).length-1; i > -1; i--) {
	total += lead_checks[userid].points[Object.keys(lead_checks[userid].points)[i]].points;
}
}

for (var i = Object.keys(lead_checks[userid].items).length-1; i > -1; i--) {
	
var cgroupid = Object.keys(lead_checks[userid].items)[i];
	
for (var r = Object.keys(lead_checks[userid].items[cgroupid]).length-1; r > -1; r--) {
	
var ctaskid = Object.keys(lead_checks[userid].items[cgroupid])[r];
var ctask = lead_checks[userid].items[cgroupid][Object.keys(lead_checks[userid].items[cgroupid])[r]];
var this_task_points = 0;

if (ctask) {
for (var e = 0; e < Object.keys(ctask).length; e++) {
	
var citem = ctask[Object.keys(ctask)[e]];
var citemid = Object.keys(ctask)[e];

if (citem.status && citem.points != null) {
this_task_points += citem.points;
}
	
}
}

if (lead_groups && lead_groups[cgroupid] && lead_groups[cgroupid].tasks && lead_groups[cgroupid].tasks[ctaskid]) {
var task_points = Math.floor((lead_groups[cgroupid].tasks[ctaskid].points/Object.keys(lead_groups[cgroupid].tasks[ctaskid].items).length)*this_task_points);

total += task_points;
}
	
}
}
}

if (total < 0) {
	total = 0;
}

userpoints_array.push([userid,total]);
	
}
}

if (tab == 1) {
function pointSort(a,b) {
	return b[1] - a[1];
}
userpoints_array = userpoints_array.sort(pointSort);

var pendhtml = "";
var this_position = 0;
var last_score = -1;
	
for (var i = 0; i < userpoints_array.length; i++) {

if (userpoints_array[i][1] < last_score || last_score == -1) {
	this_position += 1;
}

last_score = userpoints_array[i][1];

var bold_string = "";
if (userjson && userjson.verified && userpoints_array[i][0] == firebase.auth().currentUser.uid) {
	bold_string = " style='font-weight:bold;' "
}

pendhtml += '<div class="lead_user"'+bold_string+'><div>#'+this_position+'</div><div><img src="'+lead_users[userpoints_array[i][0]].picture.split("/mo/").join("/s84/")+'"></div><div>'+lead_users[userpoints_array[i][0]].name+'</div><div>'+userpoints_array[i][1]+'<i class="material-icons">stars</i></div></div>';
	
}
}
if (tab == 2) {
var pendhtml = "";

var groups_points = [];
var group_positions = {};

for (var i = 0; i < userpoints_array.length; i++) {

if (group_positions[lead_users[userpoints_array[i][0]].group] != null) {
groups_points[group_positions[lead_users[userpoints_array[i][0]].group]][1] += userpoints_array[i][1];
} else {
group_positions[lead_users[userpoints_array[i][0]].group] = groups_points.length;
groups_points.push([lead_users[userpoints_array[i][0]].group,userpoints_array[i][1]]);
}
	
}

function point2Sort(a,b) {
	return b[1] - a[1];
}
groups_points = groups_points.sort(point2Sort);

var this_position = 0;
var last_score = -1;

for (var i = 0; i < groups_points.length; i++) {
if (groups_points[i][1] < last_score || last_score == -1) {
	this_position += 1;
}

last_score = groups_points[i][1];

var bold_string = "";
if (userjson && userjson.verified && groups_points[i][0] == userjson.group) {
	bold_string = " style='font-weight:bold;' "
}

pendhtml += '<div class="lead_user"'+bold_string+'><div>#'+this_position+'</div><div><i class="material-icons" style="font-size: 42px;">groups</i></div><div>'+lead_groups[groups_points[i][0]].name+'</div><div>'+groups_points[i][1]+'<i class="material-icons">stars</i></div></div>'
}
	
}

gid("lead_box").innerHTML = pendhtml;
	
}