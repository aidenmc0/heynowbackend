-- =========================================
-- Employee Control
-- =========================================

CREATE TABLE emp_tbls (
    emp_code       NVARCHAR(10)    NOT NULL,
    emp_no         INT             NOT NULL,
    dep_code       NVARCHAR(20)    NOT NULL,
    emp_img        NVARCHAR(255)   NULL,
    emp_type       NVARCHAR(10)    NOT NULL,
    emp_prefix     NVARCHAR(5)     NOT NULL,
    emp_name       NVARCHAR(25)    NOT NULL,
    emp_surname    NVARCHAR(25)    NOT NULL,
    emp_position   NVARCHAR(10)    NOT NULL,
    emp_email      NVARCHAR(100)   NOT NULL,
    emp_password   NVARCHAR(100)   NOT NULL,
    [delete]       NVARCHAR(1)     NOT NULL,
    createdBy      NVARCHAR(50)    NOT NULL,
    updatedBy      NVARCHAR(50)    NULL,
    createdAt      DATETIME2(7)    NOT NULL,
    updatedAt      DATETIME2(7)    NOT NULL,

    CONSTRAINT PK_emp_tbls PRIMARY KEY (emp_code)
);