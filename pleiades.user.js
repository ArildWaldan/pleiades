// ==UserScript==
// @name         Pléiade Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.webfx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==


// Pre-defined JSON objets:


const extractedSchedule = {
    "employes": [
        {
            "nom": "COLIN FANNY",
            "heuresSemaine": 38.5,
            "shifts": [
                {"jour": "Lundi", "shifts": []},
                {"jour": "Mardi", "shifts": []},
                {"jour": "Mercredi", "shifts": []},
                {"jour": "Jeudi", "shifts": [
                    {"debut": "13:00", "fin": "20:00"}
                ]},
                {"jour": "Vendredi", "shifts": ["repos"]},
                {"jour": "Samedi", "shifts": []},
            ]
        },
        {
            "nom": "DAUPHIN VICTORIA",
            "heuresSemaine": 35,
            "shifts": [
                {"jour": "Lundi", "shifts": []},
                {"jour": "Mardi", "shifts": ["repos"]},
                {"jour": "Mercredi", "shifts": []},
                {"jour": "Jeudi", "shifts": []},
                {"jour": "Vendredi", "shifts": []},
                {"jour": "Samedi", "shifts": []},
            ]
        },
        {
            "nom": "DERHAN ARNAUD",
            "heuresSemaine": 35,
            "shifts": [
                {"jour": "Lundi", "shifts": ["repos"]},
                {"jour": "Mardi", "shifts": []},
                {"jour": "Mercredi", "shifts": []},
                {
                    "jour": "Jeudi",
                    "shifts": [
                        {"debut": "08:00", "fin": "12:00"},
                        {"debut": "14:00", "fin": "17:00"}
                    ]
                },
                {"jour": "Vendredi", "shifts": []},
                {"jour": "Samedi", "shifts": []},
            ]
        },
        {
            "nom": "LAM ERIC",
            "heuresSemaine": 35,
            "shifts": [
                {"jour": "Lundi", "shifts": []},
                {"jour": "Mardi", "shifts": []},
                {"jour": "Mercredi", "shifts": []},
                {"jour": "Jeudi", "shifts": ["repos"]},
                {"jour": "Vendredi", "shifts": []},
                {"jour": "Samedi", "shifts": []},
            ]
        },
        {
            "nom": "GENOT NOLAN",
            "heuresSemaine": 35,
            "shifts": [
                {"jour": "Lundi", "shifts": []},
                {"jour": "Mardi", "shifts": []},
                {"jour": "Mercredi", "shifts": ["repos"]},
                {"jour": "Jeudi", "shifts": []},
                {"jour": "Vendredi", "shifts": []},
                {"jour": "Samedi", "shifts": []},
            ]
        },
        {
            "nom": "ROUTA VICTORIA",
            "heuresSemaine": 35,
            "shifts": [
                {"jour": "Lundi", "shifts": []},
                {"jour": "Mardi", "shifts": ["repos"]},
                {"jour": "Mercredi", "shifts": []},
                {"jour": "Jeudi", "shifts": []},
                {"jour": "Vendredi", "shifts": []},
                {"jour": "Samedi", "shifts": []},
            ]
        }
    ]
}
;

const priorities = {
    "Lundi": {
        "08:00": 1,
        "09:00": 3,
        "10:00": 4,
        "11:00": 3,
        "12:00": 2,
        "13:00": 2,
        "14:00": 3,
        "15:00": 4,
        "16:00": 4,
        "17:00": 3,
        "18:00": 2,
        "19:00": 1
    },
    "Mardi": {
        "08:00": 1,
        "09:00": 3,
        "10:00": 4,
        "11:00": 3,
        "12:00": 2,
        "13:00": 2,
        "14:00": 3,
        "15:00": 4,
        "16:00": 4,
        "17:00": 3,
        "18:00": 2,
        "19:00": 1
    },
    "Mercredi": {
        "08:00": 1,
        "09:00": 3,
        "10:00": 4,
        "11:00": 3,
        "12:00": 2,
        "13:00": 2,
        "14:00": 3,
        "15:00": 4,
        "16:00": 4,
        "17:00": 3,
        "18:00": 2,
        "19:00": 1
    },
    "Jeudi": {
        "08:00": 1,
        "09:00": 3,
        "10:00": 4,
        "11:00": 3,
        "12:00": 2,
        "13:00": 2,
        "14:00": 3,
        "15:00": 4,
        "16:00": 4,
        "17:00": 3,
        "18:00": 2,
        "19:00": 1
    },
    "Vendredi": {
        "08:00": 1,
        "09:00": 3,
        "10:00": 4,
        "11:00": 3,
        "12:00": 2,
        "13:00": 2,
        "14:00": 3,
        "15:00": 4,
        "16:00": 4,
        "17:00": 3,
        "18:00": 2,
        "19:00": 1
    },
    "Samedi": {
        "08:00": 2,
        "09:00": 4,
        "10:00": 5,
        "11:00": 4,
        "12:00": 3,
        "13:00": 3,
        "14:00": 4,
        "15:00": 5,
        "16:00": 5,
        "17:00": 4,
        "18:00": 3,
        "19:00": 2
    }

};

