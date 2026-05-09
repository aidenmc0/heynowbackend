-- =========================================
-- Equipment Control
-- =========================================

CREATE TABLE eqp_tbls (
    eqp_code      VARCHAR(30)        NOT NULL,
    typ_eqp_code  VARCHAR(30)        NULL,
    pur_code      VARCHAR(30)        NULL,
    eqp_asset     VARCHAR(30)        NULL,
    eqp_serial    VARCHAR(50)        NULL,
    eqp_brand     VARCHAR(50)        NULL,
    eqp_serie     VARCHAR(50)        NULL,
    eqp_detail    NVARCHAR(MAX)      NULL,
    eqp_ip        VARCHAR(50)        NULL,
    eqp_status    VARCHAR(20)        NULL,
    [delete]      CHAR(1)            NULL,
    createdBy     VARCHAR(50)        NULL,
    updatedBy     VARCHAR(50)        NULL,
    createdAt     DATETIMEOFFSET(7)  NULL,
    updatedAt     DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_eqp_tbls PRIMARY KEY (eqp_code)
);