-- =========================================
-- Vendor Control
-- =========================================

CREATE TABLE vdr_tbls (
    vdr_code      NVARCHAR(20)      NOT NULL,
    vdr_company   NVARCHAR(255)     NULL,
    vdr_name      NVARCHAR(100)     NULL,
    vdr_contact   NVARCHAR(50)      NULL,
    vdr_detail    NVARCHAR(MAX)     NULL,
    vdr_rating    NVARCHAR(10)      NULL,
    [delete]      NVARCHAR(1)       NULL,
    createdBy     NVARCHAR(30)      NULL,
    updatedBy     NVARCHAR(30)      NULL,
    createdAt     DATETIMEOFFSET(7)  NULL,
    updatedAt     DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_vdr_tbls PRIMARY KEY (vdr_code)
);