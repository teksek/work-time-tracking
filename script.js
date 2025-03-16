const currentDay = new Date();
let date = new Date();
let openingHour = "06:00";
let closingHour = "22:00";
let daysOfThisMonth;
let workingdays = [];
let dayOfMonth = 0;
let validTimeIn = false;
let validTimeOut = false;
let totalSurplusInMinutes = 0;
let totalSurplus = 0;
let yearTotalSurplusInMinutes = 0;
let yearTotalSurplus = 0;
let yearCalculatedByYearlySummary;
let isTheFirstMonday = false;
let checkTimeOutValid = 0;
let isThereCurrentDay = false;
let weekends = [];
let requiredHours = 8;

document.addEventListener("DOMContentLoaded", () => {
    updateYearlySummary();
    initialization();
})

function initialization() {
    // ? function getDays takes 2 arguments: year and month
    // ? this function creates new Date object with day set at 0
    // ? getting and returns amount of days in this month via Date class method: ".getDate()" 
    const getDays = (year, month) => {
        return new Date(year, month, 0).getDate();
    };
    daysOfThisMonth = getDays(date.getFullYear(), date.getMonth() + 1);

    if(!isThisMonthSaved()) {
        getWorkingDays();
    } else {
        jsonData = isThisMonthSaved();
        loadMonth(jsonData);
    }

    addThemeToggleFunctionality();
    themeToggle();

    addWorkTimeInputFunctionality();
    workTimeSet();
    addOpeningHoursFunctionality();
    setOpenHours();
}

function getWorkingDays() {
    for(let i = 1; i <= daysOfThisMonth; i++) {
        const dateOfTheDay = new Date(date.getFullYear(), date.getMonth(), i);
        let workingDay;
        switch(dateOfTheDay.getDay()) {
            case 1:
                workingDay = dateOfTheDay.getDate().toString().padStart(2, "0");
                workingdays.push(workingDay);
                break;
            case 2:
                workingDay = dateOfTheDay.getDate().toString().padStart(2, "0");
                workingdays.push(workingDay);
                break;
            case 3:
                workingDay = dateOfTheDay.getDate().toString().padStart(2, "0");
                workingdays.push(workingDay);
                break;
            case 4:
                workingDay = dateOfTheDay.getDate().toString().padStart(2, "0");
                workingdays.push(workingDay);
                break;
            case 5:
                workingDay = dateOfTheDay.getDate().toString().padStart(2, "0");
                workingdays.push(workingDay);
                break;
        }
    }
    dayOfMonth = 0;
    for(let day of workingdays) {
        insertWorkingDayToTable(day);
    }

    updateSummary();
}

