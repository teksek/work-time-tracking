// zarządza dniami pracy, tabelą i podsumowaniami.
class WorkTimeManager {
    initialization() {
        
    }
    getWorkingDays() {

    }
    insertWorkingDayToTable(day) {

    }
    insertWeekend(tableBody) {

    }
    validateTime(line, inOrOut) {

    }
    canUpdateSurplusOrNo(line) {

    }
    updateSurplus(line) {

    }
    updateTotalSurplus() {

    }
    updateSummary() {

    }
}

//  odpowiada za walidację godzin wejścia/wyjścia.
class TimeValidator {
    checkOpeningHours(czasWpisany) {

    }
    checkIfTimeOutIsValid(czasWejscia, czasWyjscia) {

    }
}

// oblicza różnice czasowe
class TimeCalculator {
    timeDifferenceSystem(timeIn, timeOut, requiredHours = 8) {

    }
}

// zarządza motywem strony.
class ThemeManager {
    addThemeToggleFunctionality() {

    }
    themeToggle(color) {

    }
}

// zajmuje się eksportem danych.
class ExportManager {
    exportTableToXLSX() {

    }
}

// obsługuje interfejs użytkownika, np. popupy.
class UIManager {
    createPopup(message, type) {

    }
}

// initialization
document.addEventListener("DOMContentLoaded", () => {
    const workTimeManager = new WorkTimeManager();
    workTimeManager.initialization();
});