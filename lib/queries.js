'use strict';

const allEmployees = `
SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name',
role.title AS 'Title', department.name AS 'Department', role.salary AS 'Salary',
concat(E.first_name, ' ', E.last_name) AS 'Manager Name'
FROM employee 
  INNER JOIN role 
      ON (employee.role_id = role.id)
  INNER JOIN department
      ON (role.department_id = department.id)
  LEFT JOIN employee E
      ON (employee.manager_id = E.id)
ORDER BY employee.id;
`;

const allDepartments = `SELECT name AS Departments FROM department`;

const allRoles = `SELECT title AS Roles FROM role`;

const addEmployee = `INSERT INTO employee SET ?`;

const addDepartment = `INSERT INTO department SET ?`;

const addRole = `INSERT INTO role SET ?`;

const updateEmployee = `UPDATE employee SET ? WHERE ?`;

const employeesFullName = `SELECT concat(first_name, ' ', last_name) AS full_name FROM employee`;

const employeesDepartment = `
SELECT concat(employee.first_name, ' ', employee.last_name) AS 'Department Employees'
FROM employee
LEFT JOIN role
  ON (employee.role_id = role.id)
LEFT JOIN department
  on (role.department_id = department.id)
WHERE department.id = ?`;

const employeesManager = `
SELECT concat(employee.first_name, ' ', employee.last_name) AS Staff
FROM employee
LEFT JOIN employee E
  on (employee.manager_id = E.id)
WHERE employee.manager_id = ?`;

const budget = `
SELECT department.name AS Department, sum(salary) AS 'Budget Utilized'
FROM employee
  INNER JOIN role
	  on employee.role_id = role.id
  INNER JOIN department
	  on role.department_id = department.id
WHERE department.name = ?;
`;

const removeEmployee = `DELETE FROM employee WHERE ?`;

const removeDepartment = `DELETE FROM department WHERE ?`;

const removeRole = `DELETE FROM role WHERE ?`;

module.exports = {
  allEmployees,
  allDepartments,
  allRoles,
  addEmployee,
  addDepartment,
  addRole,
  updateEmployee,
  employeesFullName,
  employeesDepartment,
  employeesManager,
  budget,
  removeEmployee,
  removeDepartment,
  removeRole
};
