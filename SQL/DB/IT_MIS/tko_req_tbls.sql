-- =========================================
-- Takeout Request Control
-- =========================================

CREATE TABLE tko_req_tbls (
    tko_req_code          VARCHAR(30)        NOT NULL,
    emp_code              VARCHAR(20)        NOT NULL,
    flw_code              VARCHAR(30)        NULL,
    tko_req_reason        NVARCHAR(255)      NULL,
    tko_req_takeoutDate   DATETIMEOFFSET(7)  NOT NULL,
    tko_req_returnDate    DATETIMEOFFSET(7)  NULL,
    tko_req_status        VARCHAR(20)        NOT NULL,
    [delete]              CHAR(1)            NOT NULL,
    createdBy             VARCHAR(50)        NOT NULL,
    updatedBy             VARCHAR(50)        NULL,
    createdAt             DATETIMEOFFSET(7)  NOT NULL,
    updatedAt             DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_tko_req_tbls PRIMARY KEY (tko_req_code)
);