function insertWorkingDayToTable(day, purpose = "", timeIn = "", timeOut = "", surplus = 0) {
    const tableBody = document.querySelector(".container > table > tbody");
    const dateOfTheDay = new Date(date.getFullYear(), date.getMonth(), day);
    dayOfMonth++;

    let newLine = document.createElement('tr');
    newLine.id = "day" + dayOfMonth;
    newLine.classList.add('day');

    newLine.appendChild(document.createElement('td'));
    let tdDateText = document.createTextNode(`${day}.${(dateOfTheDay.getMonth() + 1).toString().padStart(2, "0")}.${dateOfTheDay.getFullYear()}`);
    newLine.firstChild.appendChild(tdDateText);

    newLine.appendChild(document.createElement('td'));
    let tdDayText = document.createTextNode(`${dateOfTheDay.toLocaleDateString("en-US", { weekday: 'long' })}`);
    newLine.lastChild.appendChild(tdDayText);

    let workTimeElement = document.createElement('td');
    workTimeElement.classList.add("workTimeElement");
    newLine.appendChild(workTimeElement);
    let tdTimeText = document.createTextNode(`${requiredHours} hours`);
    newLine.lastChild.appendChild(tdTimeText);

    // in time select element
    let tdInTime = document.createElement('td')
    tdInTime.classList.add('inTimeInputElement');
    newLine.appendChild(tdInTime);
    let inTimeSelectionElement = document.createElement("input");
    tdInTime.appendChild(inTimeSelectionElement);
    inTimeSelectionElement.addEventListener('blur', () => {
        validateTime(newLine, "in");
    });
    inTimeSelectionElement.classList.add('timeIn');
    inTimeSelectionElement.setAttribute("type", "time");
    inTimeSelectionElement.style.height = "100%";
    tdInTime.appendChild(inTimeSelectionElement);

    let tdOutTime = document.createElement('td')
    tdOutTime.classList.add('outTimeInputElement');
    newLine.appendChild(tdOutTime);
    let outTimeSelectionElement = document.createElement("input");
    tdOutTime.appendChild(outTimeSelectionElement);
    outTimeSelectionElement.addEventListener('blur', () => {
        validateTime(newLine, "out");
    });
    outTimeSelectionElement.classList.add('timeOut');
    outTimeSelectionElement.setAttribute("type", "time");
    outTimeSelectionElement.style.height = "100%";
    tdOutTime.appendChild(outTimeSelectionElement);
        
    let surplusElement = document.createElement('td');
    surplusElement.classList.add('surplus');
    newLine.appendChild(surplusElement);
    let tdSurplusText;

    if(purpose === "loadMonth") {
        inTimeSelectionElement.value = timeIn;
        outTimeSelectionElement.value = timeOut;
        tdSurplusText = document.createTextNode(surplus);
    } else {
        tdSurplusText = document.createTextNode("Nothing yet!");
    }

    newLine.lastChild.appendChild(tdSurplusText);

    // ! checks if date handed over to this function is today's date and adds class to this line
    if(day == currentDay.getDate() && ((dateOfTheDay.getMonth() + 1) === (currentDay.getMonth() + 1)) && dateOfTheDay.getFullYear() == currentDay.getFullYear()) {
        newLine.classList.add("currentDay");
        isThereCurrentDay = true;
    }

    // we want to insert 
    let testDateIfSunday = new Date(date.getFullYear(), date.getMonth(), day - 1);
    if(dateOfTheDay.getDay() == 1 && dateOfTheDay.getDate() == 3 || dateOfTheDay.getDate() == 2 && testDateIfSunday.getDay() == 0) {
        insertWeekend(tableBody);
        isTheFirstMonday = true;
    }
    tableBody.appendChild(newLine);
    // ! checks if day handed over to this function is last day of the week and creates a special new element after friday
    if(dateOfTheDay.getDay() == 5 && workingdays.length != dayOfMonth) {
        insertWeekend(tableBody);
    }
}

function insertWeekend(tableBody) {
    let newWeekendLine = document.createElement('tr');
    newWeekendLine.classList.add('weekend');
    newWeekendLine.appendChild(document.createElement('td'));
    let weekendText = document.createTextNode('Weekend! 🎉');
    newWeekendLine.firstChild.appendChild(weekendText);
    newWeekendLine.firstChild.setAttribute('colspan', 6)
    tableBody.appendChild(newWeekendLine);
}

function validateTime(line, inOrOut) {
    let timeInValue = line.querySelector('.inTimeInputElement > .timeIn').value;
    let timeOutValue = line.querySelector('.outTimeInputElement > .timeOut').value;
    if(inOrOut === "in") {
        if (timeInValue.match(/\d+:\d+/)) {
            if(checkOpeningHours(timeInValue)) {
                validTimeIn = true;
                canUpdateSurplusOrNo(line);
                if(checkTimeOutValid == 1 && checkIfTimeOutIsValid(timeInValue, timeOutValue)) {
                    validTimeOut = true;
                    canUpdateSurplusOrNo(line);
                }
            } else {
                const newPopup = new Popup("Wrong time! You've just typed time after our company closes!", "error");
                newPopup.createElement();
            }
        } else {
            const newPopup = new Popup("You've just typed time in invalid format! Fix that", "warning");
            newPopup.createElement();
        }
    } else if (inOrOut === "out") {
        if (timeOutValue.match(/\d+:\d+/)) {
            if(checkOpeningHours(timeOutValue)) {
                if(checkIfTimeOutIsValid(timeInValue, timeOutValue)) {
                    validTimeOut = true;
                    canUpdateSurplusOrNo(line);
                } else {
                    const newPopup = new Popup("It won't work, first time must be wrong! Check that", "warning");
                    newPopup.createElement();
                    checkTimeOutValid = 1;
                }
            } else {
                const newPopup = new Popup("Wrong time! You've just typed time after our company closes!", "error");
                newPopup.createElement();
            }
        } else if (timeOutValue === "") {
            return;
        } else {
            const newPopup = new Popup("You've just typed time in invalid format! Fix that", "warning");
            newPopup.createElement();
        }
    }
}

