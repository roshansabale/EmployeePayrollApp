let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {

    if (site_properties.use_local_storage.match("true")) {
        getEmployeePayrollDataFromStorage();
    } else getEmployeePayrollDataFromServer();
    // empPayrollList = getEmployeePayrollDataFromStorage();
    // document.querySelector('.emp-count').textContent = empPayrollList.length;
    // createInnerHtml();
    // localStorage.removeItem('editEmp');
});

const getEmployeePayrollDataFromStorage = () => {
    // return localStorage.getItem('EmployeePayrollList') ?
    //     JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    empPayrollList = localStorage.getItem('EmployeePayrollList') ?
        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const processEmployeePayrollDataResponse = () => {
    document.querySelector('.emp-count').textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            empPayrollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status:" + JSON.stringify(error));
            empPayrollList = [];
            processEmployeePayrollDataResponse();
        });
}

/* Template Literal ES6 feature */
const createInnerHtml = () => {
    if (empPayrollList.length == 0) return;

    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>";
    let innerHtml = `${headerHtml}`;
    for (const empPayrollData of empPayrollList) {
        innerHtml = `${innerHtml}  
    <tr>
    <td data-label="ProfilePic"><img class="profile" src="${empPayrollData._profilePic}" alt=""></td>
    <td data-label="Name">${empPayrollData._name}</td>
    <td data-label="Gender">${empPayrollData._gender}</td>
    <td data-label="Department">${getDeptHtml(empPayrollData._department)}</td> 
    <td data-label="Salary">${empPayrollData._salary}</td>
    <td data-label="StartDate">${stringifyDate(empPayrollData._startDate)}</td>
    <td data-label="Actions">
       <img id="${empPayrollData.id}"  onclick="remove(this)" 
            src="../assets/icons/delete-black-18dp.svg" alt="delete">
       <img id="${empPayrollData.id}" onclick="update(this)"
            src="../assets/icons/create-black-18dp.svg" alt="edit">  
    </td>
    </tr>
    `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
}
const update = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    console.log(empPayrollList._id);
    if (!empPayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(empPayrollData))
    window.location.replace(site_properties.add_emp_payroll_page);
}

const remove = (node) => {

    console.log("Remove method called", node);
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if (!empPayrollData) return;
    const index = empPayrollList
        .map(empData => empData.id)
        .indexOf(empPayrollData.id);
    console.log("Remove method called" + index);

    empPayrollList.splice(index, 1);

    if (site_properties.use_local_storage.match("true")) {
        localStorage.setItem('EmployeePayrollList', JSON.stringify(empPayrollList));
        document.querySelector('.emp-count').textContent = empPayrollList.length;
        createInnerHtml();
        window.location.href = "home.html";
    } else {
        const deletURL = site_properties.server_url + "/" + empPayrollData.id.toString();
        makeServiceCall("DELETE", deletURL, false)
            .then(responseText => {
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE Error Status: " + JSON.stringify(error));
            });
    }
}