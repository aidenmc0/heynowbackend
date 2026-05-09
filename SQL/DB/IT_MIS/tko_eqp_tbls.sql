-- =========================================
-- Takeout Equipment Detail
-- =========================================

CREATE TABLE tko_eqp_tbls (
    tko_eqp_code              VARCHAR(30)        NOT NULL,
    tko_req_code              VARCHAR(30)        NOT NULL,
    eqp_code                  VARCHAR(30)        NOT NULL,
    tko_req_takeoutCheck      NVARCHAR(50)       NULL,
    tko_req_returnCheck       NVARCHAR(50)       NULL,
    tko_req_abnormalTakeout   NVARCHAR(50)       NULL,
    tko_req_abnormalReturn    NVARCHAR(50)       NULL,
    tko_req_takeoutCheckDate  DATETIMEOFFSET(7)  NULL,
    tko_req_returnCheckDate   DATETIMEOFFSET(7)  NULL,

    CONSTRAINT PK_tko_eqp_tbls PRIMARY KEY (tko_eqp_code)
);