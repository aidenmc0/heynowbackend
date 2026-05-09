-- =========================================
-- Token Control
-- =========================================

CREATE TABLE token_tbls (
    token_code   NVARCHAR(20)      NOT NULL,
    emp_code     NVARCHAR(10)      NULL,
    token        NVARCHAR(MAX)     NULL,
    expired      DATETIMEOFFSET(7)  NULL,
    [delete]     NVARCHAR(1)       NULL,
    createdBy    NVARCHAR(30)      NULL,
    updatedBy    NVARCHAR(30)      NULL,
    createdAt    DATETIMEOFFSET(7)  NULL,
    updatedAt    DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_token_tbls PRIMARY KEY (token_code)
);