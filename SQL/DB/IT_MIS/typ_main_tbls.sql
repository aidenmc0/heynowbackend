-- =========================================
-- Type Maintenance Control
-- =========================================

CREATE TABLE typ_main_tbls (
    typ_main_code   NVARCHAR(10)      NOT NULL,
    typ_main_full   NVARCHAR(100)     NULL,
    typ_main_short  NVARCHAR(100)     NULL,
    [delete]        NVARCHAR(1)       NULL,
    createdBy       NVARCHAR(30)      NULL,
    updatedBy       NVARCHAR(30)      NULL,
    createdAt       DATETIMEOFFSET(7)  NULL,
    updatedAt       DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_typ_main_tbls PRIMARY KEY (typ_main_code)
);