function eraseFalseBreaks(){ // Elimine les faux sauts de ligne de Methode
	var txtAreaRaw = document.getElementById('bodytext').value;
	txtAreaRaw = txtAreaRaw.replace(/\n([a-z])/g, " $1");
	document.getElementById('bodytext').value = txtAreaRaw;
}

function tete(){ // Mise en gras avec espacement
	eraseFalseBreaks();
	var txtArea = document.getElementById('bodytext');
	var txtNew = "";
	var arr = txtArea.value.split("\n");

	for (i=0;i<arr.length;i++){
		if(arr[i] == ""){
			txtNew += arr[i] + '\n'; 			// Paragraphe vide: on passe
		}else{
			if(!arr[i].match(/\./g)){ // Si pas de point dans le paragraphe
				txtNew += "<b>" + arr[i] + "</b>\n";
			}else{
				txtNew += arr[i] + "\n";
				//arr[i].replace(/a/g, "BR") +
			}
		}
	}
	txtArea.value = txtNew;
	check();
}
tete();
