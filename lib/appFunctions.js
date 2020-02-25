'use strict';

const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const queries = require('./queries');
const app = require('../app');

const roleChoices = [];
const employeeChoices = [];
const departmentChoices = [];
const employeeIds = [];

function prompt() {
  updateInfo(getDatabaseInfo);

  inquirer.prompt(prompts.prompts.main).then(answer => {
    switch (answer.action) {
      case 'View database':
        inquirer.prompt(prompts.prompts.view).then(answer => {
          switch (answer.View) {
            case 'Employees':
              view('employees');
              break;
            case 'Departments':
              view('departments');
              break;
            case 'Roles':
              view('roles');
              break;
            case 'Employees by Department':
              view('employeesDepartment');
              break;
            case 'Employees by Manager':
              view('employeesManager');
              break;
            case 'Managers':
              view('managers');
              break;
            case 'Department Budget Utilized':
              view('budget');
              break;
            case 'Back':
              prompt();
              break;
            default:
              console.log('Error');
              app.connection.end();
          }
        });
        break;
      case 'Add to database':
        inquirer.prompt(prompts.prompts.add).then(answer => {
          switch (answer.Add) {
            case 'Employee':
              // addEmployee();
              add('employee');
              break;
            case 'Department':
              add('department');
              break;
            case 'Role':
              add('role');
              break;
            case 'Back':
              prompt();
              break;
            default:
              app.connection.end();
          }
        });
        break;
      case 'Update database':
        inquirer.prompt(prompts.prompts.update).then(answer => {
          switch (answer.Update) {
            case 'Employee Role':
              updateEmployeeRole();
              break;
            case 'Employee Manager':
              // need this
              break;
            case 'Back':
              prompt();
              break;
            default:
              app.connection.end();
          }
        });
        break;
      case 'Delete from database':
        inquirer.prompt(prompts.prompts.delete).then(answer => {
          switch (answer.Remove) {
            case 'Employee':
              // need this
              break;
            case 'Department':
              // need this
              break;
            case 'Role':
              // need this
              break;
            case 'Back':
              prompt();
              break;
            default:
              app.connection.end();
          }
        });
        break;
      case 'Back':
        prompt();
        break;
      case 'Exit':
        console.log('Exiting application.');
        app.connection.end();
    }
  });
}

function view(choice) {
  switch (choice) {
    case 'departments':
      getQuery(queries.allDepartments);
      break;
    case 'roles':
      getQuery(queries.allRoles);
      break;
    case 'employees':
      getQuery(queries.allEmployees);
      break;
    case 'employeesDepartment':
      // prompt to choose department then pass answer to getQuery
      getQuery(queries.employeesWhere, { id: 1 });
      break;
    case 'employeesManager':
      // prompt to choose manager then pass answer to getQuery
      getQuery(queries.employeesWhere, { manager_id: 1 });
      break;
    case 'managers':
      getQuery(queries.allManagers);
      break;
    case 'budget':
      // prompt to choose department then pass answer to getQuery
      getQuery(queries.budget, 'Sales');
      break;
    default:
      throw new Error('Unexpected choice, resulting in an error.');
  }
}

function add(choice) {
  switch (choice) {
    case 'employee':
      employeeChoices.push('NULL');

      inquirer.prompt(prompts.prompts.addEmployee).then(answer => {
        let roleId = roleChoices.indexOf(answer.role) + 1;
        let managerIdIndex = employeeChoices.indexOf(answer.manager);
        let managerId = employeeIds[managerIdIndex];

        getQuery(queries.addEmployee, {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId
        });
      });
      break;
    case 'department':
      inquirer.prompt(prompts.prompts.addDepartment).then(answer => {
        getQuery(queries.addDepartment, { name: answer.departmentName });
      });
      break;
    case 'role':
      inquirer.prompt(prompts.prompts.addRole).then(answer => {
        let departmentId = departmentChoices.indexOf(answer.roleDepartment) + 1;

        getQuery(queries.addRole, {
          title: answer.roleName,
          salary: answer.salary,
          department_id: departmentId
        });
      });
      break;
  }
}

function update(choice) {
  switch (choice) {
    case 'Employee Role':
      updateEmployeeRole();
      break;
    case 'Employee Manager':
      break;
  }
}

function updateEmployeeRole() {
  inquirer.prompt(prompts.prompts.updateEmployeeRole).then(answer => {
    let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
    let employeeId = employeeIds[employeeIdIndex];
    let newRole = roleChoices.indexOf(answer.roleUpdate) + 1;

    getQuery(queries.updateEmployeeRole, [
      { role_id: newRole },
      { id: employeeId }
    ]);
  });
}

function getQuery(type, setting) {
  app.connection.query(type, setting, (err, res) => {
    if (err) throw err;
    console.log(res);
    const table = cTable.getTable(res);
    console.log('\n' + table);
    prompt();
  });
}

function getDatabaseInfo(table, column) {
  let choiceArr;

  switch (table) {
    case 'department':
      choiceArr = departmentChoices;
      break;
    case 'role':
      choiceArr = roleChoices;
      break;
    case 'employee':
      choiceArr = employeeChoices;
      break;
    default:
      throw new Error('Unknown table, unexpected case.');
  }

  if (table === 'employee' && column === 'full_name') {
    employeeChoices.length = 0;

    app.connection.query(queries.employeesFullName, (err, res) => {
      if (err) throw err;
      for (const employees of res) {
        choiceArr.push(employees.full_name);
      }
    });
  } else {
    app.connection.query(`SELECT ${column} FROM ${table}`, (err, res) => {
      if (err) throw err;

      switch (column) {
        case 'name':
          departmentChoices.length = 0;

          for (const department of res) {
            choiceArr.push(department.name);
          }
          break;
        case 'title':
          roleChoices.length = 0;

          for (const role of res) {
            choiceArr.push(role.title);
          }
          break;
        case 'id':
          employeeIds.length = 0;

          for (const ids of res) {
            employeeIds.push(ids.id);
          }
          employeeIds.sort((a, b) => a - b);
          break;
        default:
          throw new Error('Unknown column, unexpected case.');
      }
    });
  }
}

function updateInfo(callback) {
  callback('role', 'title');
  callback('department', 'name');
  callback('employee', 'full_name');
  callback('employee', 'id');
}

module.exports = {
  prompt,
  getDatabaseInfo,
  employeeChoices,
  roleChoices,
  departmentChoices
};
