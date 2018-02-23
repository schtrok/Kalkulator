$(document).ready(function(){

	var screenDown, screenUp, operation = "", i, count, temp, input, myJSON="", JSONcount=0, temp2, myObj, server_response, x;
 
	screenDown = document.getElementById("zaslon_down");
	screenUp = document.getElementById("zaslon_up");
	screenUp.innerHTML = "&nbsp";
	screenDown.innerHTML = "&nbsp";
	server_response = document.getElementById("server_response");
	//localStorage.setItem("myJSON", myJSON);
	
	//adds character to screenDown
	function input(character) {
		removeNbsp();
		screenDown.innerHTML += character;
	}
	
	//is operator allowed, if yes calls input
	function checkOperator(character) {
		if (character=="=") {
			equal();
		}
		else if(screenDown.innerHTML.endsWith(")") || isNumber()) {
			input(character);
		}
		else error();
	}
	
	//is "-" allowed, if yes calls input
	function checkNegative() {
		if(screenDown.innerHTML=="&nbsp;") {
			removeNbsp();
			input("-");
		}
		else if (isNumber() || screenDown.innerHTML.charAt(screenDown.innerHTML.length-1)=="(" || screenDown.innerHTML.charAt(screenDown.innerHTML.length-1)==")") {
			input ("-");
		}
		else error();
	}
	
	//is "." point allowed, if yes calls input
	function checkDecimal() {
		if(screenDown.innerHTML=="&nbsp;" || !isNumber()) {
			error();
		}
		else {
			for(i=screenDown.innerHTML.length-1; i>=-1; i--) {
				if(i==-1) {
					input(".");
					break;
				}
				if(screenDown.innerHTML.charCodeAt(i)<48||screenDown.innerHTML.charCodeAt(i)>57) {
					if (screenDown.innerHTML.charAt(i)!=".") {
						input(".");
						break;
					}
					else {
						error();
						break;
					}
				}
			}
		}
	}
	
	//is number allowed, if yes calls input
	function checkNumber(character) {
		if(screenDown.innerHTML=="&nbsp;") {
			removeNbsp();
			input(character);
		}
		//ako je zadnji char ")" ili samostojeća 0 onda 
		else if (checkZero()) {
			DEL ();
			input (character);
		}
		else if (screenDown.innerHTML.charAt(screenDown.innerHTML.length-1)!=")") {
			input (character);
		}
		else {
			error();
		}
	}
	
	//is "(" point allowed, if yes calls input
	function checkLeft() {
		var temp=screenDown.innerHTML.charAt(screenDown.innerHTML.length-1);
		if(screenDown.innerHTML=="&nbsp;") {
			removeNbsp();
			input("(");
		}
		else if (temp=="/"||temp=="*"||temp==":"||temp=="-"||temp=="("||temp=="+") {
			input("(");
		}
		else {
			error();
		}
	}
	
	//is ")" point allowed, if yes calls input
	function checkRight() {
		if(screenDown.innerHTML=="&nbsp;") {
			error();
		}
		else if ((screenDown.innerHTML.charAt(screenDown.innerHTML.length-1)==")") || isNumber()) {
			count=0;
			
			for(i=0; i<screenDown.innerHTML.length; i++) {
				if (screenDown.innerHTML.charAt(i)=="(") {
					count++;
				}
				if (screenDown.innerHTML.charAt(i)==")") {
					count--;
				}
			}
			if (count>0) {
				input (")");
			}
			else {
				error();
			}
		}
		else {
			error();
		}
	}
	
	//if there is a zero not preceded by a number return true
	function checkZero() {
		if (screenDown.innerHTML.endsWith("0")) {
				if (screenDown.innerHTML.charCodeAt(screenDown.innerHTML.length-2)>47&&screenDown.innerHTML.charCodeAt(screenDown.innerHTML.length-2)<58) {
					return false;
				}
				else {
					return true;
				}
		}
		else {
			return false;
		}
	}
	
	//clear both screens
	function AC () {
		screenDown.innerHTML = "&nbsp";
		screenUp.innerHTML = "&nbsp";
	}
	
	//delete the last character on screenDown
	function DEL () {
		screenDown.innerHTML = screenDown.innerHTML.slice(0,-1);
		setNbsp();
	}
	
	//returns true if the last character in screenDown is a number
	function isNumber() {
		if (screenDown.innerHTML.charCodeAt(screenDown.innerHTML.length-1)>47&&screenDown.innerHTML.charCodeAt(screenDown.innerHTML.length-1)<58) {
			return true;
		}
		else {
			return false;
		}
	}
	
	//called when "=" is clicked, starts the evaluation of expression
	function equal() {
		count=0;
		operation=screenDown.innerHTML;
		temp=operation.charAt(operation.length-1)
		debugger;
		if(temp=="/" || temp=="-" || temp=="+" || temp=="*") operation = operation.slice(0, -1);
		for(i=0; i<operation.length; i++) {
			if (operation.charAt(i)=="(") count++;
			if (operation.charAt(i)==")") count--;
		}
		for(i=0; i<count; i++) {
			input(")");
		}
		AC();
		screenUp.innerHTML=operation + "=" + calculate(operation);
		JSON(operation);
	}
	//animate screenDown to signal an error during input occurred
	function error() {
	$("#zaslon_down").css("background-color", "#ffb3b3");
	$("#zaslon_down").animate({backgroundColor: "white"}, 100);
	}
	
	//remove "&nbsp" form the start of screenDown
	function removeNbsp () {
		if (screenDown.innerHTML == "&nbsp;") screenDown.innerHTML = "";
	}
	
	//set "&nbsp" to the start of screenDown
	function setNbsp () {
		if (screenDown.innerHTML == "") screenDown.innerHTML = "&nbsp";
	}
	
	//button click event listener
	$("#container").click(function(){
		switch(event.target.className) {
			case "operator": 
				checkOperator(event.target.innerHTML);
				break;
			case "negative":
				checkNegative();
				break;
			case "decimal":
				checkDecimal();
				break;
			case "number":
				checkNumber(event.target.innerHTML);
				break;
			case "leftParent":
				checkLeft();;
				break;
			case "rightParent":
				checkRight();
				break;
			case "DEL":
				DEL();
				break;
			case "AC":
				AC();
				break;
			case "fetch":
				print();
				break;
			case "clear_saved":
				clear_saved();
				break;
			default:
				break;
		}
	});
	
	$("body").keypress(function(){
		x=event.charCode;
		switch(true) {
			case (x==47 || x==42 || x==43):
				checkOperator(String.fromCharCode(x));
				break;
			case (x==45):
				checkNegative();
				break;
			case (x==44||x==46):
				checkDecimal();
				break;
			case (x>47&&x<58):
				checkNumber(String.fromCharCode(x));
				break;
			case (x==40):
				checkLeft();;
				break;
			case (x==41):
				checkRight();
				break;
			case (x==13):
				equal();
				break;
			default:
				break;
		}
	});
	
	$("body").keydown(function(){
		if(event.keyCode==8) DEL();
	});
	// pretvara izraz u postfix notaciju a zatim računa korištenjem postfix notacije
	function calculate (input) {
		var b, a, i, topToken;
		
		//implementacija stoga
		var stack=[];

		//implementacija liste
		var lista=[];
		
		//parsanje izraza - koverzija string -> array, dodavanje 0 ispred znaka "-" - negative
		b="";
		var izraz=[];
		for (i=0; i<input.length; i++) {
			a=input.charAt(i);
			if((i==0 && a=="-") ||(isNaN(input.charAt(i-1))&&a=="-")) izraz.push("0");
			if(!isNaN(a)||a==".") {
				b+=a;
			}
			else {
				if(b!="") {
				izraz.push(b);
				b="";
				}
				izraz.push(a);
			}
			if(b!="" && i==input.length-1) {
				izraz.push(b);
			}
		}		
		//konverzija infix zapisa u postfix
		for (i=0; i<izraz.length; i++) {
			a=izraz[i];
			if(!isNaN(a)) {
				//debugger;
				lista.push(a);
			}
			else {
				switch(a) {
					case "*":
						//debugger;
						topToken = stack[stack.length-1];
						if(topToken == "*" || topToken == "/")
							{
								while (topToken == "*" || topToken == "/") {
									lista.push(stack.pop());
									topToken = stack[stack.length-1];
								}
								stack.push(a);
							}
						else {
							stack.push(a);
						}
						//debugger;
						break;
					case "/":
						//debugger;
						topToken = stack[stack.length-1];
						if(topToken == "*" || topToken == "/")
							{
								while (topToken == "*" || topToken == "/") {
									lista.push(stack.pop());
									topToken = stack[stack.length-1];
								}
								stack.push(a);
							}
						else {
							
							stack.push(a);
						}
						//debugger;
						break;
					case "+":
						//debugger;
						topToken = stack[stack.length-1];
						//debugger;
						while (stack.length!=0 && topToken!="(") {
							//debugger;
							lista.push(stack.pop());
							topToken = stack[stack.length-1];
						}
						//debugger;
						stack.push(a);
						//debugger;
						break;
					case "-":
						//debugger;
						topToken = stack[stack.length-1];
						while (stack.length!=0 && topToken!="(") {
							lista.push(stack.pop());
							topToken = stack[stack.length-1];
						}
						stack.push(a);
						//debugger;
						break;
					case "(":
						//debugger;
						stack.push(a);
						//debugger;
						break;
					case ")":
						//debugger;
						topToken = stack.pop();
						while (topToken != "(" && stack.length!=0) {
							lista.push(topToken);
							topToken = stack.pop();
						}
						//debugger;
						break;
				}
			}
		}
		a = stack.length;
		for (i=0; i<a; i++) {
			lista.push(stack.pop());
		}
		//evaluacija postfix izraza - čišćenje stacka, čitanje s liste u kojoj je postfix zapis
		stack = [];
		a = lista.length;
		var k, j;
		
		for(i=0; i<a; i++) {
			b = lista[i];
			if(!isNaN(b)) {
				stack.push(b);
			}
			else {
				switch(b) {
					case "*":
						k = parseFloat(stack.pop());
						j= parseFloat(stack.pop());
						stack.push(j*k);
						break;
					case "/":
						k = parseFloat(stack.pop());
						j= parseFloat(stack.pop());
						stack.push(j/k);
						break;
					case "+":
						k = parseFloat(stack.pop());
						j= parseFloat(stack.pop());
						stack.push(j+k);
						break;
					case "-":
						k = parseFloat(stack.pop());
						j= parseFloat(stack.pop());
						stack.push(j-k);
						break;
				}
			}
		}
		return stack.join("");
	}
	
	//spremanje u JSON formatu
	function JSON(input) {
		myJSON = localStorage.myJSON;
		localStorage.removeItem("myJSON");
		if (myJSON=="") {
			JSONcount=1;
			myJSON = "{";
		}
		else {
			console.log(myJSON);
			temp2 = Object.keys(jQuery.parseJSON(myJSON));
			JSONcount=temp2.length+1;
			myJSON = myJSON.substring(0, myJSON.length - 1);
			myJSON+=",";
		}
		myJSON+='"'+JSONcount+'":{"operacija":"'+input+'","rezultat":"'+calculate(input)+'"}}';
		localStorage.setItem("myJSON", myJSON);
	}
	
	function print() {
		document.getElementById("operations").innerHTML= localStorage.myJSON;
		temp2="";
		myObj = jQuery.parseJSON(localStorage.myJSON);
		for (i in myObj) {
			temp2 += myObj[i].operacija + "=" + myObj[i].rezultat + "<br>";
		}
		document.getElementById("operations2").innerHTML=temp2;
	}
	
	function clear_saved() {
		localStorage.removeItem("myJSON");
		myJSON="";
		localStorage.setItem("myJSON", myJSON);
		document.getElementById("operations2").innerHTML="";
		print();
	}
	
	//slanje u .php skriptu
	$("#sendphp").click(function(){
		if(localStorage.myJSON != "") {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					server_response.innerHTML = this.responseText;
				}
				else if(this.status!=200) server_response.innerHTML = "Error"; 
			};
			xhttp.open("GET", "skripta.php?q=" + localStorage.myJSON, true);
			xhttp.send();
		}
	});
});
//preostaje implementirati spremanje i ispis operacija u JSON formatu