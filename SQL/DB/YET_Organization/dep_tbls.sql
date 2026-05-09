-- =========================================
-- Department Control
-- =========================================

CREATE TABLE dep_tbls (
    dep_code    NVARCHAR(20)    NOT NULL,
    dep_full    NVARCHAR(100)   NULL,
    dep_short   NVARCHAR(15)    NULL,
    [delete]    NVARCHAR(1)     NULL,
    createdBy   NVARCHAR(50)    NULL,
    updatedBy   NVARCHAR(50)    NULL,
    createdAt   DATETIME2(7)    NOT NULL,
    updatedAt   DATETIME2(7)    NOT NULL,

    CONSTRAINT PK_dep_tbls PRIMARY KEY (dep_code)
);