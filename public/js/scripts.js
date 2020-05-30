
let ingredCount = 5;
let instructCount = 5;
/*
Get all elements in suggestion list and event listner. When user 
clicks a suggestion it autofills the search box.
*/
let suggestionsList = document.getElementsByClassName('suggestions');

for (let i = 0; i < suggestionsList.length; i++){
	suggestionsList[i].addEventListener('click', function(){
		let text = this.textContent;
		document.getElementById('recipeSearch').value = text;
	});
}

function goBack(){
	window.history.back();
}

function addMoreIngredientFields(){
	for (let i = 1; i <= 5; i++){
		let newDiv = document.createElement('div');
		newDiv.setAttribute('class', 'form-group');

		let newAmount = document.createElement('input');
		let newAmountName = 'amount' + (ingredCount + i);
		newAmount.setAttribute('type', 'text');
		newAmount.setAttribute('name', newAmountName);

		let newName = document.createElement('input');
		let newNameName = 'name' + (ingredCount + i);
		newName.setAttribute('type', 'text');
		newName.setAttribute('name', newNameName);

		newDiv.appendChild(newAmount);
		newDiv.appendChild(newName);

		document.getElementById('ingredForm').appendChild(newDiv);
	}	
	ingredCount += 5;
}

function addMoreInstructionFields(){
	for (let i = 1; i <= 5; i++){
		let newDiv = document.createElement('div');
		newDiv.setAttribute('class', 'form-group');

		let newStep = document.createElement('input');
		let newStepName = 'step' + (instructCount + i);
		let newStepPlace = 'step ' + (instructCount + i);
		newStep.setAttribute('type', 'text');
		newStep.setAttribute('name', newStepName);
		newStep.setAttribute('placeholder', newStepPlace);

		newDiv.appendChild(newStep);

		document.getElementById('instructForm').appendChild(newDiv);
	}	
	instructCount += 5;
}