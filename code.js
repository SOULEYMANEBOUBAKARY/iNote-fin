const SHEET_ID = '1OH5o6AAUgnx4yRpNQi1-bqHH1CrNZ5XtyLzrh1AfdX8';
const FORM_SHEET_NAME = 'Form Responses';
const LOGIN_SHEET_NAME = 'Login';

function doGet(e) {
  return HtmlService.createTemplateFromFile('index').evaluate().setTitle('Muhammad Rameez Imdad');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function loginUser(username, password) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const loginSheet = ss.getSheetByName(LOGIN_SHEET_NAME);
    const data = loginSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === username && data[i][1] === password) {
        // Set session property
        PropertiesService.getUserProperties().setProperty('username', username);
        return { status: 'success', message: 'Login successful!', username: username };
      }
    }
    return { status: 'error', message: 'Invalid username or password.' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function logoutUser() {
  PropertiesService.getUserProperties().deleteProperty('username');
  return { status: 'success', message: 'Logged out successfully!' };
}

function submitForm(formData) {
  try {
    const username = PropertiesService.getUserProperties().getProperty('username');
    if (!username) {
      return { status: 'error', message: 'User not logged in.' };
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_SHEET_NAME);
    sheet.appendRow([
      username,
      formData.requirement,
      formData.jobCategory,
      formData.fullName,
      formData.fullDetails,
      formData.education,
      formData.approxSalary,
      formData.officeTiming,
      formData.whatsappNo,
      formData.eaea,
      formData.city,
      formData.state
    ]);
    return { status: 'success', message: 'Form submitted successfully!' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function getUserData() {
  try {
    const username = PropertiesService.getUserProperties().getProperty('username');
    if (!username) {
      return { status: 'error', message: 'User not logged in.' };
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0].slice(1);
    const userData = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === username) {
        const rowData = data[i].slice(1);
        userData.push({
          rowIndex: i + 1,
          data: rowData
        });
      }
    }
    return {
      status: 'success',
      message: 'Data fetched successfully.',
      headers: headers,
      data: userData
    };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function getFormData(rowIndex) {
  try {
    const username = PropertiesService.getUserProperties().getProperty('username');
    if (!username) {
      return { status: 'error', message: 'User not logged in.' };
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_SHEET_NAME);
    const data = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (data[0] !== username) {
      return { status: 'error', message: 'Unauthorized action.' };
    }
    const formData = {
      requirement: data[1],
      jobCategory: data[2],
      fullName: data[3],
      fullDetails: data[4],
      education: data[5],
      approxSalary: data[6],
      officeTiming: data[7],
      whatsappNo: data[8],
      eaea: data[9],
      city: data[10],
      state: data[11]
    };
    return { status: 'success', data: formData };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function updateFormData(rowIndex, formData) {
  try {
    const username = PropertiesService.getUserProperties().getProperty('username');
    if (!username) {
      return { status: 'error', message: 'User not logged in.' };
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_SHEET_NAME);
    const data = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (data[0] !== username) {
      return { status: 'error', message: 'Unauthorized action.' };
    }
    const updatedData = [
      username,
      formData.requirement,
      formData.jobCategory,
      formData.fullName,
      formData.fullDetails,
      formData.education,
      formData.approxSalary,
      formData.officeTiming,
      formData.whatsappNo,
      formData.eaea,
      formData.city,
      formData.state
    ];
    sheet.getRange(rowIndex, 1, 1, updatedData.length).setValues([updatedData]);
    return { status: 'success', message: 'Data updated successfully.' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function deleteFormData(rowIndex) {
  try {
    const username = PropertiesService.getUserProperties().getProperty('username');
    if (!username) {
      return { status: 'error', message: 'User not logged in.' };
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_SHEET_NAME);
    const data = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (data[0] !== username) {
      return { status: 'error', message: 'Unauthorized action.' };
    }
    sheet.deleteRow(rowIndex);
    return { status: 'success', message: 'Data deleted successfully.' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function getDropdownData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Dropdown');
    const data = sheet.getDataRange().getValues();
    const dropdownData = {
      requirementJobMap: {},
      stateCityMap: {},
      requirements: [],
      states: []
    };
    for (let i = 1; i < data.length; i++) { // Assuming first row is headers
      const requirement = data[i][0];
      const job = data[i][1];
      const city = data[i][2];
      const state = data[i][3];

      // Build requirement to jobs mapping
      if (!dropdownData.requirementJobMap[requirement]) {
        dropdownData.requirementJobMap[requirement] = [];
        dropdownData.requirements.push(requirement);
      }
      if (!dropdownData.requirementJobMap[requirement].includes(job)) {
        dropdownData.requirementJobMap[requirement].push(job);
      }

      // Build state to cities mapping
      if (!dropdownData.stateCityMap[state]) {
        dropdownData.stateCityMap[state] = [];
        dropdownData.states.push(state);
      }
      if (!dropdownData.stateCityMap[state].includes(city)) {
        dropdownData.stateCityMap[state].push(city);
      }
    }
    return { status: 'success', data: dropdownData };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