const coverageTargets = {
    "1": {"minimum": 1, "optimal": 2},
    "2": {"minimum": 2, "optimal": 3},
    "3": {"minimum": 3, "optimal": 4},
    "4": {"minimum": 3, "optimal": 5},
    "5": {"minimum": 4, "optimal": 6}
};

const shiftLibrary = [
    {
        "id": 1,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "11:00"
            },
            {
                "start": "13:00",
                "end": "17:00"
            }
        ],
        "desirability": 3
    },
    {
        "id": 2,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "11:00"
            },
            {
                "start": "13:00",
                "end": "18:00"
            }
        ],
        "desirability": 1
    },
    {
        "id": 3,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "17:00"
            }
        ],
        "desirability": 3
    },
    {
        "id": 4,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "18:00"
            }
        ],
        "desirability": 3
    },
    {
        "id": 5,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "17:00"
            }
        ],
        "desirability": 2
    },
    {
        "id": 6,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "18:00"
            }
        ],
        "desirability": 1
    },
    {
        "id": 7,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "11:00"
            },
            {
                "start": "13:00",
                "end": "18:00"
            }
        ],
        "desirability": 3
    },
    {
        "id": 8,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "11:00"
            },
            {
                "start": "13:00",
                "end": "19:00"
            }
        ],
        "desirability": 2
    },
    {
        "id": 9,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "18:00"
            }
        ],
        "desirability": 4
    },
    {
        "id": 10,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "19:00"
            }
        ],
        "desirability": 2
    },
    {
        "id": 11,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "18:00"
            }
        ],
        "desirability": 4
    },
    {
        "id": 12,
        "type": "split",
        "parts": [
            {
                "start": "09:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "19:00"
            }
        ],
        "desirability": 4
    },
    {
        "id": 13,
        "type": "split",
        "parts": [
            {
                "start": "10:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "19:00"
            }
        ],
        "desirability": 3
    },
    {
        "id": 14,
        "type": "split",
        "parts": [
            {
                "start": "10:00",
                "end": "12:00"
            },
            {
                "start": "14:00",
                "end": "20:00"
            }
        ],
        "desirability": 1
    },
    {
        "id": 15,
        "type": "split",
        "parts": [
            {
                "start": "10:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "19:00"
            }
        ],
        "desirability": 4
    },
    {
        "id": 16,
        "type": "split",
        "parts": [
            {
                "start": "10:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "20:00"
            }
        ],
        "desirability": 1
    },
    {
        "id": 17,
        "type": "split",
        "parts": [
            {
                "start": "11:00",
                "end": "13:00"
            },
            {
                "start": "15:00",
                "end": "20:00"
            }
        ],
        "desirability": 2
    },
    // Add other shifts
];

//________________________________________________________________________________________________________________________________________
//________________________________________________________________________________________________________________________________________
//________________________________________________________________________________________________________________________________________


// Functions:


// Initializes the shift coverage needs based on the priorities provided:
function initializeShiftCoverage() {
    let coverage = {};
    for (let day in priorities) {
        coverage[day] = {};
        for (let hour in priorities[day]) {
            // Initialize with an empty employees array and assigned to 0
            coverage[day][hour] = { minimum: 0, optimal: 0, assigned: 0, employees: [] };
            let priority = priorities[day][hour];
            coverage[day][hour].minimum = coverageTargets[priority].minimum;
            coverage[day][hour].optimal = coverageTargets[priority].optimal;
        }
    }
    console.log('Coverage initialized:', JSON.stringify(coverage));
    return coverage;
}



