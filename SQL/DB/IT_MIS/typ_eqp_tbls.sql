-- =========================================
-- Type Equipment Control
-- =========================================

CREATE TABLE typ_eqp_tbls (
    typ_eqp_code   NVARCHAR(20)      NOT NULL,
    typ_eqp_name   NVARCHAR(100)     NULL,
    [delete]       NVARCHAR(1)       NULL,
    createdBy      NVARCHAR(30)      NULL,
    updatedBy      NVARCHAR(30)      NULL,
    createdAt      DATETIMEOFFSET(7)  NULL,
    updatedAt      DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_typ_eqp_tbls PRIMARY KEY (typ_eqp_code)
);