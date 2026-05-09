-- =========================================
-- Software Control
-- =========================================

CREATE TABLE soft_tbls (
    soft_code       NVARCHAR(20)      NOT NULL,
    soft_name       NVARCHAR(255)     NULL,
    typ_soft_code   NVARCHAR(10)      NULL,
    soft_key        NVARCHAR(MAX)     NULL,
    soft_file       NVARCHAR(255)     NULL,
    vdr_code        NVARCHAR(20)      NULL,
    soft_count      NVARCHAR(10)      NULL,
    soft_sub        NVARCHAR(5)       NULL,
    expire_date     DATETIMEOFFSET(7)  NULL,
    [delete]        NVARCHAR(1)       NULL,
    createdBy       NVARCHAR(30)      NULL,
    updatedBy       NVARCHAR(30)      NULL,
    createdAt       DATETIMEOFFSET(7)  NULL,
    updatedAt       DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_soft_tbls PRIMARY KEY (soft_code)
);