-- =========================================
-- Holiday Override — วันที่เพิ่มเป็น Holiday
-- =========================================

CREATE TABLE price_holiday_tbls (
    holiday_id      VARCHAR(15)    PRIMARY KEY,
    specific_date   DATE           NOT NULL UNIQUE,
    note            VARCHAR(255),
    deleteflag      VARCHAR(1)     NOT NULL DEFAULT 'N',
    createdby       VARCHAR(50)    NOT NULL,
    updatedby       VARCHAR(50),
    createdat       TIMESTAMP      NOT NULL DEFAULT NOW(),
    updatedat       TIMESTAMP      NOT NULL DEFAULT NOW()
);
