-- =========================================
-- Type Software Control
-- =========================================

CREATE TABLE typ_soft_tbls (
    typ_soft_code   NVARCHAR(10)      NOT NULL,
    typ_soft_name   NVARCHAR(100)     NULL,
    [delete]        NVARCHAR(1)       NULL,
    createdBy       NVARCHAR(30)      NULL,
    updatedBy       NVARCHAR(30)      NULL,
    createdAt       DATETIMEOFFSET(7)  NULL,
    updatedAt       DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_typ_soft_tbls PRIMARY KEY (typ_soft_code)
);