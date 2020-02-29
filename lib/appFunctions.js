'use strict';

const { prompt } = require(`inquirer`);
const cTable = require(`console.table`);
const {
  prompts,
  initPrompts,
  employeeChoices,
  roleChoices,
  departmentChoices,
  employeeIds,
  roleIds,
  departmentIds
} = require(`./prompts`);
const queries = require(`./queries`);
const app = require(`../app`);

function initApp() {
  initPrompts();

  prompt(prompts.main).then(answer => {
    switch (answer.action) {
    case `View database`:
      prompt(prompts.view).then(answer => {
        switch (answer.View) {
        case `Employees`:
          view(`employees`);
          break;
        case `Departments`:
          view(`departments`);
          break;
        case `Roles`:
          view(`roles`);
          break;
        case `Employees by Department`:
          view(`employeesDepartment`);
          break;
        case `Employees by Manager`:
          view(`employeesManager`);
          break;
        case `Department Budget Utilized`:
          view(`budget`);
          break;
        case `Back`:
          initApp();
          break;
        default:
          console.log(`Exiting.`);
          app.connection.end();
        }
      });
      break;
    case `Add to database`:
      prompt(prompts.add).then(answer => {
        switch (answer.Add) {
        case `Employee`:
          add(`employee`);
          break;
        case `Department`:
          add(`department`);
          break;
        case `Role`:
          add(`role`);
          break;
        case `Back`:
          initApp();
          break;
        default:
          console.log(`Exiting.`);
          app.connection.end();
        }
      });
      break;
    case `Update database`:
      prompt(prompts.update).then(answer => {
        switch (answer.Update) {
        case `Employee Role`:
          update(`employeeRole`);
          break;
        case `Employee Manager`:
          update(`employeeManager`);
          break;
        case `Back`:
          initApp();
          break;
        default:
          console.log(`Exiting.`);
          app.connection.end();
        }
      });
      break;
    case `Delete from database`:
      prompt(prompts.remove).then(answer => {
        switch (answer.Remove) {
        case `Employee`:
          remove(`employee`);
          break;
        case `Department`:
          remove(`department`);
          break;
        case `Role`:
          remove(`role`);
          break;
        case `Back`:
          initApp();
          break;
        default:
          console.log(`Exiting.`);
          app.connection.end();
        }
      });
      break;
    case `Back`:
      initApp();
      break;
    default:
      console.log(`Exiting application.`);
      app.connection.end();
    }
  });
}

function view(choice) {
  switch (choice) {
  case `departments`:
    getQuery(`view`, queries.allDepartments);
    break;
  case `roles`:
    getQuery(`view`, queries.allRoles);
    break;
  case `employees`:
    getQuery(`view`, queries.allEmployees);
    break;
  case `employeesDepartment`:
    prompt(prompts.viewEmployeesDepartment).then(answer => {
      const departmentIdIndex = departmentChoices.indexOf(
        answer.employeesDepartment
      );
      const departmentId = departmentIds[departmentIdIndex];

      getQuery(`view`, queries.employeesDepartment, departmentId);
    });
    break;
  case `employeesManager`:
    prompt(prompts.viewEmployeesManager).then(answer => {
      const managerIdIndex = employeeChoices.indexOf(answer.employeesManager);
      const managerId = employeeIds[managerIdIndex];

      getQuery(`view`, queries.employeesManager, managerId);
    });
    break;
  case `budget`:
    prompt(prompts.viewBudget).then(answer => {
      getQuery(`view`, queries.budget, answer.departmentBudget);
    });
    break;
  default:
    throw new Error(`Unexpected choice resulting in an error.`);
  }
}

