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

const initialShiftsLeft = 5;

const extractedSchedule = {
    "employes": [
        {
            "nom": "COLIN FANNY",
            "heuresSemaine": 38,
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

let dynamicPriority = JSON.parse(JSON.stringify(priorities));

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
    {
        "id": 18,
        "type": "split",
        "parts": [
            {
                "start": "08:00",
                "end": "14:00"
            },
        ],
        "desirability": 6
    },
    {
        "id": 19,
        "type": "split",
        "parts": [
            {
                "start": "13:00",
                "end": "20:00"
            },
        ],
        "desirability": 5
    },
        {
        "id": 20,
        "type": "split",
        "parts": [
            {
                "start": "14:00",
                "end": "20:00"
            },
        ],
        "desirability": 6
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
    // console.log('Coverage initialized:', JSON.stringify(coverage));
    return coverage;
}



/// Helper function to select the best shift based on dynamicPriority and desirability
function selectBestShift(day, coverage, isOptimal, piggybank) {
    let bestShift = null;
    let highestScore = -1;
    let bestCoverageScore = 0;

    shiftLibrary.forEach(shift => {
        let shiftScore = 0;
        let coverageScore = 0;
        let shiftHours = getShiftHours(shift);
        shiftHours.forEach(hour => {
            if (coverage[day] && coverage[day][hour]) {
                let needed = coverage[day][hour].minimum;
                let currentPriority = dynamicPriority[day][hour];

                // Only tally priority values if the minimum requirement isn't met
                if (coverage[day][hour].assigned < needed) {
                    coverageScore += currentPriority * 10; // Double the priority value points
                }
            }
        });

        // Calculate total shift score by adding desirability score to the coverage score
        shiftScore = coverageScore + shift.desirability;

        let shiftDuration = getShiftDuration(shift);

        if (shiftScore > highestScore && canAssignShift(piggybank, shiftDuration)) {
            bestShift = shift;
            highestScore = shiftScore;
            bestCoverageScore = coverageScore; // Update best coverage score
        }
    });

    // Log the best shift details if one has been selected
    if (bestShift) {
         console.log(`Selected best shift ID: ${bestShift.id} with total score: ${highestScore} (Coverage Score: ${bestCoverageScore}, Desirability: ${bestShift.desirability})`);
    }

    return bestShift;
}





function assignShiftToEmployee(shift, day, coverage, employee, piggybank, extractedSchedule) {
    let shiftHours = getShiftHours(shift);
    console.log(`Assigning shift ${shift.id} for ${employee.nom} on ${day}: covers ${shiftHours.join(', ')}`);
    shiftHours.forEach(hour => {
        if (coverage[day] && coverage[day][hour]) {
            if (!coverage[day][hour].employees.includes(employee.nom)) {
                coverage[day][hour].assigned += 1;
                coverage[day][hour].employees.push(employee.nom);
                // Decrement the priority for the covered hour
                if (dynamicPriority[day][hour] > 0) {
                    dynamicPriority[day][hour]--;
                }
            }
        } else {
            console.log(`Warning: Attempting to assign uncovered hour ${hour} for ${day}`);
        }
    });
    // Update piggybank after shift is assigned
    let shiftDuration = getShiftDuration(shift);
    employee.piggybank.shiftsAssigned += 1; // Increment shifts assigned
    employee.piggybank.hoursLeft -= shiftDuration; //Decrement hours left
    employee.piggybank = updatePiggybank(employee.piggybank, shiftDuration, employee.heuresSemaine, employee.piggybank.shiftsAssigned);
    //console.log(`Updating Piggybank for ${employee.nom}:`, employee.piggybank);
}




// Helper function that calculates the coverage score of each shift based on how well it covers the hours with the highest priority.
function evaluateShiftCoverage(shift, day, coverage, optimal) {
    let score = 0;
    let shiftHours = getShiftHours(shift);
    shiftHours.forEach(hour => {
        if (coverage[day] && coverage[day][hour]) {
            let currentPriority = dynamicPriority[day][hour]; // Use dynamic priority
            console.log("curent priority:", currentPriority);
            if (optimal) {
                if (coverage[day][hour].assigned < coverage[day][hour].optimal) {
                    score += currentPriority;
                }
            } else {
                if (coverage[day][hour].assigned < coverage[day][hour].minimum) {
                    score += currentPriority;
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
    console.log("Starting shift assignment process...");
    extractedSchedule.employes.forEach(employee => {
        // Initialize the piggybank for each employee
        employee.piggybank = initializePiggybank(employee.heuresSemaine, initialShiftsLeft);
        console.log(`Piggybank initialized for ${employee.nom}:`, JSON.stringify(employee.piggybank));
    });

    // Continue with the rest of the shift assignment logic
    Object.keys(priorities).sort((a, b) =>
                                 Object.values(priorities[b]).reduce((acc, cur) => acc + cur) -
                                 Object.values(priorities[a]).reduce((acc, cur) => acc + cur)
                                ).forEach(day => {
        console.log("Processing day:", day);
        extractedSchedule.employes.forEach(employee => {
            if (isReposDay(day, employee)) {
                console.log(`Skipping repos day for ${employee.nom} on ${day}`);
                return;
            }

            assignShiftsForDay(coverage, extractedSchedule, day, false, employee, employee.piggybank);
            assignShiftsForDay(coverage, extractedSchedule, day, true, employee, employee.piggybank);
        });
    });
}


function assignShiftsForDay(coverage, extractedSchedule, day, isOptimal, employee, piggybank) {
    extractedSchedule.employes.forEach(employee => {
        if (!isReposDay(day, employee) && !hasShiftsAssignedThatDay(employee, day, coverage)) {
            let bestShift = selectBestShift(day, coverage, isOptimal, employee.piggybank);
            if (bestShift) {
                assignShiftToEmployee(bestShift, day, coverage, employee, employee.piggybank);
            }
        }
    });
}




function hasShiftsAssignedThatDay(employee, day, coverage) {
    return Object.keys(coverage[day]).some(hour => coverage[day][hour].employees.includes(employee.nom));
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

// Function to log the hourly coverage for each hour of each day
function logHourlyCoverage(coverage) {
    console.log("Hourly Coverage Report:");
    for (const day in coverage) {
        console.log(`\nDay: ${day}`); // Print the day
        for (const hour in coverage[day]) {
            const numEmployees = coverage[day][hour].employees.length;
            console.log(`Hour ${hour}: ${numEmployees}.`);
        }
    }
}

// Function to calculate and log the total assigned hours for each employee compared to their contracted hours
function balanceEmployeeHours(coverage, extractedSchedule) {
    console.log('Balancing employee hours...');
    extractedSchedule.employes.forEach(employee => {
        // Calculate total assigned hours from the coverage data
        let totalAssignedHours = getTotalAssignedHours(employee, coverage);
        let contractedHours = employee.heuresSemaine;

        // Determine if the employee is over or under their contracted hours
        let hourDifference = totalAssignedHours - contractedHours;

        // Log the balance state for each employee
        if (hourDifference > 0) {
            console.log(`${employee.nom} is over by ${hourDifference.toFixed(1)} hours.`);
        } else if (hourDifference < 0) {
            console.log(`${employee.nom} is under by ${Math.abs(hourDifference).toFixed(1)} hours.`);
        } else {
            console.log(`${employee.nom} has perfectly balanced hours.`);
        }
    });
}


//_______________________________________________
// NEW STUFF:

function initializePiggybank(hoursPerWeek, shiftsLeft) {
    let combinations = {
        '6h': 0,
        '7h': 0,
        '8h': 0,
        'shiftsAssigned':0,
        'hoursLeft': hoursPerWeek,
    };

    // Try all combinations to find any that sum up to hoursPerWeek with exactly 5 shifts
    for (let num8h = 0; num8h <= Math.floor(hoursPerWeek / 8); num8h++) {
        for (let num7h = 0; num7h <= Math.floor((hoursPerWeek - 8 * num8h) / 7); num7h++) {
            let remainingHours = hoursPerWeek - 8 * num8h - 7 * num7h;
            if (remainingHours % 6 === 0) {
                let num6h = remainingHours / 6;
                if (num6h + num7h + num8h === shiftsLeft) {
                    // Record the highest feasible number of each shift type across all valid combinations
                    combinations['6h'] = Math.max(combinations['6h'], num6h);
                    combinations['7h'] = Math.max(combinations['7h'], num7h);
                    combinations['8h'] = Math.max(combinations['8h'], num8h);
                }
            }
        }
    }


    return combinations;

}




function updatePiggybank(piggybank, assignedShiftLength, totalHours, shiftsAssigned) {
    // Calculate new total hours after assigning a shift
    let newTotalHours = piggybank.hoursLeft;

    // Decrement shiftsLeft since one shift is assigned
    let newShiftsLeft = initialShiftsLeft - shiftsAssigned;

    // Recompute the possible combinations based on the new total hours and reduced shift count
    let newPiggybank = initializePiggybank(newTotalHours, newShiftsLeft);

    // Update the original piggybank object
    piggybank['6h'] = newPiggybank['6h'];
    piggybank['7h'] = newPiggybank['7h'];
    piggybank['8h'] = newPiggybank['8h'];

    //console.log('Piggybank updated after assigning a shift:', JSON.stringify(piggybank));
    return piggybank;
}



function canAssignShift(piggybank, shiftLength) {
    if (!piggybank) {
        console.error('Piggybank is undefined.');
        return false;
    }
    if (!piggybank.hasOwnProperty(`${shiftLength}h`)) {
        console.error(`Piggybank does not have the property: ${shiftLength}h`);
        return false;
    }
    return piggybank[`${shiftLength}h`] > 0;
}




// Helper function to get the duration of a shift
function getShiftDuration(shift) {
    if (shift.type === 'continuous') {
        let startHour = parseInt(shift.start.split(':')[0], 10);
        let endHour = parseInt(shift.end.split(':')[0], 10);
        return endHour - startHour;
    } else if (shift.type === 'split') {
        let totalDuration = 0;
        shift.parts.forEach(part => {
            let startHour = parseInt(part.start.split(':')[0], 10);
            let endHour = parseInt(part.end.split(':')[0], 10);
            totalDuration += endHour - startHour;
        });
        return totalDuration;
    }
}




(function() {
    'use strict';
    // Initialize the shift coverage based on priorities
    let coverage = initializeShiftCoverage();


    // Assign shifts to ensure minimum coverage
    assignShifts(coverage, extractedSchedule, 0);

    // Balance the weekly hours for each employee
    //balanceEmployeeHours(coverage, extractedSchedule);

    // Print the final schedule
    printSchedule(coverage);
    logHourlyCoverage(coverage);
    balanceEmployeeHours(coverage, extractedSchedule);

})();