function canUpdateSurplusOrNo(line) {
    if(validTimeIn && validTimeOut)
        updateSurplus(line)
    else if(validTimeIn && !validTimeOut) {
        validateTime(line, "out");
    } else if(!validTimeIn && validTimeOut) {
        validateTime(line, "in");
    }
}

function updateSurplus(line) {
    const surplus = line.querySelector('.surplus');

    let timeInValue = line.querySelector('.inTimeInputElement > .timeIn').value;
    let timeOutValue = line.querySelector('.outTimeInputElement > .timeOut').value;
    let timeAtWork = timeDifferenceSystem(timeInValue, timeOutValue);

    surplus.innerText = timeAtWork;
    saveThisMonthToLocalStorage();

    validTimeIn, validTimeOut = false;
    updateTotalSurplus();
}

function timeDifferenceSystem(timeIn, timeOut) {
    // splitting hour in format HH:MM to HH i MM separately, map(Number) converts string value to number
    let [inHours, inMinutes] = timeIn.split(":").map(Number);
    let [outHours, outMinutes] = timeOut.split(":").map(Number);

    // converting time to minutes because its easier to compare and substract minutes to/from each other than hours and minutes
    let startMinutes = inHours * 60 + inMinutes;
    let endMinutes = outHours * 60 + outMinutes;

    // calculating total worked minutes
    let workedMinutes = endMinutes - startMinutes;

    // conversion of required hours to minutes
    let requiredMinutes = requiredHours * 60;

    // calculating a difference between worked minutes and required minutes
    let diffMinutes = workedMinutes - requiredMinutes;

    // determining the sign of the result
    // ? if diffMinutes is lower than 0: -
    // ? else: +
    let sign = diffMinutes < 0 ? "-" : "+";

    // converting to absolute value
    diffMinutes = Math.abs(diffMinutes);

    // converting the difference to hours and minutes
    let hours = Math.floor(diffMinutes / 60);
    let minutes = diffMinutes % 60;

    // formating the final output
    // ? for example: -08:07
    // ? sign variable possibilities: - and +
    // ? padStart fills things with "0"'s, for example: if we have 8 minutes, it will place 0 before 8 and it will look like this: 00:08
    return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function updateTotalSurplus() {
    const totalSurplusElement = document.querySelector('#totalSurplusElement');
    
    totalSurplusInMinutes = 0;
    allLines = document.querySelectorAll('.day');
    allLines = Array.from(allLines);
    
    for(let line of allLines) {
        let surplusOfThisLine = line.querySelector('.surplus').innerText;
        if (surplusOfThisLine != "Nothing yet!") {
            let sign = surplusOfThisLine.startsWith("-") ? -1 : 1;
            let [hours, minutes] = surplusOfThisLine.substring(1).split(":").map(Number);
            let totalMinutes = sign * (hours * 60 + minutes);
            totalSurplusInMinutes += totalMinutes;
        } else if (surplusOfThisLine === "Nothing yet!") {
            console.log("I can't add this line's - " + line + " - surplus to total!");
        }
    }

    // determining the sign of the total surplus
    let sign = totalSurplusInMinutes < 0 ? "-" : "+";

    //transformation from minutes to hours and minutes for totalSurplusInMinutes ;3
    let hours = Math.floor(Math.abs(totalSurplusInMinutes / 60));
    let minutes = Math.abs(totalSurplusInMinutes % 60);
    totalSurplus = `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    
    if(totalSurplus != "+00:00") {
        totalSurplusElement.innerText = totalSurplus;
    } else {
        totalSurplusElement.innerText = "Nothing yet!"
    }
}

function updateSummary() {
    const amountOfWorkingDays = document.querySelector('#amountOfWorkingDays');
    const amountOfWeekends = document.querySelector('#amountOfWeekends');
    const amountOfDaysOff = document.querySelector('#amountOfDaysOff');

    amountOfWorkingDays.innerText = workingdays.length;

    weekends = document.querySelectorAll('.weekend');
    amountOfWeekends.innerText = weekends.length;

    amountOfDaysOff.innerText = Math.abs(weekends.length * 2);
}

function updateYearlySummary() {
    // yearly summary
    const yearlyAmountOfWorkingDays = document.querySelector("#yearlyAmountOfWorkingDays");
    const yearlyAmountOfWeekends = document.querySelector("#yearlyAmountOfWeekends");
    const yearlyAmountOfDaysOff = document.querySelector("#yearlyAmountOfDaysOff");
    
    yearlyWorkingDays = [];
    yearlyWeekends = [];
    yearTotalSurplus = 0;
    yearTotalSurplusInMinutes = 0;

    for(let i = 0; i < 12; i++) {
        let testDate = new Date(date.getFullYear(), i, 1);
        yearCalculatedByYearlySummary = date.getFullYear();
        const getDays = (year, month) => {
            return new Date(year, month, 0).getDate();
        };
        let tempDaysOfThisMonth = getDays(date.getFullYear(), date.getMonth() + 1);

        for(let i = 1; i <= tempDaysOfThisMonth; i++) {
            const dateOfTheDay = new Date(date.getFullYear(), date.getMonth(), i);
            let workingDay;
            let weekendAdded = false;
            switch(dateOfTheDay.getDay()) {
                case 0:
                    if(!weekendAdded) {
                        yearlyWeekends.push(weekendAdded);
                        weekendAdded = true;
                    }
                    break;
                case 1:
                    workingDay = dateOfTheDay.getDate();
                    yearlyWorkingDays.push(workingDay);
                    break;
                case 2:
                    workingDay = dateOfTheDay.getDate();
                    yearlyWorkingDays.push(workingDay);
                    break;
                case 3:
                    workingDay = dateOfTheDay.getDate();
                    yearlyWorkingDays.push(workingDay);
                    break;
                case 4:
                    workingDay = dateOfTheDay.getDate();
                    yearlyWorkingDays.push(workingDay);
                    break;
                case 5:
                    workingDay = dateOfTheDay.getDate();
                    yearlyWorkingDays.push(workingDay);
                    break;
                case 6:
                    if(!weekendAdded) {
                        yearlyWeekends.push(weekendAdded);
                        weekendAdded = true;
                    }
                    break;
            }
        }
    }
    yearlyAmountOfWorkingDays.innerText = yearlyWorkingDays.length;
    yearlyAmountOfWeekends.innerText = yearlyWeekends.length;
    yearlyAmountOfDaysOff.innerText = Math.abs(yearlyWeekends.length * 2);
}

function checkOpeningHours(czasWpisany) {
    // converting opening hours, closing hours itd to minutes
    const [hOtwarcia, mOtwarcia] = openingHour.split(':').map(Number);
    const [hZamkniecia, mZamkniecia] = closingHour.split(':').map(Number);
    const [hWpisany, mWpisany] = czasWpisany.split(':').map(Number);

    const otwarcie = new Date();
    otwarcie.setHours(hOtwarcia, mOtwarcia, 0, 0);

    const zamkniecie = new Date();
    zamkniecie.setHours(hZamkniecia, mZamkniecia, 0, 0);

    const wpisanyCzas = new Date();
    wpisanyCzas.setHours(hWpisany, mWpisany, 0, 0);

    // checking if entered time is within the opening time
    if (wpisanyCzas >= otwarcie && wpisanyCzas <= zamkniecie) {
        return true;
    } else {
        return false;
    }
}

function checkIfTimeOutIsValid(czasWejscia, czasWyjscia) {
    const [hWejscia, mWejscia] = czasWejscia.split(':').map(Number);
    const [hWyjscia, mWyjscia] = czasWyjscia.split(':').map(Number);

    const wejscie = new Date();
    wejscie.setHours(hWejscia, mWejscia, 0, 0);

    const wyjscie = new Date();
    wyjscie.setHours(hWyjscia, mWyjscia, 0, 0);

    // checking if timeOut is not before timeIn
    if (wyjscie > wejscie) {
        return true;
    } else {
        return false;
    }
}

function addThemeToggleFunctionality() {
    let toggle_box = document.querySelector(".toggle_box");
    let checkbox = document.querySelector("#checkbox");

    toggle_box.addEventListener('click', () => {
        if(checkbox.checked){
            document.cookie = "prefered_theme=black";
            themeToggle("black");
        } else {
            document.cookie = "prefered_theme=white";
            themeToggle("white");
        }
    });
}

function themeToggle(color) {
    let circle = document.querySelector(".circle");
    let container = document.querySelector('.container');
    let toggle_box = document.querySelector(".toggle_box");

    if(document.cookie == "prefered_theme=black" || color == "black") {
        circle.style.transform = "translateX(60px) rotate(360deg)";
        circle.style.transition = "ease-in-out transform 0.5s";
        setTimeout(() => {
            circle.children[0].children[0].setAttribute('d', "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z");
        }, 300)
        toggle_box.style.backgroundColor = "#414a43";
        let thisColorElement = document.querySelector("#thisColorElement");
        thisColorElement.style.backgroundColor = "#BA8E23"; 
        thisColorElement.style.color = "white";
        container.classList.add('container_black_theme');
        let allTextElements = document.querySelectorAll("body *:not(th, tr, span, button, h3, input, div, section, main, table)");
        for(let element of allTextElements) {
            element.style.color = "#EAEAEA";
        }
        let captions = document.querySelectorAll("th");
        for (let caption of captions) {
            caption.style.color = "#FFFFFF";
        }
        let theadTrElement = document.querySelector('table > thead > tr');
        theadTrElement.style.backgroundColor = "#3a3a3a";
        document.querySelector("table").style.backgroundColor = "#1A1A1A";
        let evenTableRows = document.querySelectorAll('tr:nth-child(even)');
        for (let row of evenTableRows) {
            row.style.backgroundColor = "#222233";
        }
        let inputElements = document.querySelectorAll('input[type="time"]');
        for(let inputElement of inputElements) {
            inputElement.style.backgroundColor = "transparent";
            inputElement.style.border = "none";
        }
        if(isThereCurrentDay) {
            document.querySelector('.currentDay').style.backgroundColor = "#BA8E23";
            document.querySelector('.currentDay > :nth-child(4) > input').style.backgroundColor = "#997111";
            document.querySelector('.currentDay > :nth-child(5) > input').style.backgroundColor = "#997111";
        }
    } else if (document.cookie == "prefered_theme=white" || color == "white") {
        circle.style.transform = "translateX(0px) rotate(-180deg)";
        circle.style.transition = "ease-in-out transform 0.5s";
        setTimeout(() => {
            circle.children[0].children[0].setAttribute('d', "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z");
        }, 300)
        toggle_box.style.backgroundColor = "lightgrey";
        let thisColorElement = document.querySelector("#thisColorElement");
        thisColorElement.style.backgroundColor = "#FAFAD2";
        thisColorElement.style.color = "black";
        // container.style.backgroundColor = "white";
        container.classList.remove('container_black_theme');
        let allTextElements = document.querySelectorAll("body *:not(th, tr, span, button, h3, input[type='time'])");
        for(let element of allTextElements) {
            element.style.color = "black";
        }
        let captions = document.querySelectorAll("th");
        for (let caption of captions) {
            caption.style.color = "black";
        }
        let theadTrElement = document.querySelector('table > thead > tr');
        theadTrElement.style.backgroundColor = "#F3F3F3";
        document.querySelector("table").style.backgroundColor = "white";
        let evenTableRows = document.querySelectorAll('tr:nth-child(even)');
        for (let row of evenTableRows) {
            row.style.backgroundColor = "white";
        }
        let inputElements = document.querySelectorAll('input[type="time"]');
        for(let inputElement of inputElements) {
            inputElement.style.backgroundColor = "white";
            inputElement.style.border = "1px solid lightgrey";
        }
        if(isThereCurrentDay) 
            document.querySelector('.currentDay').style.backgroundColor = "lightgoldenrodyellow";
    }
}

function addWorkTimeInputFunctionality() {
    let workTimeInput = document.querySelector('#workTimeInput');
    workTimeInput.addEventListener('blur', () => {
        requiredHours = workTimeInput.value;
        localStorage.setItem("requiredHours", requiredHours);
        workTimeSet();
    });
}

function workTimeSet() {
    if (localStorage.getItem('requiredHours')) {
        requiredHours = localStorage.getItem('requiredHours');
        let allWorkTimeTd = document.querySelectorAll('.workTimeElement');
        for(let workTimeElement of allWorkTimeTd) {
            workTimeElement.innerText = requiredHours + " hours";
            if(workTimeElement.parentElement.childNodes[3].firstChild.value != "" && workTimeElement.parentElement.childNodes[4].firstChild.value != "") {
                updateSurplus(workTimeElement.parentElement);
            }
        }
    }
}

function addOpeningHoursFunctionality() {
    let openingHourInput = document.querySelector('#openingHour');
    let closingHourInput = document.querySelector('#closingHour');
    openingHourInput.addEventListener('blur', () => {
        openingHour = openingHourInput.value;
        localStorage.setItem("openingHour", openingHour);
        setOpenHours("open");
    });
    closingHourInput.addEventListener('blur', () => {
        closingHour = closingHourInput.value;
        localStorage.setItem("closingHour", closingHour);
        setOpenHours("close");
    });
}

function setOpenHours(type) {
    if(type = "open") {
        if(localStorage.getItem('openingHour')) 
            openingHour = localStorage.getItem('openingHour');
    } else if (type = "close") {
        if(localStorage.getItem('closingHour'))
            closingHour = localStorage.getItem('closingHour');
    }
}

function isThisMonthSaved() {
    // ? this function checks in localStorage is this month saved
    // * if yes, it needs to load this month instead of creating new month
    let monthName = date.toLocaleString('en-us', { month: 'long' });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const fileName = `${monthName}_${date.getFullYear()}`;
    try {
        const savedData = localStorage.getItem(`${fileName}`);
        if (savedData) {
            let jsonData = JSON.parse(savedData);
            return jsonData;
        } else {
            // "We don't have this month saved in our database!"
            throw false;
        }
    } catch(error) {
        return error;
    }
}

function nextMonth() {
    // saving this month to local storage for archive purposes OR future editing
    saveThisMonthToLocalStorage();

    date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    if(date.getFullYear() != yearCalculatedByYearlySummary) 
        updateYearlySummary();
    removeMonthLeavings();
    initialization();
    themeToggle();
}

function removeMonthLeavings() {
    // removing previous month from the table body and any previous data from variables
    workingdays = [];
    dayOfMonth = 0;
    totalSurplusInMinutes = 0;
    totalSurplus = 0;
    isTheFirstMonday = false;
    isThereCurrentDay = false;
    let tableBody = document.querySelector('tbody');
    let tableBodyChild = document.querySelectorAll('tbody > *');
    for(let child of tableBodyChild) {
        tableBody.removeChild(child);
    }
    weekends = [];
    dayOfMonth = 0;
}

function loadMonth(jsonData) {
    let workingdaysData = {};
    for(let row of jsonData) {
        let dateSplitted = row[0].split('.');
        let dayNumber = dateSplitted[0];
        workingdays.push(dayNumber);
        workingdaysData[dayNumber] = row;
    }    
    
    for(let day of workingdays) {
        let row = workingdaysData[day];
        insertWorkingDayToTable(day, "loadMonth", row[3], row[4], row[5]);
    }
    updateSummary();
    updateTotalSurplus();
    themeToggle();
}

function previousMonth() {
    let monthNumber = date.getMonth() - 1;
    let testDate = new Date(date.getFullYear(), monthNumber, 1);
    let monthName = testDate.toLocaleString('en-us', { month: 'long' });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const fileName = `${monthName}_${date.getFullYear()}`;

    const savedData = localStorage.getItem(`${fileName}`);
    if (savedData) {
        let jsonData = JSON.parse(savedData);
        date = new Date(date.getFullYear(), monthNumber, 1);
        removeMonthLeavings();
        loadMonth(jsonData);
    } else {
        // throw "We don't have previous months saved in our database!";
        saveThisMonthToLocalStorage();
        date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        removeMonthLeavings();
        initialization();
    }
}

function exportTableToXLSX() {
    let monthName = date.toLocaleString('en-us', { month: 'long' });
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const filename = monthName + "_work-time_export" + date.getFullYear();
    let data = [];
    data = getDataFromTable(data, "Excel");
    
    // creating xlsx worksheet from our data array
    let worksheet = XLSX.utils.aoa_to_sheet(data); // aoa meaning - Array of Arrays
    worksheet["!cols"] = [{ wch: 15 }];

    // creating xlsx workbook with worksheet created before
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${monthName}_${date.getFullYear()}`);

    // exporting our workbook to xlsx file (native Excel format)
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}