// Evaluates the available shifts and selects the one that best covers the needed hours, considering both coverage and desirability.
function selectBestShift(hour, day, coverage, optimal = false) {
    let possibleShifts = shiftLibrary.filter(shift => {
        let shiftHours = getShiftHours(shift);
        return shiftHours.includes(hour); // Filter shifts that can cover the current hour
    });
    console.log(`Selecting best shift for ${day} at ${hour}, Optimal: ${optimal}`);
    let highestScore = -1;
    let bestShift = null;
    for (let shift of possibleShifts) {
        let coverageScore = evaluateShiftCoverage(shift, day, coverage, optimal);
        if (coverageScore > highestScore) {
            highestScore = coverageScore;
            bestShift = shift;
        }
    }
    console.log(bestShift ? `Best shift selected: ID ${bestShift.id} with score ${highestScore}` : "No suitable shift found");
    return bestShift;
}




function assignShiftToEmployee(shift, day, coverage, employee) {
    let shiftHours = getShiftHours(shift);
    console.log(`Assigning shift ${shift.id} for ${employee.nom} on ${day}: covers ${shiftHours.join(', ')}`);
    shiftHours.forEach(hour => {
        if (coverage[day] && coverage[day][hour]) {
            if (!coverage[day][hour].employees.includes(employee.nom)) {
                coverage[day][hour].assigned += 1;
                coverage[day][hour].employees.push(employee.nom);
            }
        } else {
            console.log(`Warning: Attempting to assign uncovered hour ${hour} for ${day}`);
        }
    });
}






// Helper function that calculates the coverage score of each shift based on how well it covers the hours with the highest priority.
function evaluateShiftCoverage(shift, day, coverage, optimal) {
    let score = 0;
    let shiftHours = getShiftHours(shift);
    //console.log(`Evaluating shift coverage for shift ID ${shift.id} on ${day}, Optimal: ${optimal}`);
    shiftHours.forEach(hour => {
        //console.log(`Checking coverage for ${day} at ${hour}`);
        if (coverage[day] && coverage[day][hour]) {
            if (optimal) {
                if (coverage[day][hour].assigned < coverage[day][hour].optimal) {
                    score += priorities[day][hour];
                }
            } else {
                if (coverage[day][hour].assigned < coverage[day][hour].minimum) {
                    score += priorities[day][hour];
                }
            }
        } else {
            console.log(`Warning: Missing coverage data for ${day} at ${hour}`);
        }
    });
    return score + shift.desirability;
}



// Helper function that returns an array of hours that a given shift covers, with added logging for clarity.
function getShiftHours(shift) {
    let hours = [];
    if (shift.type === 'continuous') {
        let startHour = parseInt(shift.start.split(':')[0], 10);
        let endHour = parseInt(shift.end.split(':')[0], 10);
        for (let hour = startHour; hour < endHour; hour++) {
            hours.push(`${hour.toString().padStart(2, '0')}:00`); // Ensuring two-digit format
        }
    } else if (shift.type === 'split') {
        shift.parts.forEach(part => {
            let startHour = parseInt(part.start.split(':')[0], 10);
            let endHour = parseInt(part.end.split(':')[0], 10);
            for (let hour = startHour; hour < endHour; hour++) {
                hours.push(`${hour.toString().padStart(2, '0')}:00`); // Ensuring two-digit format
            }
        });
    }
    //console.log(hours);
    return hours;
}



// Helper function to check if any employee has a repos day
function isReposDay(day, employee) {
    //console.log('Checking for repos day:', employee);
    return employee.shifts.some(shift => shift.jour === day && shift.shifts.includes('repos'));

}


function assignShifts(coverage, extractedSchedule) {
    let daysSorted = Object.keys(priorities).sort((a, b) =>
        Object.values(priorities[b]).reduce((acc, cur) => acc + cur) -
        Object.values(priorities[a]).reduce((acc, cur) => acc + cur)
    );

    console.log("Starting shift assignment process...");
    for (let day of daysSorted) {
        console.log("Minimal coverage...");
        assignShiftsForDay(coverage, extractedSchedule, day, false); // First pass for minimum requirements
        console.log("Optimal coverage...");
        assignShiftsForDay(coverage, extractedSchedule, day, true); // Second pass for optimal coverage
    }
}

