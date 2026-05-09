-- =========================================
-- Holder Control
-- =========================================

CREATE TABLE hld_tbls (
    hld_code      NVARCHAR(20)      NOT NULL,
    eqp_code      NVARCHAR(20)      NULL,
    emp_code      NVARCHAR(10)      NULL,
    flw_code      NVARCHAR(20)      NULL,
    hld_reason    NVARCHAR(MAX)     NULL,
    hld_status    NVARCHAR(20)      NULL,
    hld_location  NVARCHAR(100)     NULL,
    hld_date      DATETIMEOFFSET(7)  NULL,
    [delete]      NVARCHAR(1)       NULL,
    createdBy     NVARCHAR(30)      NULL,
    updatedBy     NVARCHAR(30)      NULL,
    createAt      DATETIMEOFFSET(7)  NULL,
    updateAt      DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_hld_tbls PRIMARY KEY (hld_code)
);