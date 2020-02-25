'use strict';

const inquirer = require('inquirer');
const cTable = require('console.table');
const prompts = require('./prompts');
const queries = require('./queries');
const app = require('../app');

function prompt() {
  prompts.initPrompts();

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
              remove('employee');
              break;
            case 'Department':
              remove('department');
              break;
            case 'Role':
              remove('role');
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
      getQuery('view', queries.allDepartments);
      break;
    case 'roles':
      getQuery('view', queries.allRoles);
      break;
    case 'employees':
      getQuery('view', queries.allEmployees);
      break;
    case 'employeesDepartment':
      // prompt to choose department then pass answer to getQuery
      getQuery('view', queries.employeesWhere, { id: 1 });
      break;
    case 'employeesManager':
      // prompt to choose manager then pass answer to getQuery
      getQuery('view', queries.employeesWhere, { manager_id: 1 });
      break;
    case 'managers':
      getQuery('view', queries.allManagers);
      break;
    case 'budget':
      // prompt to choose department then pass answer to getQuery
      getQuery('view', queries.budget, 'Sales');
      break;
    default:
      throw new Error('Unexpected choice resulting in an error.');
  }
}

function add(choice) {
  switch (choice) {
    case 'employee':
      // employeeChoices.push('NULL');

      inquirer.prompt(prompts.prompts.addEmployee).then(answer => {
        let roleId = roleChoices.indexOf(answer.role) + 1;
        // let managerIdIndex = employeeChoices.indexOf(answer.manager);
        let managerId = employeeIds[managerIdIndex];

        getQuery('add', queries.addEmployee, {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId
        });
      });
      break;
    case 'department':
      inquirer.prompt(prompts.prompts.addDepartment).then(answer => {
        getQuery('add', queries.addDepartment, { name: answer.departmentName });
      });
      break;
    case 'role':
      inquirer.prompt(prompts.prompts.addRole).then(answer => {
        let departmentId = departmentChoices.indexOf(answer.roleDepartment) + 1;

        getQuery('add', queries.addRole, {
          title: answer.roleName,
          salary: answer.salary,
          department_id: departmentId
        });
      });
      break;
  }
}

function remove(choice) {
  switch (choice) {
    case 'employee':
      // prompt to choose employee
      getQuery('remove', queries.removeEmployee);
      break;
    case 'department':
      // prompt to choose department
      getQuery('remove', queries.removeDepartment);
      break;
    case 'role':
      // prompt to choose role
      getQuery('remove', queries.removeRole);
      break;
    default:
      throw new Error('Unexpected choice resulting in an error.');
  }
}

// function update(prompt, query, column) {
//   inquirer.prompt(prompt).then(answer => {
//     let columnChoice;

//     switch (column) {
//       case 'role':
//         columnChoice = answer.roleUpdate;
//         break;
//       case 'manager':
//         columnChoice = answer.managerUpdate;
//         break;
//     }

//     let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
//     let employeeId = employeeIds[employeeIdIndex];

//     let newInfo = roleChoices.indexOf(answer.roleUpdate) + 1;

//     getQuery(query, [{ role_id: newRole }, { id: employeeId }]);
//   });
// }

// function update(choice) {
//   switch (choice) {
//     case 'Employee Role':
//       inquirer.prompt(prompts.prompts.updateEmployeeRole).then(answer => {
//         let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
//         let employeeId = employeeIds[employeeIdIndex];
//         let newRole = roleChoices.indexOf(answer.roleUpdate) + 1;

//         getQuery('update', queries.updateEmployee, [
//           { role_id: newRole },
//           { id: employeeId }
//         ]);
//       });
//       break;
//     case 'Employee Manager':
//       inquirer.prompt(prompts.prompts.updateEmployeeRole).then(answer => {
//         let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
//         let employeeId = employeeIds[employeeIdIndex];
//         let newManager = roleChoices.indexOf(answer.roleUpdate) + 1;

//         getQuery('update', queries.updateEmployee, [
//           { manager_id: newManager },
//           { id: employeeId }
//         ]);
//       });
//       break;
//   }
// }

// function updateEmployeeRole() {
//   inquirer.prompt(prompts.prompts.updateEmployeeRole).then(answer => {
//     let employeeIdIndex = employeeChoices.indexOf(answer.updateEmployee);
//     let employeeId = employeeIds[employeeIdIndex];
//     let newRole = roleChoices.indexOf(answer.roleUpdate) + 1;

//     getQuery('update', queries.updateEmployee, [
//       { role_id: newRole },
//       { id: employeeId }
//     ]);
//   });
// }

function getQuery(choice, type, setting) {
  app.connection.query(type, setting, (err, res) => {
    if (err) throw err;

    switch (choice) {
      case 'view':
        const table = cTable.getTable(res);
        console.log('\n' + table);
        prompt();
        break;
      case 'add':
        console.log('-- Added! --');
        prompt();
        break;
      case 'remove':
        console.log('-- Removed! --');
        prompt();
        break;
      case 'update':
        console.log('-- Updated! --');
        prompt();
        break;
      default:
        app.connection.end();
    }
  });
}

module.exports = {
  prompt
};
