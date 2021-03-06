let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function() {
        if (name.value.length == 0) {
            setTextValue('.text-error', "");
            return;
        }
        try {
            // (new EmployeePayrollData()).name = name.value;
            checkName(name.value);
            setTextValue('.text-error', "");
        } catch (e) {
            setTextValue('.text-error', e);
        }
    });

    const date = document.querySelector('#date');
    date.addEventListener('input', function() {
        let startDate = new Date(Date.parse(getInputValueById('#month') + " " +
            getInputValueById('#day') + " " +
            getInputValueById('#year')));

        console.log("Date is ::", getInputValueById('#day') + " " +
            getInputValueById('#month') + " " +
            getInputValueById('#year'));
        console.log("start date is", startDate)
        try {
            //(new EmployeePayrollData()).startDate = startDate;
            checkStartDate(new Date(Date.parse(startDate)));
            console.log("start date is", startDate);
            setTextValue('.date-error', "");
        } catch (e) {
            setTextValue('.date-error', e);
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        setTextValue('.salary-output', salary.value);
    });
    checkForUpdate();
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
        setEmployeePayrollObject();
        if (checkGender() == true) {
            if (site_properties.use_local_storage.match("true")) {
                createAndUpdateStorage();
                resetForm();
                window.location.replace(site_properties.home_page);
            } else {
                createOrUpdateEmployeePayroll();
            }
        }
    } catch (e) {
        return;
    }
}


const setEmployeePayrollObject = () => {
    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewEmployeeId();
    }
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#month') + " " + getInputValueById('#day') + " " +
        getInputValueById('#year');
    console.log("Date is :", date);
    employeePayrollObj._startDate = date;
    console.log("from setemploye", employeePayrollObj._startDate);
}


const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.
        find(empData => empData.id == employeePayrollObj.id);
        if (!empPayrollData) {
            employeePayrollList.push(employeePayrollObj);
        } else {
            const index = employeePayrollList
                .map(empData => empData.id)
                .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeePayrollList = [employeePayrollObj]
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

// const createEmployeePayrollData = (id) => {
//     let employeePayrollData = new EmployeePayrollData();
//     if (!id) employeePayrollData.id = createNewEmployeeId();
//     else employeePayrollData.id = id;
//     setEmployeePayrollData(employeePayrollData);
//     return employeePayrollData;
// }

// const setEmployeePayrollData = (employeePayrollData) => {
//     try {
//         employeePayrollData.name = employeePayrollObj._name;
//     } catch (e) {
//         setTextValue('.text-error', e);
//         throw e;
//     }
//     employeePayrollData.profilePic = employeePayrollObj._profilePic;
//     employeePayrollData.gender = employeePayrollObj._gender;
//     employeePayrollData.department = employeePayrollObj._department;
//     employeePayrollData.salary = employeePayrollObj._salary;
//     employeePayrollData.note = employeePayrollObj._note;
//     try {
//         employeePayrollData.startDate =
//             new Date(Date.parse(employeePayrollObj._startDate));
//     } catch (e) {
//         setTextValue('.date-error', e);
//         throw e;
//     }
//     alert(employeePayrollData.toString());
// }

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID) + 1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

const createEmployeePayroll = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[name=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " +
        getInputValueById('#year');
    employeePayrollData.startDate = new Date(parseInt(document.getElementById("year").value), parseInt(document.getElementById("month").value) - 1, parseInt(document.getElementById("day").value));
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    console.log(value);
    return value;

}

const getInputElementValue = (id) => {
    let value = document.getElementById(id).value;
    return value;
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value)
            item.checked = true;
    });
}

const resetForm = () => {
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}
const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const createOrUpdateEmployeePayroll = () => {
    let postUrl = site_properties.server_url;
    let methodcall = "POST";
    if (isUpdate) {
        methodcall = "PUT";
        postUrl = postUrl + "/" + employeePayrollObj.id.toString();
    }
    makeServiceCall(methodcall, postUrl, true, employeePayrollObj)
        .then(responseText => {
            resetForm();
            console.log("Response text:" + responseText);
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

const checkGender = () => {
    var getSelectedValue = document.querySelector('input[name="gender"]:checked');
    var output = document.querySelector('.gender-error');
    if (getSelectedValue != null) {
        setTextValue('.gender-error', "")
        return true;
    } else {
        setTextValue('.gender-error', "Please select gender");
        return flase;
    }
}