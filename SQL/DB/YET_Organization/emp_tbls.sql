-- =========================================
-- Employee Control with Supabase
-- =========================================

CREATE TABLE emp_tbls (
    emp_code       VARCHAR(10)    PRIMARY KEY,
    dep_code       VARCHAR(20)    NOT NULL,
    emp_img        VARCHAR(255),
    emp_type       VARCHAR(10)    NOT NULL,
    emp_prefix     VARCHAR(5)     NOT NULL,
    emp_name       VARCHAR(25)    NOT NULL,
    emp_surname    VARCHAR(25)    NOT NULL,
    emp_position   VARCHAR(10)    NOT NULL,
    emp_tel        VARCHAR(15)    NOT NULL,
    emp_password   VARCHAR(100)   NOT NULL,
    deleteflag     VARCHAR(1)     NOT NULL,
    createdby      VARCHAR(50)    NOT NULL,
    updatedby      VARCHAR(50),
    createdat      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updatedat      TIMESTAMP      NOT NULL DEFAULT NOW()
);