function add(choice) {
  switch (choice) {
  case `employee`:
    employeeChoices.push(`NULL`);

    prompt(prompts.addEmployee).then(answer => {
      const roleId = roleChoices.indexOf(answer.role) + 1;
      const managerIdIndex = employeeChoices.indexOf(answer.manager);
      const managerId = employeeIds[managerIdIndex];

      getQuery(`add`, queries.addEmployee, {
        first_name: answer.firstName,
        last_name: answer.lastName,
        role_id: roleId,
        manager_id: managerId
      });

      console.log(
        `--- Added ${answer.firstName} ${answer.lastName} to the employee database! ---`
      );
    });
    break;
  case `department`:
    prompt(prompts.addDepartment).then(answer => {
      getQuery(`add`, queries.addDepartment, { name: answer.departmentName });

      console.log(`--- Added ${answer.departmentName} as a department! ---`);
    });
    break;
  case `role`:
    prompt(prompts.addRole).then(answer => {
      const departmentIdIndex = departmentChoices.indexOf(
        answer.roleDepartment
      );
      const departmentId = departmentIds[departmentIdIndex];

      getQuery(`add`, queries.addRole, {
        title: answer.roleName,
        salary: answer.salary,
        department_id: departmentId
      });

      console.log(`--- Added ${answer.roleName} as a role! ---`);
    });
    break;
  default:
    console.log(`Error!`);
    app.connection.end();
  }
}

function remove(choice) {
  switch (choice) {
  case `employee`:
    prompt(prompts.removeEmployee).then(answer => {
      const employeeIdIndex = employeeChoices.indexOf(answer.removeEmployee);
      const employeeId = employeeIds[employeeIdIndex];

      getQuery(`remove`, queries.removeEmployee, { id: employeeId });

      console.log(
        `--- Removed ${answer.removeEmployee} from the database ---`
      );
    });
    break;
  case `department`:
    prompt(prompts.removeDepartment).then(answer => {
      getQuery(`remove`, queries.removeDepartment, {
        name: answer.removeDepartment
      });

      console.log(
        `--- Removed ${answer.removeDepartment} as a department from the database ---`
      );
    });
    break;
  case `role`:
    prompt(prompts.removeRole).then(answer => {
      getQuery(`remove`, queries.removeRole, {
        title: answer.removeRole
      });

      console.log(
        `--- Removed ${answer.removeRole} as a role from the database ---`
      );
    });
    break;
  default:
    throw new Error(`Unexpected choice resulting in an error.`);
  }
}

function update(choice) {
  switch (choice) {
  case `employeeRole`:
    prompt(prompts.updateEmployeeRole).then(answer => {
      updateEmployee(
        answer.updateEmployee,
        roleChoices,
        answer.roleUpdate,
        roleIds,
        `role_id`
      );

      console.log(
        `--- Updated ${answer.updateEmployee}'s role to ${answer.roleUpdate} ---`
      );
    });
    break;
  case `employeeManager`:
    employeeChoices.push(`NULL`);

    prompt(prompts.updateEmployeeManager).then(answer => {
      updateEmployee(
        answer.updateEmployee,
        employeeChoices,
        answer.managerUpdate,
        employeeIds,
        `manager_id`
      );

      console.log(
        `--- Updated ${answer.updateEmployee}'s Manager to ${answer.managerUpdate} ---`
      );
    });
    break;
  default:
    console.log(`Error!`);
    app.connection.end();
  }
}

function updateEmployee(employee, choiceArr, columnUpdate, idArr, columnId) {
  const employeeIdIndex = employeeChoices.indexOf(employee);
  const employeeId = employeeIds[employeeIdIndex];
  const columnUpdateIndex = choiceArr.indexOf(columnUpdate);
  const choiceUpdate = idArr[columnUpdateIndex];
  const updateObj = { [columnId]: choiceUpdate };

  getQuery(`update`, queries.updateEmployee, [updateObj, { id: employeeId }]);
}

function getQuery(choice, type, setting) {
  app.connection.query(type, setting, (err, res) => {
    if (err) { throw err; }
    const table = cTable.getTable(res);

    switch (choice) {
    case `view`:
      if (res.length === 0) {
        console.log(`\nNo data! \nMay not be a manager. \nMay not have employees in the department yet.`);
      }
      console.log(`\n${ table}`);

      initApp();
      break;
    case `add`:
      initApp();
      break;
    case `remove`:
      initApp();
      break;
    case `update`:
      initApp();
      break;
    default:
      throw new Error(`Unexpected choice resulting in an error.`);
    }
  });
}

module.exports = {
  initApp
};