function assignShiftsForDay(coverage, extractedSchedule, day, isOptimal) {
    let employees = extractedSchedule.employes.filter(employee => {
        // Filter out employees who have a repos day
        if (isReposDay(day, employee)) {
            return false;
        }
        // During the optimal pass, also filter out employees who already have shifts assigned on that day
        if (isOptimal) {
            return !hasShiftsAssignedThatDay(employee, day, coverage);
        }
        return true;
    });

    for (let employee of employees) {
        let bestShiftOverall = null;
        let bestScoreOverall = -1;

        // Evaluate each shift for its overall coverage contribution for the day
        shiftLibrary.forEach(shift => {
            let shiftHours = getShiftHours(shift);
            let shiftScore = shiftHours.reduce((total, hour) => {
                if (coverage[day][hour]) {
                    let needed = isOptimal ? coverage[day][hour].optimal : coverage[day][hour].minimum;
                    return total + (coverage[day][hour].assigned < needed ? priorities[day][hour] : 0);
                }
                return total;
            }, 0);

            if (shiftScore > bestScoreOverall) {
                bestShiftOverall = shift;
                bestScoreOverall = shiftScore;
            }
        });

        // If a suitable shift is found, assign it
        if (bestShiftOverall) {
            assignShiftToEmployee(bestShiftOverall, day, coverage, employee);
        }
    }
}



function hasShiftsAssignedThatDay(employee, day, coverage) {
    return Object.keys(coverage[day]).some(hour => coverage[day][hour].employees.includes(employee.nom));
}




// Balances the weekly hours for each employee to match their contractual hours
function balanceEmployeeHours(coverage, extractedSchedule) {
    extractedSchedule.employes.forEach(employee => {
        let totalHours = getTotalAssignedHours(employee, coverage); // Calculate initial total hours assigned
        let neededHours = employee.heuresSemaine;

        if (totalHours < neededHours) {
            // Employee needs more hours
            while (totalHours < neededHours) {
                let assigned = false;
                for (let day in coverage) {
                    if (!assigned && getShiftHoursByEmployee(employee, day, coverage).length < 7) { // Assuming 7 hours as a typical daily maximum
                        let possibleShift = findShiftToAdd(employee, day, coverage);
                        if (possibleShift) {
                            assignShiftToEmployee(possibleShift, day, coverage, employee);
                            totalHours++;
                            assigned = true;
                        }
                    }
                }
                if (!assigned) break; // If no day is available to add a shift, exit the loop
            }
        } else if (totalHours > neededHours) {
            // Employee has too many hours
            while (totalHours > neededHours) {
                let reduced = false;
                for (let day in coverage) {
                    if (!reduced && getShiftHoursByEmployee(employee, day, coverage).length > 6) { // Assuming 6 hours as a daily minimum
                        let possibleShift = findShiftToRemove(employee, day, coverage);
                        if (possibleShift) {
                            assignShiftToEmployee(possibleShift, day, coverage, employee, true); // True to indicate reduction of hours
                            totalHours--;
                            reduced = true;
                        }
                    }
                }
                if (!reduced) break; // If no day is available to remove a shift, exit the loop
            }
        }
    });
}

// Helper function to find a shift that is one hour longer than the current shift on a specific day
function findShiftToAdd(employee, day, coverage) {
    let assignedShifts = getShiftHoursByEmployee(employee, day, coverage);
    if (assignedShifts.length === 0) return null;

    let shiftToAdd = null;
    let minDesirability = Infinity;

    shiftLibrary.forEach(shift => {
        let shiftHours = getShiftHours(shift); // shiftHours should be an array of objects or strings
        assignedShifts.forEach(assignedHour => {
            let assignedShiftDuration = 1; // Since each 'assignedHour' represents one hour
            let shiftDuration = shiftHours.length; // Total duration of the shift
            if (shiftDuration === assignedShiftDuration + 1 && shiftDuration <= 8) {
                if (shift.desirability < minDesirability) {
                    minDesirability = shift.desirability;
                    shiftToAdd = shift;
                }
            }
        });
    });

    return shiftToAdd;
}