function saveThisMonthToLocalStorage() {
    const fileName = `${date.toLocaleString('en-us', { month: 'long' })}_${date.getFullYear()}`;
    let data = [];
    data = getDataFromTable(data, "saveMonth");
    

    localStorage.setItem(`${fileName}`, JSON.stringify(data));
    console.log("Dane zapisane w localStorage!");
    // console.log(localStorage.getItem(`${fileName}`));
}

function getDataFromTable(data, purpose) {
    let table = document.querySelector("table");
    let rows;
    let excelOrMonth;

    if(purpose === "Excel") {
        excelOrMonth = "Excel";
        rows = table.querySelectorAll("tr");
    } else if (purpose === "saveMonth") {
        excelOrMonth = "Month";
        rows = table.querySelectorAll("tbody > *:not(.weekend)");
    }

    // going through every row
    rows.forEach((row, rowIndex) => {
        // new table for data of this row
        let rowData = [];
        let cells = row.querySelectorAll("th, td");

        // iteration through all cells in the row
        cells.forEach((cell, colIndex) => {
            // getting value from cell and trimming useless spaces
            let cellValue = cell.innerText.trim();
            
            if (cell.querySelector("input")) {
                cellValue = cell.querySelector("input").value.trim();
            }

            // checking if date is valid via function "isValidDate"
            if (isValidDate(cellValue) && excelOrMonth == "Excel") {
                // converting our format (13.02.2025) to format that excel knows how to format (2025-02-13):
                // ? we're doing so by firstly splitting the string to three parts: day, month and year. then we're reversing the order of these elements in array and joining them by "-" char instead of "."
                rowData.push(new Date(cellValue.split('.').reverse().join('-')));
            } else {
                // if value is not a date, we're just putting it to rowData array
                rowData.push(cellValue);
            }
        });
        // after processing all the cells in the row, we're pushing rowData to data
        data.push(rowData);
    });

    return data;
}

