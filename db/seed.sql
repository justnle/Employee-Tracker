INSERT INTO
    department
    (name)
VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO
    role
    (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO
    employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Sean", "Carter", 1, 3),
    ("Kanye", "West", 2, 1),
    ("Aubrey", "Graham", 3, NULL),
    ("Rakim", "Mayers", 4, 3),
    ("Jermaine", "Cole", 5, NULL),
    ("Scott", "Mescudi", 6, NULL),
    ("Quavious", "Marshall", 7, 7),
    ("Ermias", "Asghedom", 3, 2);

ALTER TABLE employee ADD FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL;