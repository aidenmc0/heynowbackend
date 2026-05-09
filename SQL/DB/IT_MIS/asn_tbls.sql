-- =========================================
-- Assignment Equipment
-- =========================================

CREATE TABLE asn_tbls (
    asn_code          VARCHAR(30)        NOT NULL,
    eqp_code          VARCHAR(30)        NOT NULL,
    emp_code          VARCHAR(20)        NOT NULL,
    flw_code          VARCHAR(30)        NULL,
    asn_reason        NVARCHAR(255)     NULL,
    asn_status        VARCHAR(20)        NOT NULL,
    asn_location      NVARCHAR(100)     NULL,
    asn_remark        NVARCHAR(255)     NULL,
    asn_assignImg     NVARCHAR(255)     NULL,
    asn_returnReason  NVARCHAR(255)     NULL,
    asn_returnImg     NVARCHAR(255)     NULL,
    [delete]          CHAR(1)            NOT NULL,
    createdBy         VARCHAR(50)        NOT NULL,
    updatedBy         VARCHAR(50)        NULL,
    createdAt         DATETIMEOFFSET(7)  NOT NULL,
    updatedAt         DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_asn_tbls PRIMARY KEY (asn_code)
);