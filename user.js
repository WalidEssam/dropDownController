
var arrOfData = [
    {
        'id': 1, 'name': "parent1",
        childrens: [
            { 'id': 2, 'name': "امانة اسيوط" },
            { 'id': 3, 'name': "امانة المنصورة" },
            { 'id': 4, 'name': "6امانة القاهرة" },
        ]
    },
    { 'id': 5, 'name': "parent2" },
    {
        'id': 6, 'name': "parent3",
        childrens: [
            { 'id': 7, 'name': "امانة الاقصر" },
        ]
    },
]

var dropDownObject = {
    divId: "dropDownDiv",
    data: arrOfData,
    isSearchable: true,
    isTree: true,
    hasMultiSelect: true,
    onChange: function (selectedOptionsArr) {
        console.log(selectedOptionsArr);
    }
}
var dropDownObject1 = {
    divId: "dropDownDiv1",
    data: arrOfData,
    isSearchable: false,
    isTree: false,
    hasMultiSelect: false,
    onChange: function (selectedOptionsArr) {
        console.log(selectedOptionsArr);
    }
}
var dropDownObject2 = {
    divId: "dropDownDiv2",
    data: arrOfData,
    isSearchable: true,
    isTree: false,
    hasMultiSelect: false,
}
var dropDownObject3 = {
    divId: "dropDownDiv3",
    data: arrOfData,
    isSearchable: true,
    isTree: true,
    hasMultiSelect: false,
}
var dropDownObject4 = {
    divId: "dropDownDiv4",
    data: arrOfData,
    isSearchable: false,
    isTree: false,
    hasMultiSelect: true,
}

dropDownList.initalization(dropDownObject);
dropDownList.initalization(dropDownObject1);
// dropDownList.initalization(dropDownObject2);
// dropDownList.initalization(dropDownObject3);
// dropDownList.initalization(dropDownObject4);

// set default selected values functions 
dropDownList.setDefaultSelectedValues('dropDownDiv', [1, 3]);