function isValidDate(dateString) {
    let regExp = /^\d{1,2}\.\d{1,2}\.\d{4}$/; // np. 19.01.2025
    return regExp.test(dateString);
}

class Popup {
    text = "";
    type = "";

    constructor(text = "Done.", type = "default") {
        this.text = text;
        this.type = type;
    }

    createElement() {
        if (this.type === "default") {
            this.giveNewElementType("notification-default");
        } else if (this.type === "warning") {
            this.giveNewElementType("notification-warning");
        } else {
            this.giveNewElementType("notification-error");
        }
    }

    giveNewElementType(className) {
        const notificationsDiv = document.querySelector('.notifications');

        const newNotification = document.createElement('div');
        newNotification.classList.add(className);
        let newContent = "";

        if (this.text.charAt(this.text.length - 1) === ".") {
            newContent = document.createTextNode(this.text);
        } else {
            if (className === "default") {
                newContent = document.createTextNode(this.text + ".");
            } else {
                newContent = document.createTextNode(this.text + "!");
            }
        }
        newNotification.appendChild(newContent);

        const newX = newNotification.appendChild(document.createElement('div'));
        newX.classList.add('basic-flexbox-notification');

        let svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('fill', 'currentColor');
        svgElement.setAttribute('height', '20px');
        svgElement.setAttribute('viewBox', '0 0 20 20');
        svgElement.setAttribute('width', '20px');
        svgElement.style.zIndex = "2000";
        let svgPath = svgElement.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        svgPath.setAttribute('d', 'm18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z');

        newX.appendChild(svgElement);
        newX.addEventListener('click', () => {
            newNotification.remove();  
        });

        const existingNotifications = document.querySelectorAll('.notifications > *');

        existingNotifications.forEach(notification => {
        const bottom = parseInt(notification.style.bottom || 0, 10);
            notification.style.bottom = (bottom + 120) + 'px'; 
        });

        notificationsDiv.insertBefore(newNotification, notificationsDiv.firstElementChild);

        setTimeout(() => {
            newNotification.remove();
        }, 3000)
    }
}