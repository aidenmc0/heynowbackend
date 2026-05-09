-- =========================================
-- Purchase Control
-- =========================================

CREATE TABLE pur_tbls (
    pur_code         VARCHAR(30)        NOT NULL,
    emp_code         VARCHAR(20)        NULL,
    flw_code         VARCHAR(30)        NULL,
    vdr_code         VARCHAR(20)        NULL,
    pur_detail       NVARCHAR(255)      NULL,
    pur_file         NVARCHAR(255)      NULL,
    pur_price        NVARCHAR(50)       NULL,
    pur_pr           VARCHAR(50)        NULL,
    pur_prLink       NVARCHAR(255)      NULL,
    pur_po           VARCHAR(50)        NULL,
    pur_poFile       NVARCHAR(255)      NULL,
    pur_receiver     NVARCHAR(100)      NULL,
    pur_receiveIMG   NVARCHAR(255)      NULL,
    pur_receiveDate  DATETIMEOFFSET(7)  NULL,
    pur_status       VARCHAR(20)        NULL,
    [delete]         CHAR(2)            NOT NULL,
    createdBy        VARCHAR(50)        NULL,
    updatedBy        VARCHAR(50)        NULL,
    createdAt        DATETIMEOFFSET(7)  NOT NULL,
    updatedAt        DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_pur_tbls PRIMARY KEY (pur_code)
);