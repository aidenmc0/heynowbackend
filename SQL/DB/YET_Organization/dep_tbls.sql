-- =========================================
-- Department Control
-- =========================================

CREATE TABLE dep_tbls (
    dep_code       NVARCHAR(20)    NOT NULL,
    dep_full       NVARCHAR(100)   NULL,
    dep_short      NVARCHAR(15)    NULL,
    deleteflag     VARCHAR(1)     NOT NULL,
    createdby      VARCHAR(50)    NOT NULL,
    updatedby      VARCHAR(50),
    createdat      TIMESTAMP      NOT NULL DEFAULT NOW(),
    updatedat      TIMESTAMP      NOT NULL DEFAULT NOW()

    CONSTRAINT PK_dep_tbls PRIMARY KEY (dep_code)
);