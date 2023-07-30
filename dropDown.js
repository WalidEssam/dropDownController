var dropDownList = {

	initalization: function (dropDownObject) {

		var modiFiedObject = dropDownList.validateDropDownObject(dropDownObject);
		if (modiFiedObject)
			dropDownList.drawStructure(modiFiedObject);
		else
			alert("invalid dropDown Object");
	},
	drawStructure: function (modiFiedObject) {
		var elementId = modiFiedObject.divId;
		// create dropDown Btns And dropDown Menu Div
		var dropDownMenu = dropDownList.createDropDownBtnAndDropDownMenuDiv(elementId);

		if (modiFiedObject.isSearchable)
			dropDownList.createSearch(dropDownMenu, elementId);

		// create dropDown options
		dropDownList.createDropdownOptions(elementId, modiFiedObject.data, modiFiedObject.hasMultiSelect, modiFiedObject.isTree,modiFiedObject.onChange);


		// add event to close dropdown when click outside dropdown button
		document.addEventListener("click", function (event) {
			var dropdownBtn = document.getElementById(elementId + "_Btn_Id");
			var dropdownMenu = document.getElementById(elementId + "_DropDown_Menu_Id");
			if (event.target !== dropdownBtn && !dropdownMenu.contains(event.target))
				dropdownMenu.style.display = "none";
		});
	},
	createDropDownBtnAndDropDownMenuDiv: function (elementId) {
		var dropdownDiv = document.getElementById(elementId);
		var dropDownBtn = document.createElement("div");

		dropDownBtn.className = "dropDownDiv_Btn btn btn-primary";
		dropDownBtn.id = elementId + "_Btn_Id";
		dropDownBtn.innerText = "اختر الادارة ↓";

		var dropDownMenu = document.createElement("div");
		dropDownMenu.classList.add("dropDownDiv_DropDown_Menu");
		dropDownMenu.classList.add("scrollable");
		dropDownMenu.id = elementId + "_DropDown_Menu_Id";
		dropDownMenu.style.overflow=scroll;
		dropDownBtn.addEventListener('click', function () { dropDownList.toggleDropdown(dropDownMenu) })

		dropdownDiv.appendChild(dropDownBtn);
		dropdownDiv.appendChild(dropDownMenu);

		return dropDownMenu;
	},
	createDropdownOptions: function (elementId, dropdownOptions, allowMultipleSelection, isTree ,onChange) {

		var dropdownDiv = document.getElementById(elementId);
		var dropDownBtn = document.getElementById(elementId + "_Btn_Id");
		var dropDownMenu = document.getElementById(elementId + "_DropDown_Menu_Id");

		if (allowMultipleSelection)
			dropDownList.drawSellectAndDesellectBtns(dropDownMenu, elementId);

		dropdownOptions.forEach((option) => {

			var optionDiv = document.createElement("div");
			optionDiv.classList.add("dropDownDiv_DropDown_Menu_Items");

			var parentDiv = document.createElement("div");
			parentDiv.classList.add("dropDownDiv_DropDown_Menu_Item");
			parentDiv.id = elementId + "_DropDown_Menu_Item_Parent";

			var parentLabel = document.createElement("label");
			parentLabel.textContent = option.name;
			parentLabel.setAttribute("id", option.id);
			parentLabel.setAttribute("value", option.name);
			//console.log("PARENT");
			parentDiv.appendChild(parentLabel);
			optionDiv.appendChild(parentDiv);

			if (allowMultipleSelection)
				dropDownList.createCheckBoxes(option, parentDiv, elementId,onChange);
			else
				parentDiv.onclick = () => { dropDownList.selectOption(parentDiv, dropDownMenu, dropDownBtn, elementId,onChange); };

			// if has children
			if (option.hasOwnProperty('childrens') && isTree) {
				option.childrens.forEach((children) => {
					//console.log("__ CHILDREN NUM"+children.id);
					var childOptionDiv = document.createElement("div");
					childOptionDiv.classList.add("dropDownDiv_DropDown_Menu_Item");
					childOptionDiv.id = elementId + "_DropDown_Menu_Item_Children";

					var childrenLabel = document.createElement("label");
					childrenLabel.textContent = children.name;
					childrenLabel.classList.add("childLabel");
					childrenLabel.setAttribute("id", children.id);
					childrenLabel.setAttribute("value", children.name);
					childOptionDiv.appendChild(childrenLabel);
					optionDiv.appendChild(childOptionDiv);

					if (allowMultipleSelection)
						dropDownList.createCheckBoxes(children, childOptionDiv, elementId,onChange)
					else
						childOptionDiv.onclick = () => { dropDownList.selectOption(childOptionDiv, dropDownMenu, dropDownBtn, elementId,onChange); };
				});
			}

			dropDownMenu.appendChild(optionDiv);
			dropdownDiv.appendChild(dropDownBtn);
		});
	},
	createCheckBoxes: function (option, optionDiv, elementId,onChange) {
		var optioncheck = null;
		optioncheck = document.createElement("input");
		optioncheck.type = "checkbox";
		optioncheck.name = "option";

		var dropDownBtn = document.getElementById(elementId + "_Btn_Id");
		optioncheck.value = option.name;
		optioncheck.id = option.id;
		var selectedClass = "selectedDiv";

		optioncheck.addEventListener('change', function () {
			var parentDiv = optioncheck.closest('.dropDownDiv_DropDown_Menu_Item');
			parentDiv.classList.toggle(selectedClass);
			dropDownList.writeCheckBoxesValuesToBtn(dropDownBtn, elementId);
			var selectedValuesArr=dropDownList.getSelected(elementId);
			onChange(selectedValuesArr);
		});

		optionDiv.appendChild(optioncheck);
	},
	drawSellectAndDesellectBtns: function (dropDownMenu, elementId) {

		var dropDownBtn = document.getElementById(elementId + "_Btn_Id");
		// create select all btn
		var selectAllBtn = document.createElement("button");
		selectAllBtn.classList.add("dropDownDiv_Btn_Select");
		selectAllBtn.id = elementId + "_Btn_Select";
		selectAllBtn.textContent = 'اختيار الكل';
		selectAllBtn.addEventListener('click', function () { dropDownList.selectCheckboxesToggle(dropDownBtn, elementId, true); })
		// create deselect all btn
		var deselectAllBtn = document.createElement("button");
		deselectAllBtn.value = 'deselectAllBtn';
		deselectAllBtn.classList.add("dropDownDiv_Btn_Deselect");
		deselectAllBtn.id = elementId + '_Btn_Deselect';
		deselectAllBtn.textContent = "الغاء الاختيار";
		deselectAllBtn.addEventListener('click', function () { dropDownList.selectCheckboxesToggle(dropDownBtn, elementId, false); })
		// append btns
		dropDownMenu.appendChild(deselectAllBtn);
		dropDownMenu.appendChild(selectAllBtn);

	},
	createSearch: function (dropDownMenu, elementId) {

		var searchInput = document.createElement("input");
		searchInput.id = elementId + '_SearchInput';
		dropDownMenu.appendChild(searchInput);

		searchInput.addEventListener("input", function () {
			dropDownList.searchAccordingToInput(searchInput, elementId);
		});

	},
	searchAccordingToInput: function (searchInput, elementId) {
		var filter = searchInput.value.toLowerCase();
		var divElementId = document.getElementById(elementId + "_DropDown_Menu_Id");
		var dropdownItems = divElementId.querySelectorAll(".dropDownDiv_DropDown_Menu_Item");

		dropdownItems.forEach((item) => {
			var label = item.querySelector("label");
			var labelText = label.textContent.toLowerCase();
			if (labelText.includes(filter)) {
				// Get the grandparent element of the label by its ID
				var grandparent = label.parentElement.parentElement.firstChild;
				item.style.display = grandparent.style.display = "block";
			}
			else
				item.style.display = "none";

		});
	},
	toggleDropdown: function (dropDownMenu) {
		dropDownMenu.style.display = dropDownMenu.style.display === "block" ? "none" : "block";
	},
	selectOption: function (parentDiv, dropDownMenu, dropDownBtn, elementId,onChange) {

		var selectedClass = "selectedDiv";
		var previousSelectedOption = dropDownMenu.querySelector('.' + selectedClass);

		if (previousSelectedOption)
			previousSelectedOption.classList.remove(selectedClass);

		parentDiv.classList.add(selectedClass);

		var childElement = parentDiv.querySelector(':first-child');
		if (childElement)
			dropDownBtn.textContent = childElement.textContent.trim();
		else
			dropDownBtn.textContent = parentDiv.textContent.trim();// If there are no child elements

		onChange(dropDownList.getSelected(elementId));
		
		dropDownList.toggleDropdown(dropDownMenu);

	},
	selectCheckboxesToggle: function (dropdownBtn, elementId, flage) {

		var dropDownMenu = document.getElementById(elementId + "_DropDown_Menu_Id");
		var checkboxes = dropDownMenu.querySelectorAll('input[type="checkbox"]');
		var selectedClass = "selectedDiv";

		checkboxes.forEach((checkbox) => {
			var parentDiv = checkbox.closest('.dropDownDiv_DropDown_Menu_Item');

			checkbox.checked = flage;

			if (flage)
				parentDiv.classList.add(selectedClass);
			else
				parentDiv.classList.remove(selectedClass);

			dropDownList.writeCheckBoxesValuesToBtn(dropdownBtn, elementId);
		});

	},
	writeCheckBoxesValuesToBtn: function (btnToDisplayOn, elementId) {

		var arrOfSelected = dropDownList.getSelected(elementId);
		var allCheckBoxesValues = "";

		arrOfSelected.forEach(function (object) {
			allCheckBoxesValues += object.value + ",";
		});
		(allCheckBoxesValues.length === 0) ? btnToDisplayOn.textContent = 'اختر الادارة ↓' : btnToDisplayOn.textContent = `Selected: ${allCheckBoxesValues}`;

	},
	setDefaultSelectedValues: function (elementId, arrOfDefaultSelectedOptionsIds) {

		if(document.getElementById(elementId))
		{
			var dropDownBtn = document.getElementById(elementId + "_Btn_Id");
			var dropDownMenu = document.getElementById(elementId + "_DropDown_Menu_Id");
			var checkboxes = dropDownMenu.querySelectorAll('input[type="checkbox"]');
			var selectedClass = "selectedDiv";
	
			checkboxes.forEach((checkbox) => {
	
				if (arrOfDefaultSelectedOptionsIds != undefined && arrOfDefaultSelectedOptionsIds.length > 0) {
					if (arrOfDefaultSelectedOptionsIds.includes(parseInt(checkbox.id))) {
						var parentDiv = checkbox.closest('.dropDownDiv_DropDown_Menu_Item');
						checkbox.checked = true
						parentDiv.classList.add(selectedClass);
					}
				}
	
				dropDownList.writeCheckBoxesValuesToBtn(dropDownBtn, elementId);
	
			});
			
		}

	},
	validateDropDownObject: function (dropDownObject) {

		var modiFiedObject = {};
		if (typeof dropDownObject !== 'object' || dropDownObject === null)
			return false;

		// Check 'diId' property
		if (!document.getElementById(dropDownObject.divId) || !dropDownObject.hasOwnProperty('divId') || typeof dropDownObject.divId !== 'string' || dropDownObject.divId.trim().length === 0)
			return false;

		modiFiedObject.divId = dropDownObject.divId;

		// Check 'data' property
		if (!dropDownObject.hasOwnProperty('data') || !Array.isArray(dropDownObject.data) || !dropDownObject.data.length >= 1)
			return false;


		// Check each item in 'data', 'id', and 'name' array
		for (var item of dropDownObject.data) {
			if (typeof item !== 'object' || item === null || !Number.isInteger(item.id) || item.id < 1 || typeof item.name !== 'string' || item.name.trim().length === 0)
				return false;

			// Check 'childrens' property if present
			if (item.childrens) {

				if (Array.isArray(item.childrens)) {
					
					for (var child of item.childrens) {

						if (!child.hasOwnProperty('id') || typeof child.id !== 'number' || !child.hasOwnProperty('name') || typeof child.name !== 'string' || child.name.trim() === '')
							return false;
					}
 
				} else
					return false;
			}

		}

		modiFiedObject.data = dropDownObject.data;

		// Check 'isSearchable' property if present
		modiFiedObject.isSearchable = dropDownList.checkIfHasProperty(dropDownObject, 'isSearchable') && typeof dropDownObject.isSearchable == 'boolean'
			? dropDownObject.isSearchable : false;

		// Check 'isTree' property if present
		modiFiedObject.isTree = dropDownList.checkIfHasProperty(dropDownObject, 'isTree') && typeof dropDownObject.isTree == 'boolean'
			? dropDownObject.isTree : false;


		// Check 'hasMultiSelect' property if present
		modiFiedObject.hasMultiSelect = dropDownList.checkIfHasProperty(dropDownObject, 'hasMultiSelect') && typeof dropDownObject.hasMultiSelect == 'boolean'
			? dropDownObject.hasMultiSelect : false;

		// Check 'onChange' property if present
		modiFiedObject.onChange = dropDownList.checkIfHasProperty(dropDownObject, 'onChange') && typeof dropDownObject.onChange === 'function'
			? dropDownObject.onChange : false;

		// All checks passed
		return modiFiedObject;
	},
	checkIfHasProperty: function (objectToSearchIn, propertyName) {
		if (objectToSearchIn.hasOwnProperty(propertyName)) return true;
		else return false;
	},
	getSelected: function (elementId) {

		if(document.getElementById(elementId))
		{
			var dropDownMenu = document.getElementById(elementId + "_DropDown_Menu_Id");
			var selectedDiv = dropDownMenu.querySelectorAll(".selectedDiv");
			var arrOfSelectedOptiones = [];
			var object;

			selectedDiv.forEach(element => {
				var childElement = element.querySelector(':first-child');
				object = { id: childElement.id, value: childElement.getAttribute('value') };
				arrOfSelectedOptiones.push(object);
			});

			return arrOfSelectedOptiones;
		}

	},
}