// Helper function to find a shift that is one hour shorter than the current shift on a specific day
function findShiftToRemove(employee, day, coverage) {
    let assignedShifts = getShiftHoursByEmployee(employee, day, coverage); // Get the hours the employee is already assigned on that day
    if (assignedShifts.length === 0) return null; // If no shifts assigned, no shift to reduce

    let shiftToRemove = null;
    let minDesirability = Infinity;

    shiftLibrary.forEach(shift => {
        let shiftHours = getShiftHours(shift);
        assignedShifts.forEach(assignedHour => {
            let assignedShiftDuration = 1;
            let shiftDuration = shiftHours.length;
            if (shiftDuration === assignedShiftDuration - 1 && shiftDuration >= 6) { // Find a shift one hour shorter, not going below 6 hours total
                if (shift.desirability < minDesirability) {
                    minDesirability = shift.desirability;
                    shiftToRemove = shift;
                }
            }
        });
    });

    return shiftToRemove;
}

// Utility to calculate the duration of assigned hours from start and end times
function calculateDurationFromHours(shift) {
    let startHour = parseInt(shift.start.split(':')[0], 10);
    let endHour = parseInt(shift.end.split(':')[0], 10);
    return endHour - startHour;
}





// Calculate the total assigned hours for an employee based on the shifts assigned in the coverage object
function getTotalAssignedHours(employee, coverage) {
    let totalHours = 0;
    for (let day in coverage) {
        for (let hour in coverage[day]) {
            if (coverage[day][hour].employees.includes(employee.nom)) {
                totalHours += 1; // Each hour of assigned shift adds one hour to the total
            }
        }
    }
    return totalHours;
}



// Checks if an employee is already assigned to a specific shift on a specific day and hour
function isEmployeeAssigned(employee, day, hour, coverage) {
    return coverage[day][hour].employees.includes(employee.nom);
}


// Retrieve the hours an employee is scheduled for on a given day
function getShiftHoursByEmployee(employee, day, coverage) {
    let assignedHours = [];
    Object.keys(coverage[day]).forEach(hour => {
        if (coverage[day][hour].employees.includes(employee.nom)) {
            assignedHours.push(hour);
        }
    });
    return assignedHours;
}


// Function to print the schedule in a human-readable format
function printSchedule(coverage) {
    console.log('Final Shift Coverage:');
    for (const day in coverage) {
        console.log(`\nDay: ${day}`); // Print the day
        let employeeShifts = {}; // Object to store shifts by employee name

        // Collect all shifts for each employee on this day
        for (const hour in coverage[day]) {
            const hourCoverage = coverage[day][hour];
            hourCoverage.employees.forEach(employee => {
                if (!employeeShifts[employee]) {
                    employeeShifts[employee] = [];
                }
                // Add the hour to this employee's shifts for the day if not already included
                if (!employeeShifts[employee].includes(hour)) {
                    employeeShifts[employee].push(hour);
                }
            });
        }

        // Sort and print each employee's shifts
        for (const employee in employeeShifts) {
            let shifts = employeeShifts[employee].sort(); // Sort the hours for continuity
            let shiftString = formatShifts(shifts); // Format the sorted hours into shift blocks
            console.log(`${employee} : ${shiftString}`);
        }
    }
}

// Helper function to format sorted shift hours into continuous blocks
function formatShifts(shifts) {
    let formattedShifts = [];
    let currentShift = null;

    shifts.forEach((hour, index) => {
        let currentHour = parseInt(hour.split(':')[0], 10);
        if (!currentShift) {
            currentShift = { start: currentHour, end: currentHour };
        } else {
            if (currentHour === currentShift.end + 1) {
                currentShift.end = currentHour; // Continue the current shift
            } else {
                // End the current shift and start a new one
                formattedShifts.push(`${currentShift.start}:00 - ${currentShift.end + 1}:00`);
                currentShift = { start: currentHour, end: currentHour };
            }
        }

        // If it's the last hour in the array, close the current shift
        if (index === shifts.length - 1) {
            formattedShifts.push(`${currentShift.start}:00 - ${currentShift.end + 1}:00`);
        }
    });

    return formattedShifts.join(' / '); // Join all shift blocks with slashes
}




(function() {
    'use strict';
    // Initialize the shift coverage based on priorities
    let coverage = initializeShiftCoverage();

    // Assign shifts to ensure minimum coverage
    assignShifts(coverage, extractedSchedule);

    // Balance the weekly hours for each employee
    //balanceEmployeeHours(coverage, extractedSchedule);

    // Print the final schedule
    printSchedule(coverage);

})();
