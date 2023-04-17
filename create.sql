DROP TABLE IF EXISTS students CASCADE;
CREATE TABLE students(
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    year VARCHAR(15) NOT NULL,
    major VARCHAR(30) NOT NULL,
    degree VARCHAR(15) NOT NULL
);